import { Link } from "react-router-dom";

interface PageHeaderProps {
  eyebrow?: string;
  outline?: string;
  title: string;
  description?: string;
  crumb: string;
}

const PageHeader = ({
  eyebrow,
  outline,
  title,
  description,
  crumb,
}: PageHeaderProps) => {
  return (
    <section className="relative isolate flex min-h-[clamp(260px,calc(100svh-380px),360px)] w-full items-center overflow-hidden bg-(--navy)">

      <div className="mx-auto w-full max-w-350 px-5 py-8 sm:px-6 sm:py-10 lg:px-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-[12px]">
            <li>
              <Link
                to="/"
                className="text-white/60 transition-colors hover:text-(--white)"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/60">
              <i className="ri-arrow-right-s-line" />
            </li>
            <li className="text-(--white)" aria-current="page">
              {crumb}
            </li>
          </ol>
        </nav>

        {eyebrow && (
          <span className="mt-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-[12px]">
            <span className="h-0.5 w-8 bg-(--white)" aria-hidden="true" />
            {eyebrow}
          </span>
        )}

        <h1
          className={`flex flex-wrap gap-x-[0.15em] font-display text-[clamp(34px,9vw,48px)] leading-[0.95] tracking-[-0.045em] lowercase sm:text-[clamp(42px,5.5vw,60px)] lg:text-[clamp(48px,5vw,72px)] ${
            eyebrow ? "mt-3" : "mt-4"
          }`}
        >
          {outline && (
            <span className="font-extrabold text-transparent [-webkit-text-stroke:1.4px_var(--white)] lg:[-webkit-text-stroke:1.8px_var(--white)]">
              {outline}
            </span>
          )}
          <span className="font-extrabold text-(--white)">{title}</span>
        </h1>

        {description && (
          <p className="mt-3 max-w-xl text-[14px] leading-normal text-white/75 sm:mt-4 sm:text-[15px] sm:leading-[1.6] lg:max-w-2xl lg:text-base">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;