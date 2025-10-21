export default function VoiceSelector({ voices, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">Voice</label>
      <select
        className="w-full rounded-lg bg-white/5 border border-white/10 p-2 outline-none focus:border-white/20"
        value={value ? value.name : ''}
        onChange={(e) => {
          const v = voices.find(v => v.name === e.target.value) || null;
          onChange(v);
        }}
      >
        {voices.length === 0 && <option value="">Loading voices…</option>}
        {voices.map((v) => (
          <option key={`${v.name}-${v.lang}`} value={v.name}>
            {v.name} ({v.lang}{v.default ? ' • default' : ''})
          </option>
        ))}
      </select>
      <p className="text-xs text-white/50">Voices come from your browser/OS and support many languages.</p>
    </div>
  );
}
