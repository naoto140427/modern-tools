import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ModernTools - Focus on Creation';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 背景の装飾（オーロラ） */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '60%',
            height: '60%',
            background: 'rgba(59, 130, 246, 0.2)', // Blue
            filter: 'blur(100px)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            right: '-20%',
            width: '60%',
            height: '60%',
            background: 'rgba(147, 51, 234, 0.2)', // Purple
            filter: 'blur(100px)',
            borderRadius: '50%',
          }}
        />

        {/* メインテキスト */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            zIndex: 10,
          }}
        >
          {/* アイコン風の四角 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #000 100%)',
              marginBottom: '20px',
              color: 'white',
              fontSize: '40px',
            }}
          >
            ⚡️
          </div>

          <h1
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-0.05em',
            }}
          >
            ModernTools
          </h1>

          <p
            style={{
              fontSize: '30px',
              color: '#a3a3a3', // neutral-400
              margin: 0,
            }}
          >
            Ultimate Workspace for Creators
          </p>
        </div>

        {/* UIっぽい装飾 */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <div style={{ padding: '5px 15px', borderRadius: '20px', border: '1px solid #333', color: '#666', fontSize: '14px' }}>WebP Converter</div>
          <div style={{ padding: '5px 15px', borderRadius: '20px', border: '1px solid #333', color: '#666', fontSize: '14px' }}>Privacy First</div>
          <div style={{ padding: '5px 15px', borderRadius: '20px', border: '1px solid #333', color: '#666', fontSize: '14px' }}>Local AI</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}