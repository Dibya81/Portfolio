import Image from "next/image";
import { beyondCode } from "@/data/profile";

/** Beyond code: sport and photography. Closes the page after Contact (not a 3D station). */
export function BeyondCode() {
  return (
    <section id="beyond-code" aria-labelledby="beyond-title" className="relative pb-[14svh] pt-[6svh]">
      <div className="shell">
        <p className="meta">Off the keyboard</p>
        <h2 id="beyond-title" className="mt-4 font-display text-[clamp(2.4rem,5vw,3.75rem)] leading-[1]">
          Beyond <em className="text-ember-soft">code.</em>
        </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <article className="panel overflow-hidden lg:col-span-5">
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
            <article className="panel p-6 lg:col-span-7">
              <p className="font-display text-2xl">{beyondCode.photography.title}</p>
              <p className="mt-1 text-sm text-fg-muted">{beyondCode.photography.detail}</p>
              <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {beyondCode.photography.photos.map((ph) => (
                  <li key={ph.src}>
                    <Image
                      src={ph.src}
                      alt={ph.alt}
                      width={ph.width}
                      height={ph.height}
                      sizes="(min-width: 1024px) 15vw, 30vw"
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                    />
                  </li>
                ))}
              </ul>
            </article>
          </div>
      </div>
    </section>
  );
}
