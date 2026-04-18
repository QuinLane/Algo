"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import java from "react-syntax-highlighter/dist/esm/languages/prism/java";
import cpp from "react-syntax-highlighter/dist/esm/languages/prism/cpp";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { AlgorithmInfoContent } from "@/lib/algorithms/types";

SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("java", java);
SyntaxHighlighter.registerLanguage("cpp", cpp);

type Lang = keyof AlgorithmInfoContent["code"];

const LANGS: { id: Lang; label: string; prismLang: string }[] = [
  { id: "javascript", label: "JavaScript", prismLang: "javascript" },
  { id: "python", label: "Python", prismLang: "python" },
  { id: "java", label: "Java", prismLang: "java" },
  { id: "cpp", label: "C++", prismLang: "cpp" },
];

interface Props {
  code: AlgorithmInfoContent["code"];
}

export default function CodeViewer({ code }: Props) {
  const [activeLang, setActiveLang] = useState<Lang>("javascript");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const active = LANGS.find((l) => l.id === activeLang)!;

  return (
    <div className="rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
        <div className="flex gap-1">
          {LANGS.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveLang(lang.id)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeLang === lang.id
                  ? "bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors px-2 py-1"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={active.prismLang}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "var(--color-bg-card)",
          fontSize: "0.78rem",
          lineHeight: "1.6",
          padding: "1.25rem",
        }}
        showLineNumbers
        lineNumberStyle={{
          color: "var(--color-text-muted)",
          opacity: 0.5,
          minWidth: "2.5em",
          paddingRight: "1em",
          userSelect: "none",
        }}
      >
        {code[activeLang]}
      </SyntaxHighlighter>
    </div>
  );
}
