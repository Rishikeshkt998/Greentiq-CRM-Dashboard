'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/formatters';
import { sizeMap, getGradient } from '@/lib/utils/avatar';
import { AvatarProps } from '@/types/avatar';

export type { AvatarProps };

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const sizeClass = sizeMap[size];
  const gradient = getGradient(name);

  // Show image if src provided and hasn't errored
  if (src && !imageError) {
    return (
      <div className={cn('relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-2xs', sizeClass, className)}
        style={{ background: gradient }}
      >
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback: gradient initials avatar
  return (
    <div
      className={cn(
        'inline-flex flex-shrink-0 items-center justify-center rounded-full font-bold text-white shadow-2xs select-none',
        sizeClass,
        className
      )}
      style={{ background: gradient }}
    >
      {initials}
    </div>
  );
}

