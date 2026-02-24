"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CookieConsent from "./CookieConsent";

export function ExternalScripts({
  nonce,
  cookieSettings,
}: {
  nonce: string;
  cookieSettings: any;
}) {
  const cookieConsent = Cookies.get("cookieConsent") === "true";
  const [hasMounted, setHasMounted] = useState(false);
  const [didAccept, setDidAccept] = useState(cookieConsent);

  const userAccepted = () => {
    setDidAccept(true);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return;

  return (
    <>
      {didAccept ? (
        <>
          <Script
            nonce={nonce}
            src={`https://www.googletagmanager.com/gtag/js?id=G-LZ6ELNE4R8`}
            strategy="lazyOnload"
          />
          <Script nonce={nonce} id="google-analytics" strategy="lazyOnload">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-LZ6ELNE4R8');
        `}
          </Script>
        </>
      ) : (
        <CookieConsent
          userAccepted={userAccepted}
          cookieSettings={cookieSettings}
        />
      )}
    </>
  );
}
