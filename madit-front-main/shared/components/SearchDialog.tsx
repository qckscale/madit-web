"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { translate } from "../utils/lang/translate";
import { i18Link } from "../utils/lang/getLink";
import "./SearchDialog.scss";

interface SearchResult {
  title: string;
  url: string;
  ingress?: string;
  _type: string;
  category?: string;
}

interface SearchResults {
  articles: SearchResult[];
  services: SearchResult[];
  work: SearchResult[];
  pages: SearchResult[];
}

interface SearchDialogProps {
  locale: "sv" | "en";
}

type ResultGroup = { key: keyof SearchResults; labelKey: string; pathPrefix: string };

const RESULT_GROUPS: ResultGroup[] = [
  { key: "articles", labelKey: "search_articles", pathPrefix: "news" },
  { key: "services", labelKey: "search_services", pathPrefix: "service" },
  { key: "work", labelKey: "search_customer_cases", pathPrefix: "customer-case" },
  { key: "pages", labelKey: "search_pages", pathPrefix: "page" },
];

export function SearchDialog({ locale }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();
  const pathname = usePathname();

  const allResults = results
    ? RESULT_GROUPS.flatMap((group) =>
        results[group.key].map((item) => ({
          ...item,
          pathPrefix: group.pathPrefix,
        }))
      )
    : [];

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery("");
    setResults(null);
    setActiveIndex(-1);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
    setActiveIndex(-1);
  }, []);

  // Close on navigation
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, open, close]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&locale=${locale}`
        );
        const data = await res.json();
        setResults(data);
        setActiveIndex(-1);
      } catch {
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, locale]);

  const navigateToResult = useCallback(
    (result: (typeof allResults)[0]) => {
      router.push(i18Link(`${result.pathPrefix}/${result.url}`, locale));
      close();
    },
    [router, locale, close]
  );

  // Keyboard navigation within results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      return;
    }

    if (allResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < allResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : allResults.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigateToResult(allResults[activeIndex]);
    }
  };

  const isMac =
    typeof navigator !== "undefined" && navigator.userAgent.includes("Mac");
  const shortcutLabel = isMac ? "\u2318K" : "Ctrl+K";

  const hasResults =
    results &&
    (results.articles.length > 0 ||
      results.services.length > 0 ||
      results.work.length > 0 ||
      results.pages.length > 0);

  const hasEmptyResults = results && !hasResults && query.length >= 2;

  const SearchIcon = ({ size = 24 }: { size?: number }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="inherit"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 2C5.806 2 2 5.806 2 10.5S5.806 19 10.5 19c2.17 0 4.16-.814 5.67-2.152l4.49 4.49a1 1 0 0 0 1.414-1.414l-4.49-4.49A8.46 8.46 0 0 0 19 10.5C19 5.806 15.194 2 10.5 2Zm0 2a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Z"
        fill="inherit"
      />
    </svg>
  );

  if (!isOpen) {
    return (
      <button
        className="search-trigger unstyled"
        onClick={open}
        aria-label={translate("search", locale)}
      >
        <SearchIcon />
        <span className="search-trigger__shortcut">{shortcutLabel}</span>
      </button>
    );
  }

  let flatIndex = -1;

  const overlay = (
    <div className="search-overlay" onClick={close} onKeyDown={handleKeyDown}>
      <div
        className="search-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={translate("search", locale)}
      >
        <div className="search-dialog__input-wrapper">
          <span className="search-dialog__icon">
            <SearchIcon size={20} />
          </span>
          <input
            ref={inputRef}
            type="text"
            className="search-dialog__input"
            placeholder={translate("search_placeholder", locale)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={translate("search", locale)}
          />
          <button
            className="search-dialog__close unstyled"
            onClick={close}
            aria-label="Close"
          >
            <kbd>Esc</kbd>
          </button>
        </div>

        {isLoading && (
          <div className="search-dialog__loading">
            <div className="search-dialog__spinner" />
          </div>
        )}

        {hasResults && (
          <div className="search-dialog__results">
            {RESULT_GROUPS.map((group) => {
              const items = results![group.key];
              if (items.length === 0) return null;
              return (
                <div key={group.key} className="search-dialog__group">
                  <div className="search-dialog__group-label">
                    {translate(group.labelKey, locale)}
                  </div>
                  {items.map((item) => {
                    flatIndex++;
                    const idx = flatIndex;
                    return (
                      <button
                        key={`${group.key}-${item.url}`}
                        className={`search-dialog__result unstyled ${
                          idx === activeIndex
                            ? "search-dialog__result--active"
                            : ""
                        }`}
                        onClick={() =>
                          navigateToResult({
                            ...item,
                            pathPrefix: group.pathPrefix,
                          })
                        }
                        onMouseEnter={() => setActiveIndex(idx)}
                      >
                        <span className="search-dialog__result-title">
                          {item.title}
                        </span>
                        {item.ingress && (
                          <span className="search-dialog__result-ingress">
                            {item.ingress}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {hasEmptyResults && !isLoading && (
          <div className="search-dialog__empty">
            {translate("search_no_results", locale)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        className="search-trigger unstyled"
        onClick={open}
        aria-label={translate("search", locale)}
      >
        <SearchIcon />
        <span className="search-trigger__shortcut">{shortcutLabel}</span>
      </button>
      {createPortal(overlay, document.body)}
    </>
  );
}
