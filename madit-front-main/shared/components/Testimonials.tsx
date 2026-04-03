import Image from "next/image";
import Section from "./Section";
import styles from "./Testimonials.module.scss";
import BlockContent from "./BlockContent";

export default function Testimonials({
  title,
  subtitle,
  testimonials,
}: {
  title: string;
  subtitle: any;
  testimonials: any;
}) {
  return (
    <Section>
      <div className="container-width">
        <div className={styles.testimonialHeader}>
          <h2 className="heading-2">{title}</h2>
          <BlockContent content={subtitle} />
        </div>

        <div className={`list-wrapper ${styles.testimonials}`}>
          {testimonials.map((testimonial: any) => (
            <div className="list-wrapper__item" key={testimonial.thumbnail}>
              <div className={styles.testimonialContent}>
                <Image src={`${testimonial.thumbnail}?auto=format&h=74&w=74`} alt={testimonial.name} width={74} height={74} />
                <div>
                  <h3>{testimonial.name}</h3>
                  <h4>{testimonial.title}</h4>
                  <p>&ldquo;{testimonial.quote}&rdquo;</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
