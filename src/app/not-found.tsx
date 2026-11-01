import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <PageHeader />
      <main
        id="main"
        className="flex min-h-[calc(100svh-4rem)] items-center"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #ff7a3d14, transparent 55%)" }}
      >
        <div className="shell text-center">
          <p className="meta">Signal lost · 404</p>
          <h1 className="mt-5 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.95]">
            Lost in <em className="text-ember-soft">space.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-[44ch] text-fg-muted">This page drifted out of the universe. The rest of it is still here.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-ember px-5 text-sm font-semibold text-void hover:bg-ember-soft">
              Back to the universe
            </Link>
            <Link href="/projects" className="inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 text-sm hover:border-fg/60">
              Browse projects
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
