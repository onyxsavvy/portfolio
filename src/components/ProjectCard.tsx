import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TiltCard from '@/components/TiltCard';

gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  name: string;
  description: string;
  image: string;
  tags: string[];
  index: number;
  color?: string;
}

export default function ProjectCard({ name, description, image, tags, index, color = '#A3E635' }: ProjectCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 50, scale: 0.95 });

    const tween = gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: index * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => { tween.kill(); };
  }, [index]);

  return (
    <div ref={wrapperRef} className="group relative cursor-pointer block h-full">
      <TiltCard 
        className="relative overflow-hidden rounded-xl aspect-[16/10] border border-[rgba(255,255,255,0.05)] transition-all duration-500 hover:border-transparent shadow-2xl" 
        style={{ boxShadow: `0 20px 40px -10px ${color}20` } as React.CSSProperties}
      >
        {/* Glow effect behind image */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-3xl z-0"
          style={{ backgroundColor: color }}
        />
        
        <img
          src={image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] relative z-10"
        />
        
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,10,0.95)] via-[rgba(10,10,10,0.4)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
        
        {/* Content on hover */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-6 group-hover:translate-y-0 z-30">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-white/10 text-white border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="font-display font-semibold text-2xl text-white mb-2">{name}</h3>
          <p className="font-sans text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>
        </div>
      </TiltCard>
      
      {/* Dynamic Project name pill (Floating badge) */}
      <div className="absolute -bottom-4 left-6 z-40 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-105">
        <span 
          className="inline-block bg-accent text-[#0A0A0A] font-display font-bold text-sm px-6 py-2.5 rounded-lg shadow-lg"
        >
          {name}
        </span>
      </div>
    </div>
  );
}
