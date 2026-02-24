import styles from "./Section.module.scss";

export default function Section({ children }: { children: JSX.Element }) {
  return <section className={styles.section}>{children}</section>;
}
