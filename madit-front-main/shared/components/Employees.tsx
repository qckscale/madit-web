"use client";
import { usePathname } from "next/navigation";
import { translate } from "../utils/lang/translate";
import styles from "./Employees.module.scss";
export default function Employees({
  consultants,
}: {
  consultants: { image: string; name: string; title: string }[];
}) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  return (
    <section className={`${styles.employees} news container-width`}>
      <div className="container-width">
        <h2 className="heading-2">{translate("consultants", locale)}</h2>
      </div>
      <div className={styles.employeesList}>
        {consultants?.map((s) => (
          <div key={s.name} className={styles.employeeItem}>
            <div className={styles.employeeImageWrapper}>
              <img
                className={styles.employeesAvatar}
                src={`${s.image}?auto=format&w=404`}
                alt={s.name}
              />
            </div>
            <h3 className="heading-3">{s.name}</h3>
            <p>{s.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
