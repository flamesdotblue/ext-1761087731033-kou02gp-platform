import { Download } from 'lucide-react';

export default function AudioControls({ audioUrl, fileName = 'tts-output.wav' }) {
  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 md:p-6 h-full">
      <h3 className="text-lg font-semibold mb-3">Output</h3>
      {!audioUrl ? (
        <div className="text-sm text-neutral-400">
          Your generated audio will appear here. Use Generate to create a preview and enable download.
        </div>
      ) : (
        <div className="space-y-4">
          <audio src={audioUrl} controls className="w-full" />
          <a
            href={audioUrl}
            download={fileName}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500"
          >
            <Download size={16} />
            Download WAV
          </a>
          <p className="text-xs text-neutral-500">Saved as: {fileName}</p>
        </div>
      )}
    </div>
  );
}
