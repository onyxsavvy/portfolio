import { useCallback, useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import TestimonialCard from '@/components/TestimonialCard';
import { testimonials } from '@/data/content';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [AutoScroll({ playOnInit: true, speed: 1.5, stopOnInteraction: false })]
  );

  useEffect(() => {
    const title = sectionRef.current?.querySelector('.testimonials-title');
    if (title) {
      gsap.set(title, { opacity: 0, y: 40 });
      gsap.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      const autoScroll = emblaApi.plugins().autoScroll;
      if (autoScroll) {
        autoScroll.reset();
        autoScroll.play();
      }
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      const autoScroll = emblaApi.plugins().autoScroll;
      if (autoScroll) {
        autoScroll.reset();
        autoScroll.play();
      }
    }
  }, [emblaApi]);

  const onMouseEnter = useCallback(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins().autoScroll;
    if (autoScroll) autoScroll.stop();
  }, [emblaApi]);

  const onMouseLeave = useCallback(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins().autoScroll;
    if (autoScroll) autoScroll.play();
  }, [emblaApi]);

  return (
    <section ref={sectionRef} id="testimonials" className="bg-background py-20 lg:py-24 overflow-hidden">
      {/* Section Title */}
      <h2 className="testimonials-title text-center font-sans font-medium text-[clamp(40px,5vw,72px)] leading-[1.0] tracking-[-0.03em] text-white mb-16 container-main">
        Client <span className="font-serif italic text-accent">Testimonials</span>
      </h2>

      {/* Marquee Track using Embla */}
      <div 
        className="embla w-full overflow-hidden" 
        ref={emblaRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onMouseEnter}
        onTouchEnd={onMouseLeave}
      >
        <div className="embla__container flex cursor-grab active:cursor-grabbing ml-6">
          {testimonials.map((t, i) => (
            <div key={`${t.name}-${i}`} className="embla__slide flex-shrink-0 mr-6">
              <TestimonialCard
                quote={t.quote}
                name={t.name}
                role={t.role}
                avatar={t.avatar}
                rating={t.rating}
                highlight={i % 3 === 1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-3 mt-10">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 rounded-full bg-surface border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-white hover:bg-accent hover:text-[#0A0A0A] hover:border-accent transition-all duration-300"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="w-10 h-10 rounded-full bg-surface border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-white hover:bg-accent hover:text-[#0A0A0A] hover:border-accent transition-all duration-300"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
