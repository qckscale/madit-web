#!/usr/bin/env node

/**
 * Replace blog post body content (body.en or body.sv) in Sanity.
 *
 * Usage:
 *   SANITY_API_TOKEN=<token> node scripts/patch-blog-content.mjs <documentId> <locale> <markdownFile>
 *
 * Example:
 *   SANITY_API_TOKEN=sk... node scripts/patch-blog-content.mjs 40e63326-a4e3-4acf-b603-5ca1aed2c268 en scripts/content/aks-retirement-en.md
 *
 * The script converts markdown to Sanity Portable Text blocks and replaces
 * the body.<locale> field on the document. Creates a draft if published.
 *
 * Pass --publish to also publish the draft after patching.
 */

import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "fs";
import { randomBytes } from "crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Auto-load .env.local if SANITY_API_TOKEN isn't already set
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
if (!process.env.SANITY_API_TOKEN && existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
      }
    }
  }
}

const PROJECT_ID = "rtmjambs";
const DATASET = "production";
const API_VERSION = "2024-01-01";

const token = process.env.SANITY_API_TOKEN;
if (!token) {
  console.error("Error: SANITY_API_TOKEN environment variable is required.");
  console.error(
    "You can find your token in Sanity: manage.sanity.io → project → API → Tokens"
  );
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token,
});

// --- Helpers ---

function genKey() {
  return randomBytes(6).toString("hex");
}

/**
 * Parse inline markdown formatting into Portable Text spans + markDefs.
 * Handles: **bold**, `code`, [text](url), and combinations.
 */
function parseInlineMarks(text) {
  const children = [];
  const markDefs = [];

  // Match bold, inline code, and links (non-greedy)
  const regex = /(\*\*(.+?)\*\*)|(`(.+?)`)|(\[([^\]]+?)\]\(([^)]+?)\))/g;

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index);
      if (plain) {
        children.push({
          _type: "span",
          _key: genKey(),
          text: plain,
          marks: [],
        });
      }
    }

    if (match[1]) {
      // Bold: **text**
      children.push({
        _type: "span",
        _key: genKey(),
        text: match[2],
        marks: ["strong"],
      });
    } else if (match[3]) {
      // Inline code: `text`
      children.push({
        _type: "span",
        _key: genKey(),
        text: match[4],
        marks: ["code"],
      });
    } else if (match[5]) {
      // Link: [text](url)
      const linkKey = genKey();
      markDefs.push({ _type: "link", _key: linkKey, href: match[7] });
      children.push({
        _type: "span",
        _key: genKey(),
        text: match[6],
        marks: [linkKey],
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      children.push({
        _type: "span",
        _key: genKey(),
        text: remaining,
        marks: [],
      });
    }
  }

  if (children.length === 0) {
    children.push({ _type: "span", _key: genKey(), text, marks: [] });
  }

  return { children, markDefs };
}

/**
 * Convert markdown string to Sanity Portable Text blocks.
 * Supports: headings, paragraphs, bullet/numbered lists, code blocks,
 * bold, inline code, and links.
 */
function markdownToPortableText(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim() || "text";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```

      blocks.push({
        _type: "code",
        _key: genKey(),
        language,
        code: codeLines.join("\n"),
      });
      continue;
    }

    // Heading (h1-h4)
    const headingMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const { children, markDefs } = parseInlineMarks(headingMatch[2]);
      blocks.push({
        _type: "block",
        _key: genKey(),
        style: `h${level}`,
        children,
        markDefs,
      });
      i++;
      continue;
    }

    // Bullet list item
    if (line.match(/^- /)) {
      const text = line.replace(/^- /, "");
      const { children, markDefs } = parseInlineMarks(text);
      blocks.push({
        _type: "block",
        _key: genKey(),
        style: "normal",
        listItem: "bullet",
        level: 1,
        children,
        markDefs,
      });
      i++;
      continue;
    }

    // Numbered list item
    const numberedMatch = line.match(/^\d+\.\s+(.+)/);
    if (numberedMatch) {
      const { children, markDefs } = parseInlineMarks(numberedMatch[1]);
      blocks.push({
        _type: "block",
        _key: genKey(),
        style: "normal",
        listItem: "number",
        level: 1,
        children,
        markDefs,
      });
      i++;
      continue;
    }

    // Regular paragraph
    const { children, markDefs } = parseInlineMarks(line.trim());
    blocks.push({
      _type: "block",
      _key: genKey(),
      style: "normal",
      children,
      markDefs,
    });
    i++;
  }

  return blocks;
}

// --- Main ---

async function main() {
  const args = process.argv.slice(2);
  const shouldPublish = args.includes("--publish");
  const positionalArgs = args.filter((a) => !a.startsWith("--"));

  if (positionalArgs.length < 3) {
    console.error(
      "Usage: SANITY_API_TOKEN=<token> node scripts/patch-blog-content.mjs <documentId> <locale> <markdownFile> [--publish]"
    );
    process.exit(1);
  }

  const [documentId, locale, mdFile] = positionalArgs;

  if (!["en", "sv"].includes(locale)) {
    console.error('Error: locale must be "en" or "sv"');
    process.exit(1);
  }

  // Read markdown
  const markdown = readFileSync(mdFile, "utf-8");
  const blocks = markdownToPortableText(markdown);

  console.log(
    `Parsed ${blocks.length} blocks from ${mdFile} (${blocks.filter((b) => b._type === "code").length} code blocks)`
  );

  // Patch the document
  const path = `body.${locale}`;
  console.log(`Patching ${documentId} → ${path}...`);

  // Default: create a draft. Pass --publish to go straight to production.
  const targetId = shouldPublish
    ? documentId
    : `drafts.${documentId.replace(/^drafts\./, "")}`;

  // If targeting a draft, ensure it exists (createIfNotExists from published doc)
  if (!shouldPublish) {
    const published = await client.getDocument(documentId);
    if (published) {
      await client.createIfNotExists({ ...published, _id: targetId });
    }
  }

  const result = await client.patch(targetId).set({ [path]: blocks }).commit();

  if (shouldPublish) {
    console.log(`Done. Published: ${result._id}`);
  } else {
    console.log(`Done. Draft created: ${result._id}`);
    console.log(`Review in Sanity Studio before publishing.`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
