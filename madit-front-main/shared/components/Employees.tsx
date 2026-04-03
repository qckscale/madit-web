import Image from "next/image";
import { translate } from "../utils/lang/translate";
import styles from "./Employees.module.scss";
export default function Employees({
  consultants,
  locale,
}: {
  consultants: { image: string; name: string; title: string }[];
  locale: "en" | "sv";
}) {
  return (
    <section className={`${styles.employees} news container-width`}>
      <div className="container-width">
        <h2 className="heading-2">{translate("consultants", locale)}</h2>
      </div>
      <div className={styles.employeesList}>
        {consultants?.map((s) => (
          <div key={s.name} className={styles.employeeItem}>
            <div className={styles.employeeImageWrapper}>
              <Image
                className={styles.employeesAvatar}
                src={`${s.image}?auto=format&w=404`}
                alt={s.name}
                width={404}
                height={404}
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
