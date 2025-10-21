import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const RecorderBar = forwardRef(function RecorderBar(_props, ref) {
  const [isCaptureEnabled, setCaptureEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const hiddenVideoRef = useRef(null);

  useImperativeHandle(ref, () => ({
    ensureCapture: async () => {
      if (isCaptureEnabled && streamRef.current) return;
      await enableCaptureInternal();
    },
    startRecording: async () => {
      if (!streamRef.current) throw new Error('Capture not enabled');
      if (isRecording) return;
      startRecordingInternal();
    },
    stopRecording: async () => {
      if (!mediaRecorderRef.current) return;
      if (mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();
    },
  }));

  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, [downloadUrl]);

  const enableCaptureInternal = async () => {
    setError('');
    try {
      // getDisplayMedia with video true to allow tab/system selection; we ignore the video track
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      // Some browsers only provide audio if a video track is present; keep it but do not render
      streamRef.current = stream;
      setCaptureEnabled(true);

      // Attach to hidden video to keep the stream alive in some browsers
      if (hiddenVideoRef.current) {
        hiddenVideoRef.current.srcObject = stream;
        hiddenVideoRef.current.muted = true;
        hiddenVideoRef.current.play().catch(() => {});
      }
    } catch (e) {
      console.error(e);
      setError('Permission denied or capture unavailable.');
      setCaptureEnabled(false);
    }
  };

  const startRecordingInternal = () => {
    if (!streamRef.current) return;
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl('');
    }
    chunksRef.current = [];

    const mimeCandidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'video/webm;codecs=vp9,opus',
      'video/webm',
    ];
    const mimeType = mimeCandidates.find(t => MediaRecorder.isTypeSupported(t)) || '';

    const mr = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = mr;

    mr.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };
    mr.onstart = () => setIsRecording(true);
    mr.onstop = () => {
      setIsRecording(false);
      const blob = new Blob(chunksRef.current, { type: mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    };

    mr.start();
  };

  const handleEnableClick = async () => {
    await enableCaptureInternal();
  };

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'tts-recording.webm';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleStopNow = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-sm text-white/80">Tab Audio Capture</div>
          <div className="text-xs text-white/55">
            {isCaptureEnabled ? 'Ready: Speech will be recorded from this tab for download.' : 'Enable capture to allow recording of speech audio.'}
          </div>
          {error && <div className="text-xs text-red-300">{error}</div>}
        </div>
        <div className="flex items-center gap-2">
          {!isCaptureEnabled && (
            <button onClick={handleEnableClick} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15">
              Enable Tab Capture
            </button>
          )}
          {isCaptureEnabled && !isRecording && (
            <button onClick={handleEnableClick} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15">
              Re-select Source
            </button>
          )}
          {isRecording && (
            <button onClick={handleStopNow} className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white">
              Stop Recording
            </button>
          )}
          {downloadUrl && (
            <button onClick={handleDownload} className="px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500">
              Download
            </button>
          )}
        </div>
      </div>
      <div className="mt-3 text-xs text-white/50">
        Note: To capture audio from speech, select "This Tab" or the correct window when prompted. Recording starts automatically when speaking and stops when finished.
      </div>
      <video ref={hiddenVideoRef} className="hidden" playsInline />
    </div>
  );
});

export default RecorderBar;
