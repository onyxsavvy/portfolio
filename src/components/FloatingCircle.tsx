interface FloatingCircleProps {
  label: string;
  variant: 'lime' | 'white';
  href?: string;
  onClick?: () => void;
}

export default function FloatingCircle({ label, variant, href, onClick }: FloatingCircleProps) {
  const baseClasses =
    'w-[100px] h-[100px] rounded-full flex items-center justify-center text-center font-sans font-semibold text-xs leading-tight cursor-pointer transition-transform duration-300 hover:scale-105';

  const variantClasses =
    variant === 'lime'
      ? 'bg-accent text-[#0A0A0A] hover:bg-accent-dark'
      : 'bg-white text-[#0A0A0A] hover:bg-gray-100';

  const content = <span className="px-2">{label}</span>;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {content}
    </button>
  );
}
