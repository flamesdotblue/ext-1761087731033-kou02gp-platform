export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-black/60">
      <div className="container mx-auto px-4 md:px-6 lg:px-10 py-8 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <span className="font-semibold text-white/80">TTS Playground</span> — Browser-based text-to-speech with recording.
        </div>
        <div className="text-white/50">For best results, use Chrome or Edge with voices installed for your language.</div>
      </div>
    </footer>
  );
}
