"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import "./Header.scss";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translate } from "../utils/lang/translate";
import { i18Link } from "../utils/lang/getLink";

interface HeaderProps {
  services?: any[];
}

export function Header({ services = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  const toggleOpen = () => setIsOpen(!isOpen);
  const [showMenuOnScroll, setShowMenuOnScroll] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const consulting = services.filter((s) => s.category === "consulting");
  const training = services.filter((s) => s.category === "training");
  const products = services.filter((s) => s.category === "products");

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) return;
      const currentScrollPos = window.scrollY;
      setShowMenuOnScroll(currentScrollPos <= prevScrollPos);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, isOpen]);

  useEffect(() => {
    setIsOpen(false); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: close menu on navigation
    setMegaMenuOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setMobileServicesOpen(false);
      setMegaMenuOpen(false);
      setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <nav
      className={`${showMenuOnScroll ? "show-menu" : undefined} ${
        prevScrollPos > 100 ? "is-sticky" : undefined
      }`}
    >
      <ul className="d-flex align-center justify-between container-width">
        <li>
          <Link className="no-outline" href={i18Link("/", locale)}>
            <Image
              className="logotype"
              alt="Madit Logotype"
              width={205}
              height={88}
              src="/logotype.svg"
            />
          </Link>
        </li>
        <li
          className={`d-flex align-center menu-list-gutter ${
            isOpen ? "is-open" : ""
          }`}
        >
          <div
            className="header__services-trigger"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
          >
            <Link
              href={i18Link("services", locale)}
              className="header__services-link"
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  e.preventDefault();
                  setMobileServicesOpen(!mobileServicesOpen);
                }
              }}
            >
              {translate("services", locale)}
              <span className={`header__chevron ${mobileServicesOpen ? "is-open" : ""}`}>&#9660;</span>
            </Link>
            {megaMenuOpen && services.length > 0 && (
              <div className="header__megamenu">
                <div className="header__megamenu__inner container-width">
                  <div className="header__megamenu__column">
                    <Link className="header__megamenu__heading" href={i18Link("services/consulting", locale)}>
                      {translate("consulting", locale)}
                    </Link>
                    {consulting.map((s) => (
                      <Link key={s.url} href={i18Link(`service/${s.url}`, locale)}>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                  <div className="header__megamenu__column">
                    <Link className="header__megamenu__heading" href={i18Link("services/training", locale)}>
                      {translate("training", locale)}
                    </Link>
                    {training.map((s) => (
                      <Link key={s.url} href={i18Link(`service/${s.url}`, locale)}>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                  <div className="header__megamenu__column">
                    <Link className="header__megamenu__heading" href={i18Link("services/products", locale)}>
                      {translate("products", locale)}
                    </Link>
                    {products.map((s) => (
                      <Link key={s.url} href={i18Link(`service/${s.url}`, locale)}>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {mobileServicesOpen && (
              <div className="header__mobile-submenu">
                <Link className="header__mobile-submenu__heading" href={i18Link("services/consulting", locale)}>{translate("consulting", locale)}</Link>
                {consulting.map((s) => (
                  <Link key={s.url} href={i18Link(`service/${s.url}`, locale)}>{s.title}</Link>
                ))}
                <Link className="header__mobile-submenu__heading" href={i18Link("services/training", locale)}>
                  {translate("training", locale)}
                </Link>
                {training.map((s) => (
                  <Link key={s.url} href={i18Link(`service/${s.url}`, locale)}>{s.title}</Link>
                ))}
                <Link className="header__mobile-submenu__heading" href={i18Link("services/products", locale)}>
                  {translate("products", locale)}
                </Link>
                {products.map((s) => (
                  <Link key={s.url} href={i18Link(`service/${s.url}`, locale)}>{s.title}</Link>
                ))}
              </div>
            )}
          </div>
          <Link href={i18Link("customer-case", locale)}>
            {translate("customer_cases", locale)}
          </Link>
          <Link href={i18Link("news", locale)}>
            {translate("news", locale)}
          </Link>
          <Link href={i18Link("page/about-us", locale)}>
            {translate("about", locale)}
          </Link>
          <Link href={i18Link("contact", locale)}>
            {translate("contact", locale)}
          </Link>
          <div className="hide-on-mob">
            <LanguageSelector size={24} headerBg={false} locale={locale} />
          </div>
        </li>
        <li className="buger-item">
          <div className="d-flex align-center">
            <LanguageSelector locale={locale} headerBg={false} />
            <button
              aria-label="Toggle navigation menu"
              className={`burger ${isOpen ? "is-open" : ""}`}
              onClick={toggleOpen}
            >
              <div className="burger-line"></div>
              <div className="burger-line"></div>
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
}

export function LanguageSelector({
  headerBg,
  locale = "sv",
  size = 24,
}: {
  headerBg: boolean;
  locale: "sv" | "en";
  size?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    router.push(changeTo(locale === "sv" ? "en" : "sv"));
  };

  const changeTo = (lang: "en" | "sv") => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    segments[1] = lang;
    return segments.join("/");
  };

  return (
    <div className="relative">
      <button className="unstyled" onClick={toggleLanguage}>
        <div className="visually-hidden">
          {translate("change_language", locale)}
        </div>
        <svg
          className="language"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="inherit"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 24C10.3448 24 8.78736 23.6839 7.32759 23.0517C5.86782 22.4195 4.5977 21.5632 3.51724 20.4828C2.43678 19.4023 1.58046 18.1322 0.948276 16.6724C0.316092 15.2126 0 13.6552 0 12C0 10.3448 0.316092 8.78736 0.948276 7.32759C1.58046 5.86782 2.43678 4.5977 3.51724 3.51724C4.5977 2.43678 5.86782 1.58046 7.32759 0.948276C8.78736 0.316092 10.3448 0 12 0C13.6552 0 15.2126 0.316092 16.6724 0.948276C18.1322 1.58046 19.4023 2.43678 20.4828 3.51724C21.5632 4.5977 22.4195 5.86782 23.0517 7.32759C23.6839 8.78736 24 10.3448 24 12C24 13.6552 23.6839 15.2126 23.0517 16.6724C22.4195 18.1322 21.5632 19.4023 20.4828 20.4828C19.4023 21.5632 18.1322 22.4195 16.6724 23.0517C15.2126 23.6839 13.6552 24 12 24ZM12 23.069C12.8736 21.9655 13.5862 20.8966 14.1379 19.8621C14.6897 18.8276 15.1379 17.6552 15.4828 16.3448H8.51724C8.90805 17.7471 9.36782 18.9655 9.89655 20C10.4253 21.0345 11.1264 22.0575 12 23.069ZM10.7931 22.9655C10.0805 22.2069 9.42529 21.2241 8.82759 20.0172C8.22989 18.8103 7.7931 17.5862 7.51724 16.3448H1.86207C2.68966 18.2299 3.89655 19.7586 5.48276 20.931C7.06897 22.1034 8.83908 22.7816 10.7931 22.9655ZM13.2069 22.9655C15.1609 22.7816 16.931 22.1034 18.5172 20.931C20.1034 19.7586 21.3103 18.2299 22.1379 16.3448H16.4828C16.092 17.6092 15.5977 18.8448 15 20.0517C14.4023 21.2586 13.8046 22.2299 13.2069 22.9655ZM1.48276 15.3793H7.31035C7.1954 14.7816 7.11494 14.2011 7.06897 13.6379C7.02299 13.0747 7 12.5287 7 12C7 11.4713 7.02299 10.9253 7.06897 10.3621C7.11494 9.79885 7.1954 9.21839 7.31035 8.62069H1.48276C1.32184 9.10345 1.1954 9.64368 1.10345 10.2414C1.01149 10.8391 0.965517 11.4253 0.965517 12C0.965517 12.5747 1.01149 13.1609 1.10345 13.7586C1.1954 14.3563 1.32184 14.8966 1.48276 15.3793ZM8.27586 15.3793H15.7241C15.8391 14.7816 15.9195 14.2126 15.9655 13.6724C16.0115 13.1322 16.0345 12.5747 16.0345 12C16.0345 11.4253 16.0115 10.8678 15.9655 10.3276C15.9195 9.78736 15.8391 9.21839 15.7241 8.62069H8.27586C8.16092 9.21839 8.08046 9.78736 8.03448 10.3276C7.98851 10.8678 7.96552 11.4253 7.96552 12C7.96552 12.5747 7.98851 13.1322 8.03448 13.6724C8.08046 14.2126 8.16092 14.7816 8.27586 15.3793ZM16.6897 15.3793H22.5172C22.6782 14.8966 22.8046 14.3563 22.8966 13.7586C22.9885 13.1609 23.0345 12.5747 23.0345 12C23.0345 11.4253 22.9885 10.8391 22.8966 10.2414C22.8046 9.64368 22.6782 9.10345 22.5172 8.62069H16.6897C16.8046 9.21839 16.8851 9.79885 16.931 10.3621C16.977 10.9253 17 11.4713 17 12C17 12.5287 16.977 13.0747 16.931 13.6379C16.8851 14.2011 16.8046 14.7816 16.6897 15.3793ZM16.4828 7.65517H22.1379C21.2874 5.72414 20.0977 4.1954 18.569 3.06897C17.0402 1.94253 15.2529 1.25287 13.2069 1C13.9195 1.87356 14.5632 2.89655 15.1379 4.06897C15.7126 5.24138 16.1609 6.43678 16.4828 7.65517ZM8.51724 7.65517H15.4828C15.092 6.27586 14.6149 5.04023 14.0517 3.94828C13.4885 2.85632 12.8046 1.85057 12 0.931035C11.1954 1.85057 10.5115 2.85632 9.94828 3.94828C9.38506 5.04023 8.90805 6.27586 8.51724 7.65517ZM1.86207 7.65517H7.51724C7.83908 6.43678 8.28736 5.24138 8.86207 4.06897C9.43678 2.89655 10.0805 1.87356 10.7931 1C8.72414 1.25287 6.93103 1.94828 5.41379 3.08621C3.89655 4.22414 2.71264 5.74713 1.86207 7.65517Z"
            fill="inherit"
          />
        </svg>
      </button>
    </div>
  );
}
