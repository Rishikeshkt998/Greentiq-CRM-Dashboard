'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/formatters';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
};

const avatarGradients = [
  'from-blue-600 to-indigo-600',
  'from-teal-600 to-emerald-600',
  'from-violet-600 to-purple-600',
  'from-amber-600 to-orange-600',
  'from-rose-600 to-pink-600',
];

function getGradient(name: string) {
  const charCode = name ? name.charCodeAt(0) : 0;
  return avatarGradients[charCode % avatarGradients.length];
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const sizeClass = sizeMap[size];
  const gradient = getGradient(name);

  // Generate deterministic realistic avatar URL based on name
  const avatarUrl = src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

  if (!imageError) {
    return (
      <div className={cn('relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 shadow-2xs', sizeClass, className)}>
        <img
          src={avatarUrl}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-2xs select-none',
        gradient,
        sizeClass,
        className
      )}
    >
      {initials}
    </div>
  );
}
