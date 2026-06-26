import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stats } from '@/data/content';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function MissionStats() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Section entrance
    const elements = section.querySelectorAll('.mission-reveal');
    gsap.set(elements, { opacity: 0, y: 40 });
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // Stats counter animation
    const statElements = statsRef.current?.querySelectorAll('.stat-number');
    if (statElements) {
      statElements.forEach((el, i) => {
        const target = stats[i].value;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          snap: { val: 1 },
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (el) el.textContent = String(Math.round(obj.val));
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === statsRef.current) st.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-accent py-20 lg:py-24 relative overflow-hidden"
    >
      <div className="container-main">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-10 lg:gap-16 relative">
          {/* Mission Text */}
          <div className="mission-reveal">
            <h2 className="font-sans font-medium text-[clamp(32px,4.5vw,56px)] leading-[1.0] tracking-[-0.03em] text-[#0A0A0A]">
              Helping brands to stand out in the digital era. Together we will set
              the new status quo. No nonsense, always on the cutting edge.
            </h2>
          </div>

          {/* Right side: description + floating circle */}
          <div className="mission-reveal relative">
            <p className="font-sans text-lg lg:text-xl font-normal text-[#0A0A0A]/90 leading-relaxed tracking-wide max-w-[420px]">
              The combination of my passion for design, code &amp; interaction
              positions me in a unique place in the web design world.
            </p>

            {/* Floating Know More circle */}
            <a
              href="#services"
              className="hidden lg:flex absolute -bottom-8 right-0 w-[120px] h-[120px] rounded-full bg-[#1A1A1A] items-center justify-center gap-1 text-white text-[13px] font-sans font-medium hover:scale-105 transition-transform shadow-lg"
            >
              Know More
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div ref={statsRef} className="mt-20 lg:mt-24">
          <p className="mission-reveal text-center font-sans font-semibold text-2xl text-[#0A0A0A] mb-10">
            Trusted by <span className="font-serif italic">people</span> worldwide
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-0">
            {stats.map((stat, i) => (
              <div key={stat.label} className="mission-reveal flex items-center">
                <div className="text-center px-8 lg:px-16">
                  <div className="flex items-baseline justify-center">
                    <span
                      className="stat-number font-sans font-bold text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.04em] text-[#0A0A0A] font-tabular"
                      ref={(el) => { numberRefs.current[i] = el; }}
                    >
                      0
                    </span>
                    <span className="font-sans font-bold text-[clamp(48px,6vw,80px)] leading-none tracking-[-0.04em] text-[#0A0A0A]">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="mt-2 font-sans font-medium text-xs tracking-[0.02em] uppercase text-[#0A0A0A]/70">
                    {stat.label}
                  </p>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-16 bg-[rgba(10,10,10,0.15)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
