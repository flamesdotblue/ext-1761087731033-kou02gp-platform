export default function Controls({ rate, setRate, pitch, setPitch, volume, setVolume }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Rate: {rate.toFixed(2)}</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.05"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Pitch: {pitch.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.05"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white/80 mb-1">Volume: {volume.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
