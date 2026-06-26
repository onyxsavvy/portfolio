import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingCircle from '@/components/FloatingCircle';
import { footerLinks } from '@/data/content';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FooterProps {
  onBookMeeting?: () => void;
}

export default function Footer({ onBookMeeting }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const elements = footer.querySelectorAll('.footer-reveal');
    gsap.set(elements, { opacity: 0, y: 30 });
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === footer) st.kill();
      });
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-background pt-20 pb-10">
      <div className="container-main">
        {/* Top Row: Links + Floating Circles */}
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Link Columns */}
          <div className="footer-reveal flex gap-16 lg:gap-24">
            {/* Links */}
            <div>
              <p className="text-text-muted text-xs font-sans font-medium tracking-wider uppercase mb-4">
                Links
              </p>
              <ul className="space-y-3">
                {footerLinks.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-secondary text-sm font-sans hover:text-white hover:underline underline-offset-4 transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Socials */}
            <div>
              <p className="text-text-muted text-xs font-sans font-medium tracking-wider uppercase mb-4">
                Socials
              </p>
              <ul className="space-y-3">
                {footerLinks.socials.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary text-sm font-sans hover:text-white hover:underline underline-offset-4 transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Floating Action Circles */}
          <div className="footer-reveal flex gap-4">
            <FloatingCircle
              label="Message me"
              variant="lime"
              href="https://wa.me/916202358865?text=Hi%20Aquib,%20I'd%20like%20to%20discuss%20a%20project!"
            />
            <FloatingCircle
              label="Book a meeting"
              variant="white"
              onClick={onBookMeeting}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(255,255,255,0.06)] my-12 lg:my-16" />

        {/* Bottom Row: Wordmark */}
        <div className="footer-reveal flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-sans font-medium text-[clamp(48px,8vw,120px)] leading-none tracking-[-0.04em] text-white">
              Aquib
            </span>
            <span className="text-text-muted text-sm font-sans">aka</span>
            <span className="font-serif italic text-accent text-xl">
              founder
            </span>
          </div>

          <p className="text-text-muted text-sm font-sans">
            &copy; {new Date().getFullYear()} OnyxSavvy
          </p>
        </div>
      </div>
    </footer>
  );
}
