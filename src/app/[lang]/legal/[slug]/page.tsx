import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, t, type Locale } from "@/i18n/dict";
import { LEGAL_DOCS, type LegalBlock } from "@/lib/legal";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { legalPath, homePath } from "@/lib/routes";

export function generateStaticParams() {
  const out: { lang: string; slug: string }[] = [];
  for (const lang of LOCALES) {
    for (const doc of LEGAL_DOCS) {
      out.push({ lang, slug: doc.key });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale: Locale = lang === "en" ? "en" : "es";
  const doc = LEGAL_DOCS.find((d) => d.key === slug);
  if (!doc) return {};
  return pageMetadata({
    locale,
    titleEs: doc.title.es,
    titleEn: doc.title.en,
    descriptionEs: doc.description.es,
    descriptionEn: doc.description.en,
    esPath: legalPath(doc.key, "es"),
    enPath: legalPath(doc.key, "en"),
    noindex: true,
  });
}

function Block({ block, locale }: { block: LegalBlock; locale: Locale }) {
  return (
    <section>
      {block.h2 && <h2>{block.h2[locale]}</h2>}
      {block.p && <p>{block.p[locale]}</p>}
      {block.ul && (
        <ul>
          {block.ul[locale].map((li, i) => <li key={i}>{li}</li>)}
        </ul>
      )}
      {block.table && (
        <table>
          <thead>
            <tr>{block.table.head[locale].map((h, i) => <th key={i}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {block.table.rows[locale].map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!LOCALES.includes(lang as Locale)) notFound();
  const locale: Locale = lang === "en" ? "en" : "es";
  const doc = LEGAL_DOCS.find((d) => d.key === slug);
  if (!doc) notFound();

  return (
    <div className="container-gzs py-12 lg:py-16 max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: locale === "es" ? "Inicio" : "Home", path: homePath(locale) },
              { name: doc.title[locale], path: legalPath(doc.key, locale) },
            ]),
          ),
        }}
      />
      <nav aria-label="breadcrumb" className="text-xs text-smoke mb-4">
        <a href={homePath(locale)}>{t("breadcrumb.home", locale)}</a>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">{doc.title[locale]}</span>
      </nav>
      <span className="eyebrow">{t("footer.legal", locale)}</span>
      <h1 className="text-[clamp(30px,4.5vw,46px)] font-black mt-2 mb-3">{doc.title[locale]}</h1>
      <p className="text-smoke text-sm mb-8">{t("legal.updated", locale)}</p>
      <div className="prose-legal space-y-2">
        {doc.blocks.map((b, i) => <Block key={i} block={b} locale={locale} />)}
      </div>
    </div>
  );
}
