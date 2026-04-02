"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { translate } from "../utils/lang/translate";
import Link from "next/link";
import { i18Link } from "../utils/lang/getLink";
import styles from "./Work.module.scss";

export default function Work({ isHome, work }: { isHome: boolean; work: any }) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";

  return (
    <section className={`container-width ${styles.work}`}>
      <div className={`${isHome ? "d-flex justify-between" : ""}`}>
        <h2 className="heading-2">{translate("our_work", locale)}</h2>
        {isHome && (
          <div>
            <Link href={i18Link("customer-case", locale)}>
              <button tabIndex={-1} className="secondary">
                {translate("show_all", locale)}{" "}
                <span className="hide-on-mob">
                  {translate("customer_cases", locale)}
                </span>
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className={styles.workContainer}>
        {work?.map((s: any) => (
          <Link
            className={styles.workContainerItem}
            key={s.title}
            href={i18Link(`customer-case/${s.url}`, locale)}
          >
            <Image src={`${s.thumbnail}?auto=format&w=404`} alt={s.title} width={404} height={270} />
            <div className={styles.workContainerItemContent}>
              <h3 className="heading-3">{s.title}</h3>
              <p className={styles.workContainerItemDesc}>{s.ingress}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
