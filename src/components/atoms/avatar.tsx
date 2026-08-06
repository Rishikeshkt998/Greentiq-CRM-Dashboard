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
  'from-orange-500 to-amber-600',
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

  // If URL is invalid or synthetic broken Unsplash URL, trigger fallback
  const isInvalidUrl = !src || src.includes('photo-1500000000000');

  if (!isInvalidUrl && !imageError) {
    return (
      <div className={cn('relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full', sizeClass, className)}>
        <img
          src={src}
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
        'inline-flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-sm select-none',
        gradient,
        sizeClass,
        className
      )}
    >
      {initials}
    </div>
  );
}
