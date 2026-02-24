import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import powershell from "highlight.js/lib/languages/powershell";
import "highlight.js/styles/github-dark.css";
import styles from "./CodeBlock.module.scss";
import { translate } from "../utils/lang/translate";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ContentCopyIcon } from "../icons";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("powershell", powershell);

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
  const highlightedCode = hljs.highlight(code, { language }).value;
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
