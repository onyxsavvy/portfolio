import { clientLogos } from '@/data/content';

export default function LogoMarquee() {
  const allLogos = [...clientLogos, ...clientLogos];

  return (
    <section className="bg-background py-10 overflow-hidden">
      <div className="group">
        <div className="flex gap-[60px] animate-marquee group-hover:[animation-play-state:paused]">
          {allLogos.map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="flex-shrink-0 flex items-center justify-center w-[80px] h-[40px] opacity-40 hover:opacity-70 transition-opacity"
            >
              <span className="font-sans font-semibold text-sm text-white tracking-wider uppercase whitespace-nowrap">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
