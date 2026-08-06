import { cn } from '@/lib/utils/cn';
import { getInitials } from '@/lib/utils/formatters';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base' };

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);
  const sizeClass = sizeMap[size];

  return (
    <div className={cn('relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 font-semibold text-white', sizeClass, className)}>
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" sizes="44px" onError={() => {}} />
      ) : (
        initials
      )}
    </div>
  );
}
