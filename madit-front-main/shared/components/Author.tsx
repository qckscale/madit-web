"use client";
import { usePathname } from "next/navigation";
import { CalendarIcon } from "../icons";
import { translate } from "../utils/lang/translate";
import styles from "./Author.module.scss";
import { format } from "date-fns";
import { sv, enGB } from "date-fns/locale";

export default function Author({
  name,
  title,
  bio,
  image,
  publishedAt,
}: {
  name: string;
  title: string;
  bio: any;
  image: string;
  publishedAt: string;
}) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  const date = format(new Date(publishedAt), "MMMM dd, yyyy", {
    locale: locale === "en" ? enGB : sv,
  });
  return (
    <div className={styles.author}>
      <div className={styles.authorImageWrapper}>
        <img src={`${image}?auto=format&w=100`} alt={name} />
      </div>
      <div className={styles.authorContentWrapper}>
        <div className={styles.authorMeta}>
          <p className={styles.authorBadge}>{translate("author", locale)}</p>
          <p className={styles.publishDate}>
            <CalendarIcon size={16} />
            {date}
          </p>
        </div>
        <p className={styles.authorName}>{name}</p>
        <p className={styles.authorTitle}>{title}</p>
      </div>
    </div>
  );
}
