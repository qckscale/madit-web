"use client";

import Cookies from "js-cookie";
import Link from "next/link";
import styles from "./CookieConsent.module.scss";

interface CookieConsentProps {
  cookieSettings: any;
  userAccepted: () => void;
}

export default function CookieConsent({
  cookieSettings,
  userAccepted,
}: CookieConsentProps) {
  const cookieConsent = Cookies.get("cookieConsent") === "true";

  const giveCookieConsent = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    Cookies.set("cookieConsent", "true", { path: "/", expires: date });
    userAccepted();
  };

  if (cookieConsent) return null;

  return (
    <div className={styles.cookieConsent}>
      <div className={styles.cookieConsentContent}>
        <p>
          {cookieSettings.message}{" "}
          <Link
            className={styles.cookieConsentLink}
            href={`/page/${cookieSettings.link}`}
            aria-label="Read more about how we use cookies"
          >
            {cookieSettings.linkText}
          </Link>
        </p>
        <button
          onClick={giveCookieConsent}
          aria-label="Accept usage of cookie"
          className="primary"
        >
          {cookieSettings.ctaText}
        </button>
      </div>
    </div>
  );
}
