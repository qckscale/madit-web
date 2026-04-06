import Link from "next/link";
import { i18Link } from "../utils/lang/getLink";
import { translate } from "../utils/lang/translate";
import "./Pagination.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  locale: string;
  category?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, locale, category }: PaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const pageLink = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (category) params.set("category", category);
    const qs = params.toString();
    return i18Link(qs ? `news?${qs}` : "news", locale);
  };

  return (
    <nav className="pagination container-width" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link href={pageLink(currentPage - 1)} className="pagination__arrow" aria-label={translate("previous", locale as "sv" | "en")}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      ) : (
        <span className="pagination__arrow pagination__arrow--disabled" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      )}

      {pageNumbers.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="pagination__ellipsis">...</span>
        ) : page === currentPage ? (
          <span key={page} className="pagination__page pagination__page--active" aria-current="page">
            {page}
          </span>
        ) : (
          <Link key={page} href={pageLink(page)} className="pagination__page">
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={pageLink(currentPage + 1)} className="pagination__arrow" aria-label={translate("next", locale as "sv" | "en")}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      ) : (
        <span className="pagination__arrow pagination__arrow--disabled" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </span>
      )}
    </nav>
  );
}
