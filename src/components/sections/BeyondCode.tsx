import Image from "next/image";
import { beyondCode } from "@/data/profile";
import { PhotoGrid } from "@/components/ui/PhotoGrid";

/** Beyond code: sport and photography. Sits just before Contact so the page ends on the call to action (not a 3D station). */
export function BeyondCode() {
  return (
    <section id="beyond-code" aria-labelledby="beyond-title" className="relative pb-16 pt-6 md:pb-[14svh] md:pt-[6svh]">
      <div className="shell">
        <p className="meta">Off the keyboard</p>
        <h2 id="beyond-title" data-reveal="type" className="mt-4 w-fit font-display text-[clamp(2.4rem,5vw,3.75rem)] leading-[1]">
          Beyond <em className="text-ember-soft">code.</em>
        </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <article data-reveal="media" className="panel overflow-hidden lg:col-span-5">
              <div className="grid grid-cols-2 gap-px bg-line">
                {beyondCode.cricket.photos.map((ph) => (
                  <Image
                    key={ph.src}
                    src={ph.src}
                    alt={ph.alt}
                    width={ph.width}
                    height={ph.height}
                    sizes="(min-width: 1024px) 20vw, 45vw"
                    className="aspect-[3/4] h-full w-full object-cover"
                  />
                ))}
              </div>
              <div className="p-6">
                <p className="font-display text-2xl">{beyondCode.cricket.title}</p>
                <p className="mt-1 text-sm text-fg-muted">{beyondCode.cricket.detail}</p>
                <p className="mt-5 border-t border-line pt-5 font-display text-2xl">{beyondCode.tableTennis.title}</p>
                <p className="mt-1 text-sm text-fg-muted">{beyondCode.tableTennis.detail}</p>
              </div>
            </article>
            <article data-reveal="media" style={{ "--d": 1 } as React.CSSProperties} className="panel p-6 lg:col-span-7">
              <p className="font-display text-2xl">{beyondCode.photography.title}</p>
              <p className="mt-1 text-sm text-fg-muted">{beyondCode.photography.detail}</p>
              <PhotoGrid photos={beyondCode.photography.photos} />
            </article>
          </div>
      </div>
    </section>
  );
}
