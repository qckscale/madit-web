import { HOMEPAGE_GROQ, SERVICE_CATEGORY_PAGES_GROQ, SERVICE_GROQ, client } from "@mi/sanity";
import "./page.scss";
import { Services } from "@mi/shared/components/Services";
import Link from "next/link";
import Image from "next/image";
import heroBg from "@mi/public/hero-bg.webp";
import { News } from "@mi/shared/components/News";
import { ContactForm } from "@mi/shared/components/ContactForm";
import { i18Link } from "@mi/shared/utils/lang/getLink";
import { translate } from "@mi/shared/utils/lang/translate";
import Employees from "@mi/shared/components/Employees";
import { Clouds } from "@mi/shared/icons";
import Work from "@mi/shared/components/Work";
import Testimonials from "@mi/shared/components/Testimonials";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale || "en") as "sv" | "en";
  const [data, categoryPages, allServices] = await Promise.all([
    client.fetch<any>(HOMEPAGE_GROQ(locale), {}, { next: { revalidate: 60 } }),
    client.fetch<any[]>(SERVICE_CATEGORY_PAGES_GROQ(locale), {}, { next: { revalidate: 60 } }),
    client.fetch<any[]>(SERVICE_GROQ(locale), {}, { next: { revalidate: 60 } }),
  ]);
  const { page, articles, work, authors, testimonials } = data;

  const categoryUrls: Record<string, string> = {
    consulting: "services/consulting",
    training: "services/training",
    products: "services/products",
  };
  const categoryCards = categoryPages.map((cp: any) => ({
    title: cp.title || translate(cp.category, loc),
    ingress: cp.ingress || translate(`${cp.category}_description`, loc),
    icon: cp.icon || null,
    url: categoryUrls[cp.category] || "services",
  }));

  return (
    <main className="homepage-container">
      <section className="hero-section clouds">
        <Image
          className="hero-section__bg"
          src={heroBg}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div className="hero-section__overlay" />
        <div className="container-width">
          <div className="hero-section__content">
            <h1
              className="hero-section__title"
              dangerouslySetInnerHTML={{ __html: page.homePage.title }}
            ></h1>
            <div className="hero-section__cta">
              <Link tabIndex={-1} href={i18Link("contact", locale)}>
                <button className="primary">{page.homePage.ctaPrimary}</button>
              </Link>
              <Link
                tabIndex={-1}
                href={i18Link("page/about-us", locale)}
              >
                <button className="secondary">
                  {page.homePage.ctaSecondary}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <div className="inner-home">
        <Services isHome services={categoryCards} locale={loc} />
        <Work isHome work={work} locale={locale as "en" | "sv"} />
        <Clouds />
        <News isHome title={page.homePage.newsTitle} articles={articles} locale={locale as "en" | "sv"} />
        <Employees consultants={authors} locale={locale as "en" | "sv"} />
        <ContactForm services={allServices} contactImageUrl={page.contactImageUrl} />
        <Testimonials
          title={page.homePage.testimonialTitle}
          subtitle={page.homePage.testimonialSubtitle}
          testimonials={testimonials}
        />
      </div>
    </main>
  );
}
