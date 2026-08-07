export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
}
