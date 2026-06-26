import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MenuOverlay from './MenuOverlay';

gsap.registerPlugin(ScrollTrigger);

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -64, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(10,10,10,0.85)] backdrop-blur-[12px] border-b border-[rgba(255,255,255,0.06)]'
            : 'bg-transparent'
        }`}
        style={{ padding: '0 24px' }}
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="w-7 h-7 relative">
            <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
              <path
                d="M4 4h10v10H4zM14 4h10v4H14zM14 10h10v4H14zM4 16h8v8H4zM14 16h10v8H14z"
                fill="#A3E635"
                className="transition-all duration-300 group-hover:fill-[#84CC16]"
              />
            </svg>
          </div>
          <span className="text-white font-sans font-semibold text-sm tracking-wide hidden sm:block">
            OnyxSavvy
          </span>
        </a>

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className={`font-sans font-medium text-sm tracking-[0.08em] uppercase px-5 py-2 rounded-3xl transition-all duration-300 ${
            scrolled
              ? 'bg-[rgba(255,255,255,0.06)] text-white hover:bg-[rgba(163,230,53,0.15)] hover:text-accent'
              : 'bg-transparent text-white hover:bg-[rgba(163,230,53,0.15)] hover:text-accent'
          }`}
        >
          Menu
        </button>
      </nav>

      <MenuOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
