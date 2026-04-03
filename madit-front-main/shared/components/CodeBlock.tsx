import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import powershell from "highlight.js/lib/languages/powershell";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import { definer as terraform } from "@taga3s/highlightjs-terraform";
import bicep from "./bicep";
import "highlight.js/styles/github-dark.css";
import styles from "./CodeBlock.module.scss";
import { translate } from "../utils/lang/translate";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ContentCopyIcon } from "../icons";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("powershell", powershell);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("json", json);

try {
  hljs.registerLanguage("terraform", terraform);
  hljs.registerLanguage("tf", terraform);
  hljs.registerLanguage("hcl", terraform);
} catch (e) {
  console.warn("Failed to register terraform language:", e);
}

try {
  hljs.registerLanguage("bicep", bicep);
} catch (e) {
  console.warn("Failed to register bicep language:", e);
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
  const [hasCopied, setHasCopied] = useState(false);
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";

  let highlightedCode: string;
  try {
    const lang = hljs.getLanguage(language) ? language : "powershell";
    highlightedCode = hljs.highlight(code, { language: lang }).value;
  } catch {
    highlightedCode = code;
  }

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
      <pre className={styles.codeBlock} data-language={language}>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </>
  );
}
