"use client";
import Link from "next/link";
import "./News.scss";
import { usePathname } from "next/navigation";
import { translate } from "../utils/lang/translate";
import { i18Link } from "../utils/lang/getLink";
interface NewsProps {
  articles: any[];
  title?: string;
  isHome?: boolean;
}
export function News({ articles, title, isHome = false }: NewsProps) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  title = title || translate("news", locale);
  return (
    <>
      <section
        className={`news container-width  ${
          isHome ? "" : "container-width-page"
        } `}
      >
        <div className={`${isHome ? "d-flex justify-between" : ""}`}>
          <h2 className="heading-2">{title}</h2>
          {isHome && (
            <div>
              <Link href={i18Link("news", locale)}>
                <button tabIndex={-1} className="secondary">
                  {translate("show_all", locale)}{" "}
                  <span className="hide-on-mob">
                    {translate("news", locale)}
                  </span>
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="news__container">
          {articles?.map((s) => (
            <Link
              key={s.title}
              className="news__container__item"
              href={i18Link(`news/${s.url}`, locale)}
            >
              <img src={`${s.thumbnail}?auto=format&w=404`} alt={s.title} />
              <div className="news__container__item-content">
                <h3 className="heading-3">{s.title}</h3>
                <p className="news__item__description">{s.ingress}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
