import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "text";
  external?: boolean;
  download?: boolean;
  className?: string;
  ariaLabel?: string;
}

const styles = {
  primary:
    "bg-ember text-void hover:bg-ember-soft border border-ember hover:border-ember-soft font-semibold",
  ghost: "border border-line-strong text-fg hover:border-fg/60 hover:bg-white/[0.04]",
  text: "text-ember-soft hover:text-fg underline-offset-4 hover:underline px-0",
};

export function ButtonLink({ href, children, variant = "ghost", external, download, className = "", ariaLabel }: ButtonLinkProps) {
  const cls =
    "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm tracking-wide transition-colors duration-300 " +
    styles[variant] +
    " " +
    className;
  const isInternal = href.startsWith("/") && !external && !download && !href.startsWith("/resume/");
  if (isInternal) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={cls}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
    >
      {children}
    </a>
  );
}
