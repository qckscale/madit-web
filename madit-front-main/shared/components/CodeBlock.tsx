import { useEffect, useState } from "react";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { HighlighterCore } from "shiki/core";
import styles from "./CodeBlock.module.scss";
import { translate } from "../utils/lang/translate";
import { usePathname } from "next/navigation";
import { ContentCopyIcon } from "../icons";

let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [import("@shikijs/themes/dark-plus")],
      langs: [
        import("@shikijs/langs/bash"),
        import("@shikijs/langs/yaml"),
        import("@shikijs/langs/typescript"),
        import("@shikijs/langs/javascript"),
        import("@shikijs/langs/json"),
        import("@shikijs/langs/powershell"),
        import("@shikijs/langs/python"),
        import("@shikijs/langs/terraform"),
        import("@shikijs/langs/bicep"),
      ],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

interface CodeBlockProps {
  code: string;
  className?: string;
  language?: string;
}

export default function CodeBlock({
  code,
  language = "powershell",
  className,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [hasCopied, setHasCopied] = useState(false);
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";

  useEffect(() => {
    getHighlighter()
      .then((highlighter) => {
        const langs = highlighter.getLoadedLanguages();
        const lang = langs.includes(language!) ? language! : "powershell";
        setHtml(
          highlighter.codeToHtml(code, { lang, theme: "dark-plus" }),
        );
      })
      .catch(() => {
        setHtml(`<pre><code>${code}</code></pre>`);
      });
  }, [code, language]);

  const copy = () => {
    navigator.clipboard.writeText(code.toString());
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 1400);
  };

  return (
    <>
      <div className={styles.codeBlockToolbar}>
        <button onClick={copy} className="d-flex align-center">
          <ContentCopyIcon />
          {hasCopied
            ? `${translate("copied", locale)}!`
            : translate("copy_code", locale)}
        </button>
      </div>
      {html ? (
        <div
          className={styles.codeBlock}
          data-language={language}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className={styles.codeBlock} data-language={language}>
          <code>{code}</code>
        </pre>
      )}
    </>
  );
}
