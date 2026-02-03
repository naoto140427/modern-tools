import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Lumina Studio - Ultimate Serverless Creative Tools';
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
            background: 'rgba(236, 72, 153, 0.2)', // Pink
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              color: 'white',
              fontSize: '60px',
            }}
          >
            ⚡️
          </div>

          <h1
            style={{
              fontSize: '90px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              lineHeight: 1,
              letterSpacing: '-0.05em',
            }}
          >
            Lumina Studio
          </h1>

          <p
            style={{
              fontSize: '36px',
              color: '#a3a3a3',
              margin: 0,
              fontWeight: 300,
            }}
          >
            Your Creative Studio. In the Browser.
          </p>
        </div>

        {/* UIっぽい装飾 */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            display: 'flex',
            gap: '15px',
          }}
        >
          <div style={{ padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#ccc', fontSize: '16px' }}>AI Magic</div>
          <div style={{ padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#ccc', fontSize: '16px' }}>Privacy First</div>
          <div style={{ padding: '8px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#ccc', fontSize: '16px' }}>Serverless</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
