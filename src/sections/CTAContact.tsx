import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTAContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll('.cta-reveal');
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

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '',
          email: email,
          subject: 'New Contact Request from Portfolio',
          message: `You have a new contact request from your portfolio website.\nEmail: ${email}`,
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setEmail('');
        }, 5000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-accent py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(10,10,10,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(10,10,10,0.08) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Bottom wave arc */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L1440 120L1440 60C1440 60 1200 0 720 0C240 0 0 60 0 60L0 120Z"
            fill="#0A0A0A"
          />
        </svg>
      </div>

      <div className="container-main relative z-10 text-center">
        <h2 className="cta-reveal font-sans font-medium text-[clamp(32px,4.5vw,56px)] leading-[1.05] tracking-[-0.03em] text-[#0A0A0A]">
          Let&apos;s create great things
          <br />
          together
        </h2>

        <p className="cta-reveal mt-4 text-[#0A0A0A]/80 text-lg">
          Drop your email and I&apos;ll contact you soon ;)
        </p>

        <form
          onSubmit={handleSubmit}
          className="cta-reveal mt-10 flex items-center justify-center"
        >
          <div className="relative w-full max-w-[480px]">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email here..."
              disabled={submitting || submitted}
              className="w-full py-4 pl-6 pr-16 rounded-full bg-[rgba(255,255,255,0.3)] border-none text-[#0A0A0A] placeholder-[#0A0A0A]/40 font-sans text-base focus:outline-none focus:ring-2 focus:ring-[#0A0A0A]/20 transition-all"
            />
            <button
              type="submit"
              disabled={submitting || submitted}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center hover:bg-[#1A1A1A] transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : submitted ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>

        {submitted && (
          <p className="mt-4 text-[#0A0A0A] font-sans font-medium text-sm animate-pulse">
            Thanks! I&apos;ll be in touch soon.
          </p>
        )}
      </div>
    </section>
  );
}
