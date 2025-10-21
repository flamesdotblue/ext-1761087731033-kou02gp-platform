import { useEffect, useRef } from 'react';
import { Play, Square, Download, Mic } from 'lucide-react';

export default function AudioPanel({ isSpeaking, speak, stopSpeaking, isRecording, setIsRecording, recordingURL, setRecordingURL, textPresent }) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) stopStream(streamRef.current);
    };
  }, []);

  function stopStream(stream) {
    stream.getTracks().forEach(t => t.stop());
  }

  async function recordAndSpeak() {
    if (!textPresent) return;
    try {
      setRecordingURL('');
      // Ask to capture current tab with audio; user should choose the current tab and enable "Share tab audio"
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        // Many browsers allow playing just the audio track from this WebM
        const url = URL.createObjectURL(blob);
        setRecordingURL(url);
        setIsRecording(false);
        if (streamRef.current) {
          stopStream(streamRef.current);
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start TTS and stop recording when speech ends
      speak({
        onend: () => {
          if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
        }
      });
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      alert('Screen/tab capture was blocked or failed. Please allow access and select the current tab with "Share tab audio".');
    }
  }

  function downloadRecording() {
    if (!recordingURL) return;
    const a = document.createElement('a');
    a.href = recordingURL;
    a.download = 'tts-recording.webm';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="mt-8 grid gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => speak()}
          disabled={!textPresent || isSpeaking || isRecording}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
        >
          <Play size={18} /> Speak
        </button>
        <button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
        >
          <Square size={18} /> Stop
        </button>
        <button
          onClick={recordAndSpeak}
          disabled={!textPresent || isSpeaking || isRecording}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
          title="Records the current tab audio while speaking. When prompted, select this tab and enable Share tab audio."
        >
          <Mic size={18} /> Record & Download
        </button>
      </div>

      {isRecording && (
        <div className="text-sm text-amber-300">Recording in progress... finish will trigger automatically when speech ends. If nothing happens, click Stop in the browser sharing banner.</div>
      )}

      {recordingURL && (
        <div className="grid gap-3">
          <video src={recordingURL} controls className="w-full rounded-lg border border-white/10" />
          <div>
            <button onClick={downloadRecording} className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2">
              <Download size={18} /> Download .webm
            </button>
            <p className="mt-2 text-xs text-white/50">Note: The download is a WebM file containing your tab capture. Most players will play the audio track. You can convert to MP3/WAV using third-party tools if needed.</p>
          </div>
        </div>
      )}
    </div>
  );
}
