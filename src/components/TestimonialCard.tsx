import { Star, StarHalf } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  highlight?: boolean;
}

export default function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  rating,
  highlight = false,
}: TestimonialCardProps) {
  return (
    <div
      className={`flex-shrink-0 w-[360px] p-7 rounded-2xl ${
        highlight
          ? 'bg-accent text-[#0A0A0A]'
          : 'bg-surface border border-[rgba(255,255,255,0.06)] text-text-primary'
      }`}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: Math.floor(rating) }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`w-3.5 h-3.5 fill-current ${
              highlight ? 'text-[#0A0A0A]' : 'text-accent'
            }`}
          />
        ))}
        {rating % 1 !== 0 && (
          <StarHalf
            className={`w-3.5 h-3.5 fill-current ${
              highlight ? 'text-[#0A0A0A]' : 'text-accent'
            }`}
          />
        )}
      </div>

      {/* Quote */}
      <p
        className={`mt-4 text-sm leading-relaxed ${
          highlight ? 'text-[#0A0A0A]/80' : 'text-text-secondary'
        }`}
      >
        {quote}
      </p>

      {/* Divider */}
      <div
        className={`h-px my-5 ${
          highlight ? 'bg-[rgba(10,10,10,0.15)]' : 'bg-[rgba(255,255,255,0.06)]'
        }`}
      />

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={name}
          className="w-9 h-9 rounded-full object-cover"
          loading="lazy"
        />
        <div>
          <p className="text-sm font-sans font-semibold">{name}</p>
          <p
            className={`text-xs ${
              highlight ? 'text-[#0A0A0A]/60' : 'text-text-muted'
            }`}
          >
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
