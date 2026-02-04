export const LuminaLogo = ({ className, size = 32 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="lumina-gradient" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#3B82F6" /> {/* Blue */}
        <stop offset="50%" stopColor="#8B5CF6" /> {/* Purple */}
        <stop offset="100%" stopColor="#EC4899" /> {/* Pink */}
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Base Shape */}
    <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#lumina-gradient)" fillOpacity="0.2" />

    {/* Core Light */}
    <circle cx="50" cy="50" r="25" fill="url(#lumina-gradient)" filter="url(#glow)" />

    {/* Reflection/Sparkle */}
    <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="white" fillOpacity="0.9" />
  </svg>
);
