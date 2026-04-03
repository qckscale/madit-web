import { HOMEPAGE_GROQ, client } from "@mi/sanity";
import "./page.scss";
import { Services } from "@mi/shared/components/Services";
import Link from "next/link";

import { News } from "@mi/shared/components/News";
import { ContactForm } from "@mi/shared/components/ContactForm";
import { i18Link } from "@mi/shared/utils/lang/getLink";
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
  const [data] = await Promise.all([
    client.fetch<any>(HOMEPAGE_GROQ(locale), {}, { next: { revalidate: 60 } }),
  ]);
  const { page, articles, work, authors, testimonials } = data;

  return (
    <main className="homepage-container">
      <section className="hero-section clouds">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="hero-section__bg"
          src={`${page.homePage.heroImage}?w=1920`}
          srcSet={`${page.homePage.heroImage}?w=828 828w, ${page.homePage.heroImage}?w=1200 1200w, ${page.homePage.heroImage}?w=1920 1920w, ${page.homePage.heroImage}?w=2560 2560w, ${page.homePage.heroImage}?w=3840 3840w`}
          sizes="100vw"
          fetchPriority="high"
          alt=""
        />
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
        <Services isHome services={page.homePage.services} locale={locale as "en" | "sv"} />
        <Work isHome work={work} locale={locale as "en" | "sv"} />
        <Clouds />
        <News isHome title={page.homePage.newsTitle} articles={articles} locale={locale as "en" | "sv"} />
        <Employees consultants={authors} locale={locale as "en" | "sv"} />
        <ContactForm services={page.homePage.services} contactImageUrl={page.contactImageUrl} />
        <Testimonials
          title={page.homePage.testimonialTitle}
          subtitle={page.homePage.testimonialSubtitle}
          testimonials={testimonials}
        />
      </div>
    </main>
  );
}
