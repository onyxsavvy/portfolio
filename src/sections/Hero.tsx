import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import TechWorkspace from '@/components/TechWorkspace';
import SocialIcon from '@/components/SocialIcon';
import { socialLinks } from '@/data/content';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.4 });

    // Headline character reveal
    if (headlineRef.current) {
      const chars = headlineRef.current.querySelectorAll('.hero-char');
      const nameChars = headlineRef.current.querySelectorAll('.name-char');

      gsap.set(chars, { opacity: 0, y: 40, rotateX: -45 });
      gsap.set(nameChars, { opacity: 0, y: 40, rotateX: -45 });

      tl.to(
        chars,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power3.out',
        },
        0.2
      );

      tl.to(
        nameChars,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power3.out',
        },
        0.5
      );
    }

    // Subtitle
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      tl.to(
        subtitleRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        0.8
      );
    }

    // CTAs
    if (ctaRef.current) {
      gsap.set(ctaRef.current, { opacity: 0, y: 20 });
      tl.to(
        ctaRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        1.0
      );
    }

    // Socials
    if (socialsRef.current) {
      gsap.set(socialsRef.current, { opacity: 0, y: 15 });
      tl.to(
        socialsRef.current,
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
        1.2
      );
    }

    return () => { tl.kill(); };
  }, []);

  const splitChars = (text: string, className = 'hero-char') =>
    text.split('').map((char, i) => (
      <span
        key={i}
        className={className}
        style={{ display: 'inline-block', willChange: 'transform, opacity' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-[100dvh] bg-background grid-bg overflow-hidden"
      style={{ minHeight: '700px' }}
    >
      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse 800px 600px at center, rgba(163, 230, 53, 0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-main relative z-10 h-full min-h-[100dvh] grid grid-cols-1 lg:grid-cols-[50%_50%] items-center gap-8 pt-16">
        {/* Left — Text & CTAs */}
        <div className="flex flex-col justify-center order-1 pb-8 lg:pb-0 z-20">
          <div ref={headlineRef} className="perspective-[800px]">
            {/* Headline Line 1 */}
            <h1 className="font-sans font-medium text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-[-0.03em] text-white">
              <span className="block overflow-hidden">
                {splitChars('Hola World!')}
              </span>
              <span className="block overflow-hidden mt-1">
                <span className="hero-char" style={{ display: 'inline-block' }}>I</span>
                <span className="hero-char" style={{ display: 'inline-block' }}>m</span>
                <span className="hero-char" style={{ display: 'inline-block' }}>&nbsp;</span>
                <span className="font-serif italic text-accent">
                  {splitChars('Aquib', 'name-char')}
                </span>
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-6 text-text-secondary text-base leading-relaxed max-w-[480px]"
          >
            A passionate Fullstack Developer with creative thinking. Loves creating
            sleek designs and best softwares out of the box, I always wanna make
            products the best and most efficient.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center bg-accent text-[#0A0A0A] font-sans font-semibold text-sm px-7 py-3 rounded hover:bg-accent-dark transition-colors duration-300"
            >
              My Projects
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center bg-transparent text-white font-sans font-semibold text-sm px-7 py-3 rounded border border-[rgba(163,230,53,0.5)] hover:border-accent hover:text-accent transition-all duration-300"
            >
              About Me
            </a>
          </div>

          {/* Social Icons */}
          <div ref={socialsRef} className="mt-6 flex items-center gap-2.5">
            {socialLinks.map((link) => (
              <SocialIcon
                key={link.name}
                name={link.name}
                href={link.href}
                icon={link.icon}
              />
            ))}
          </div>
        </div>

        {/* Right — TechWorkspace */}
        <div className="flex items-center justify-center order-2 h-full min-h-[400px] w-full relative z-10">
          <TechWorkspace />
        </div>
      </div>
    </section>
  );
}
