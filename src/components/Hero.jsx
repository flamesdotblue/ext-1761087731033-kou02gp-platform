import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <header className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-black/40 to-black" />
      <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">Universal Text-to-Speech</h1>
          <p className="mt-4 text-white/80 text-base md:text-lg">Type in any language and generate natural speech using your browser’s built-in multilingual voices. Record and download your audio in one click.</p>
        </div>
      </div>
    </header>
  );
}
