import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f4f0e6',
        color: '#1d1a14',
        fontFamily: "ui-monospace, 'Geist Mono', 'JetBrains Mono', Menlo, monospace",
        fontWeight: 700,
        fontSize: 92,
        letterSpacing: '-0.04em',
        position: 'relative'
      }}
    >
      {'{ }'}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          right: 22,
          bottom: 22,
          width: 38,
          height: 38,
          borderRadius: 9999,
          background: '#1d1a14',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            width: 26,
            height: 26,
            borderRadius: 9999,
            background: '#7ec396'
          }}
        />
      </div>
    </div>,
    size
  );
}
