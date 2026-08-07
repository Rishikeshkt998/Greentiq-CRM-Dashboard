import { AvatarSize } from '@/types/avatar';

export const sizeMap: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base',
};

// Fixed gradient pairs as CSS values — safe from Tailwind purging
const avatarColors = [
  ['#2563eb', '#4f46e5'], // blue → indigo
  ['#0d9488', '#059669'], // teal → emerald
  ['#7c3aed', '#9333ea'], // violet → purple
  ['#d97706', '#ea580c'], // amber → orange
  ['#e11d48', '#db2777'], // rose → pink
  ['#0284c7', '#0891b2'], // sky → cyan
  ['#16a34a', '#15803d'], // green shades
];

export function getGradient(name: string): string {
  // Returns a CSS linear-gradient string
  const charCode = name ? name.charCodeAt(0) : 0;
  const pair = avatarColors[charCode % avatarColors.length];
  return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
}
