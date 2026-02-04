import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Lumina Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // 本来は引数からタイトル等を取得するが、まずはデフォルトのBrand Imageを作成
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#030712', // Dark background
          backgroundImage: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #030712 50%)',
        }}
      >
        {/* Glow Effect Background */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Logo Representation */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
           {/* SVGの簡易版をここに埋め込む */}
           <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
             <rect x="10" y="10" width="80" height="80" rx="20" fill="url(#grad)" fillOpacity="0.2" />
             <circle cx="50" cy="50" r="25" fill="url(#grad)" />
             <path d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z" fill="white" />
             <defs>
               <linearGradient id="grad" x1="0" y1="0" x2="100" y2="100">
                 <stop offset="0%" stopColor="#3B82F6" />
                 <stop offset="100%" stopColor="#EC4899" />
               </linearGradient>
             </defs>
           </svg>
        </div>

        {/* Brand Name */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            background: 'linear-gradient(to bottom right, #fff 30%, #aaa 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.02em',
            fontFamily: 'sans-serif',
          }}
        >
          Lumina Studio
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#94a3b8',
            marginTop: '20px',
            fontFamily: 'sans-serif',
          }}
        >
          Privacy-First Browser Tools
        </div>
      </div>
    ),
    { ...size }
  );
}
