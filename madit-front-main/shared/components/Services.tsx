"use client";
import Image from "next/image";
import Link from "next/link";
import "./Services.scss";
import { translate } from "../utils/lang/translate";
import { usePathname } from "next/navigation";
import { i18Link } from "../utils/lang/getLink";
interface ServicesProps {
  services: any[];
  topMargin?: boolean;
  isHome?: boolean;
}

export function Services({
  services,
  topMargin = true,
  isHome = false,
}: ServicesProps) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  return (
    <section
      className={`services ${
        isHome ? "" : "container-width-page"
      } container-width ${topMargin ? "" : "block-mt"}`}
    >
      <div className={`${isHome ? "d-flex justify-between" : ""}`}>
        <h2 className="heading-2">{translate("services", locale)}</h2>
        {isHome && (
          <div>
            <Link href={i18Link("services", locale)}>
              <button tabIndex={-1} className="secondary">
                {translate("show_all", locale)}{" "}
                <span className="hide-on-mob">
                  {translate("services", locale)}
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className="services__container ">
        {services?.map((s) => (
          <Link
            className="services__item"
            key={s.title}
            href={i18Link(`service/${s.url}`, locale)}
          >
            {s.icon && (
              <Image
                className="services__item__icon"
                src={`${s.icon}?auto=format&w=64`}
                alt={s.title}
                width={64}
                height={64}
              />
            )}
            <div>
              <h3 className="heading-3">{s.title}</h3>
              <p className="services__item__description">{s.ingress}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
