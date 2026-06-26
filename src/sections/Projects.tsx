import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/content';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    // 3D Cylinder Text Scroll — letter reveal
    const letters = title.querySelectorAll('.project-letter');
    if (letters.length > 0) {
      gsap.set(letters, {
        opacity: 0,
        rotateX: -90,
        transformOrigin: 'center bottom',
      });

      gsap.to(letters, {
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.5,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === title) st.kill();
      });
    };
  }, []);

  const titleText = 'Projects';

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="bg-background py-24 lg:py-32"
    >
      <div className="container-main">
        {/* Section Title with 3D cylinder scroll */}
        <h2
          ref={titleRef}
          className="text-center font-display font-medium text-[clamp(40px,5vw,72px)] leading-[1.0] tracking-[-0.03em] text-white"
          style={{ perspective: '800px' }}
        >
          {titleText.split('').map((letter, i) => (
            <span
              key={i}
              className="project-letter inline-block"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {letter}
            </span>
          ))}
        </h2>

        {/* Project Grid */}
        <div ref={gridRef} className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.name}
              name={project.name}
              description={project.description}
              image={project.image}
              tags={project.tags}
              index={i}
              color={(project as any).color}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <button className="inline-flex items-center gap-2 px-7 py-3 rounded-3xl border border-[rgba(255,255,255,0.15)] text-white font-sans font-medium text-sm hover:border-accent hover:text-accent transition-all duration-300">
            Check out all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
