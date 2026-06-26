import { type ReactNode } from 'react';
import { useTiltCard } from '@/hooks/useTiltCard';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function TiltCard({ children, className = '', style }: TiltCardProps) {
  const cardRef = useTiltCard<HTMLDivElement>({
    maxTilt: 15,
    perspective: 800,
    scale: 1.02,
    glareOpacity: 0.15,
  });

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  );
}
