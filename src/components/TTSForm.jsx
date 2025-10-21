import { useMemo } from 'react';

export default function TTSForm({ text, onTextChange, voices, selectedVoiceURI, onSelectVoice, rate, onRateChange, pitch, onPitchChange }) {
  const langs = useMemo(() => {
    const set = new Set(voices.map(v => v.lang));
    return Array.from(set).sort();
  }, [voices]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const v of voices) {
      const key = v.lang || 'Other';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(v);
    }
    for (const key of map.keys()) {
      map.get(key).sort((a,b) => a.name.localeCompare(b.name));
    }
    return Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]));
  }, [voices]);

  return (
    <div className="grid gap-6">
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">Your text</label>
        <textarea
          value={text}
          onChange={e => onTextChange(e.target.value)}
          placeholder="Type or paste text in any language..."
          rows={6}
          className="w-full rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500 px-4 py-3 text-base placeholder:text-white/40"
        />
        <p className="mt-2 text-xs text-white/50">Tip: For best results, choose a voice with the correct language tag.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/80 mb-2">Voice</label>
          <select
            value={selectedVoiceURI}
            onChange={(e) => onSelectVoice(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500 px-4 py-3"
          >
            {grouped.length === 0 && (
              <option value="">Loading voices...</option>
            )}
            {grouped.map(([lang, list]) => (
              <optgroup key={lang} label={lang}>
                {list.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name}{v.default ? ' (Default)' : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Rate: {rate.toFixed(2)}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={rate}
              onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Pitch: {pitch.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={pitch}
              onChange={(e) => onPitchChange(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {langs.length === 0 && (
        <div className="text-xs text-white/50">If you don't see any voices, try refreshing the page. Some browsers require a reload before voices appear.</div>
      )}
    </div>
  );
}
