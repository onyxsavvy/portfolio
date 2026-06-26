import { Github, Linkedin, Twitter, Instagram, Briefcase } from 'lucide-react';

interface SocialIconProps {
  name: string;
  href: string;
  icon: string;
  size?: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Briefcase,
};

export default function SocialIcon({ name, href, icon, size = 18 }: SocialIconProps) {
  const IconComponent = iconMap[icon] || Github;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className="w-10 h-10 flex items-center justify-center rounded-lg bg-[rgba(255,255,255,0.06)] text-text-secondary hover:text-accent hover:bg-[rgba(163,230,53,0.1)] transition-all duration-300"
    >
      <IconComponent size={size} />
    </a>
  );
}
