import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { navLinks } from '@/data/content';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!panelRef.current || !itemsRef.current) return;

    const panel = panelRef.current;
    const items = itemsRef.current.querySelectorAll('.menu-item');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.fromTo(
        panel,
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power3.inOut' }
      );

      tl.fromTo(
        items,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' },
        '-=0.2'
      );
    } else {
      document.body.style.overflow = '';

      if (tlRef.current) {
        tlRef.current.kill();
      }

      const tl = gsap.timeline();
      tl.to(items, {
        opacity: 0,
        x: 20,
        duration: 0.2,
        stagger: 0.04,
        ease: 'power3.in',
      });
      tl.to(
        panel,
        { x: '100%', duration: 0.4, ease: 'power3.inOut' },
        '-=0.1'
      );
    }

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [isOpen]);

  const handleLinkClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  };

  return (
    <div
      ref={panelRef}
      className="fixed top-0 right-0 z-[100] h-screen bg-accent rounded-l-3xl w-full md:w-[380px] flex flex-col justify-center px-10"
      style={{ transform: 'translateX(100%)' }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 font-sans font-medium text-sm tracking-[0.08em] uppercase px-5 py-2 rounded-3xl bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] transition-colors"
      >
        Close
      </button>

      {/* Menu Items */}
      <div ref={itemsRef} className="flex flex-col gap-6">
        {navLinks.slice(1).map((link) => (
          <button
            key={link.href}
            onClick={() => handleLinkClick(link.href)}
            className="menu-item text-left font-sans font-medium text-4xl text-[#0A0A0A] tracking-[0.02em] hover:translate-x-2 transition-transform duration-300 flex items-center gap-3 group"
          >
            {link.label.toUpperCase()}
            <svg
              className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
