import { cn } from '@/lib/utils/cn';

interface AppLogoProps {
  className?: string;
}

export function AppLogo({ className }: AppLogoProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-8 w-8 rounded-xl shadow-xs flex-shrink-0 select-none', className)}
    >
      <defs>
        <linearGradient id="bg-logo-sym" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c58b" />
          <stop offset="100%" stopColor="#0a6e4d" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="512" height="512" rx="128" fill="url(#bg-logo-sym)" />

      {/* Perfectly Symmetric Leaf Contour */}
      <path
        d="M 256 80 
           C 140 170, 140 290, 256 345 
           C 372 290, 372 170, 256 80 Z"
        fill="#eafff5"
      />

      {/* Symmetric Center Stem */}
      <path
        d="M 256 120 L 256 320"
        stroke="#0a6e4d"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Symmetric Left & Right Veins */}
      <path
        d="M 256 170 C 220 195, 195 215, 185 235
           M 256 170 C 292 195, 317 215, 327 235
           M 256 230 C 225 250, 205 265, 195 280
           M 256 230 C 287 250, 307 265, 317 280"
        stroke="#0a6e4d"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* CRM Bold Text */}
      <text
        x="256"
        y="438"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, Arial, sans-serif"
        fontSize="82"
        fontWeight="900"
        fill="#eafff5"
        letterSpacing="8"
      >
        CRM
      </text>
    </svg>
  );
}
