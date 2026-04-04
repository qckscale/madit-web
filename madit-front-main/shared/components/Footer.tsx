"use client";

import Image from "next/image";
import Link from "next/link";
import "./Footer.scss";
import { usePathname } from "next/navigation";
import { translate } from "../utils/lang/translate";
import { i18Link } from "../utils/lang/getLink";
import { useMemo } from "react";
interface FooterProps {
  footer: {
    copyrightText: string;
    pagesOfInterest: {
      title: string;
      link: string;
      isCustomLink?: boolean;
    }[];
    footerServices?: {
      title: string;
      url: string;
    }[];
    name: string;
    address: string;
    phone: string;
    email: string;
    facebook: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  services: any[];
}
export function Footer({ footer, services }: FooterProps) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  const defaultLinks = useMemo(
    () => [
      {
        title: translate("news", locale),
        link: "news",
        isCustomLink: true,
      },
      {
        title: translate("contact", locale),
        link: "contact",
        isCustomLink: true,
      },
    ],
    [locale]
  );

  const footerServicesList = footer.footerServices?.length ? footer.footerServices : services;
  const halfIndex = useMemo(() => Math.ceil(footerServicesList.length / 2), [footerServicesList]);
  const firstHalf = useMemo(
    () => footerServicesList.slice(0, halfIndex),
    [footerServicesList, halfIndex]
  );
  const secondHalf = useMemo(
    () => footerServicesList.slice(halfIndex),
    [footerServicesList, halfIndex]
  );

  return (
    <>
      <section className="clouds inverted"></section>

      <footer>
        <div className="footer-content container-width d-flex w100">
          <div className="footer-item">
            <Image
              alt="Madit Logotype"
              width={205}
              height={88}
              src="/logotype.svg"
            />
          </div>
          <div className="footer-item">
            <h3>{translate("services", locale)}</h3>
            <div className="d-flex footer-double-lists wrap">
              <ul>
                {firstHalf?.map((link) => (
                  <li key={`${link.url}-${link.title}`}>
                    <Link href={i18Link(`service/${link.url}`, locale)}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul>
                {secondHalf?.map((link) => (
                  <li key={`${link.url}-${link.title}`}>
                    <Link href={i18Link(`service/${link.url}`, locale)}>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="footer-item">
            <h3>Madit</h3>
            <ul>
              {[...defaultLinks, ...footer.pagesOfInterest]?.map((link) => (
                <li key={`${link.link}-${link.title}`}>
                  <Link
                    href={`${i18Link(
                      link.isCustomLink ? `${link.link}` : `page/${link.link}`,
                      locale
                    )}`}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-item">
            <h3>{translate("contact", locale)}</h3>
            <div>
              <div className="company-detail-item">{footer.phone}</div>
              <div className="company-detail-item">{footer.address}</div>
              <div className="company-detail-item">{footer.email}</div>
            </div>
          </div>
        </div>
      </footer>
      <div className="copyright">
        <div className="container-width">
          <div className="copyright-content d-flex justify-between align-center">
            {footer.copyrightText}

            <div className="social-icons">
              {footer.instagram && (
                <a href={footer.instagram} target="_blank">
                  <Image
                    alt="Instagram"
                    width={24}
                    height={24}
                    src="/socials/instagram.svg"
                  ></Image>
                </a>
              )}
              {footer.linkedin && (
                <a href={footer.linkedin} target="_blank">
                  <Image
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    src="/socials/linkedin.svg"
                  ></Image>
                </a>
              )}
              {footer.twitter && (
                <a href={footer.twitter} target="_blank">
                  <Image
                    alt="Twitter"
                    width={24}
                    height={24}
                    src="/socials/twitter.svg"
                  ></Image>
                </a>
              )}
              {footer.facebook && (
                <a href={footer.facebook} target="_blank">
                  <Image
                    alt="Facebook"
                    width={24}
                    height={24}
                    src="/socials/facebook.svg"
                  ></Image>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
