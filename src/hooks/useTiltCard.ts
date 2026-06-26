import { useEffect, useRef } from 'react';

interface TiltOptions {
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glareOpacity?: number;
  transitionDuration?: number;
}

export function useTiltCard<T extends HTMLElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null);
  const glareRef = useRef<HTMLDivElement | null>(null);

  const {
    maxTilt = 15,
    perspective = 800,
    scale = 1.02,
    glareOpacity = 0.15,
    transitionDuration = 400,
  } = options;

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    // Create glare element if not exists
    let glare = card.querySelector('.tilt-glare') as HTMLDivElement;
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'tilt-glare';
      glare.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: inherit;
        overflow: hidden;
        z-index: 10;
      `;
      const glareInner = document.createElement('div');
      glareInner.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 200%;
        height: 200%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.3) 0%, transparent 60%);
        opacity: 0;
        transition: opacity ${transitionDuration}ms ease;
      `;
      glare.appendChild(glareInner);
      card.appendChild(glare);
      glareRef.current = glare;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
      const rotateX = -(mouseY / (rect.height / 2)) * maxTilt;

      card.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;
      card.style.transition = 'transform 100ms ease-out';

      // Update glare position
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--glare-x', `${glareX}%`);
      card.style.setProperty('--glare-y', `${glareY}%`);
      
      const glareInner = glare.querySelector('div') as HTMLDivElement;
      if (glareInner) {
        glareInner.style.opacity = String(glareOpacity);
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = `transform ${transitionDuration}ms ease-out`;
      
      const glareInner = glare.querySelector('div') as HTMLDivElement;
      if (glareInner) {
        glareInner.style.opacity = '0';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, perspective, scale, glareOpacity, transitionDuration]);

  return ref;
}
