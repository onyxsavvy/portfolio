import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, LayoutTemplate, Wrench, LayoutDashboard, Layers, Box } from 'lucide-react';
import ServicesCanvas from '@/components/ServicesCanvas';

gsap.registerPlugin(ScrollTrigger);

const servicesList = [
  {
    title: 'Website Development',
    description: 'Custom, high-performance websites tailored to your brand identity with cutting-edge technologies.',
    icon: Globe,
  },
  {
    title: 'Landing Pages',
    description: 'High-converting, beautifully designed landing pages optimized to drive business growth and leads.',
    icon: LayoutTemplate,
  },
  {
    title: 'Website Maintenance',
    description: 'Reliable ongoing support, security updates, and performance tuning for your existing web assets.',
    icon: Wrench,
  },
  {
    title: 'Dashboard',
    description: 'Intuitive data visualization and admin panels customized for your complex business logic.',
    icon: LayoutDashboard,
  },
  {
    title: 'Full Stack App',
    description: 'End-to-end web applications featuring robust backend architectures and sleek frontend interfaces.',
    icon: Layers,
  },
  {
    title: 'SaaS Product',
    description: 'Scalable software-as-a-service platforms built for rapid growth and seamless user onboarding.',
    icon: Box,
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll('.service-reveal');
    
    // Entrance Animation
    gsap.set(elements, { opacity: 0, y: 60, rotationX: -15, transformPerspective: 1000 });
    
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    // 3D Tilt Hover Effects
    const eventListeners: { el: HTMLElement, move: EventListener, leave: EventListener }[] = [];

    elements.forEach((card) => {
      const el = card as HTMLElement;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate rotation based on cursor position
        const rotateX = ((y - centerY) / centerY) * -12; // max 12 deg tilt
        const rotateY = ((x - centerX) / centerX) * 12;
        
        gsap.to(el, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.4,
          ease: 'power2.out',
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(el, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'power3.out',
        });
      };
      
      el.addEventListener('mousemove', handleMouseMove as EventListener);
      el.addEventListener('mouseleave', handleMouseLeave);
      
      eventListeners.push({ el, move: handleMouseMove as EventListener, leave: handleMouseLeave });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
      eventListeners.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-background py-24 lg:py-32 relative overflow-hidden"
    >
      {/* 3D WebGL Background Canvas */}
      <ServicesCanvas />

      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="container-main relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16 service-reveal">
          <h2 className="font-sans font-medium text-[clamp(40px,5vw,72px)] leading-[1.0] tracking-[-0.03em] text-white">
            Services I <span className="font-serif italic text-accent">Provide</span>
          </h2>
          <p className="mt-6 text-text-secondary text-lg max-w-2xl mx-auto">
            Delivering top-tier digital solutions tailored for startups, agencies, and enterprise businesses.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-[1000px]">
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="service-reveal group relative bg-surface/80 backdrop-blur-sm border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 hover:border-[rgba(163,230,53,0.5)] transition-colors duration-500 will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Hover gradient background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                  style={{ transform: 'translateZ(-1px)' }}
                />
                
                <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
                  {/* Icon Container */}
                  <div className="w-14 h-14 rounded-xl bg-elevated/80 border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-text-muted group-hover:text-[#0A0A0A] group-hover:bg-accent group-hover:scale-110 transition-all duration-500 mb-6 shadow-lg group-hover:shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-white font-serif font-medium text-2xl mb-3 group-hover:text-accent transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-text-secondary font-sans font-light text-[15px] leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
