import { useEffect, useMemo, useRef, useState } from 'react';
import Hero from './components/Hero';
import TTSForm from './components/TTSForm';
import AudioPanel from './components/AudioPanel';
import Footer from './components/Footer';

export default function App() {
  const [text, setText] = useState('Hello! This is a multilingual text-to-speech demo. Type anything and choose a voice.');
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [recordingURL, setRecordingURL] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const utteranceRef = useRef(null);

  useEffect(() => {
    function loadVoices() {
      const list = window.speechSynthesis?.getVoices?.() || [];
      setVoices(list);
      if (!selectedVoiceURI && list.length > 0) {
        const defaultVoice = list.find(v => v.default) || list[0];
        setSelectedVoiceURI(defaultVoice?.voiceURI || '');
      }
    }
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceURI]);

  const selectedVoice = useMemo(() => voices.find(v => v.voiceURI === selectedVoiceURI) || null, [voices, selectedVoiceURI]);

  function speak(opts = { onend: () => {} }) {
    if (!text.trim()) return;
    if (!window.speechSynthesis) {
      alert('Speech Synthesis not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (selectedVoice) u.voice = selectedVoice;
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => {
      setIsSpeaking(false);
      opts.onend?.();
    };
    u.onerror = () => {
      setIsSpeaking(false);
      opts.onend?.();
    };
    utteranceRef.current = u;
    setIsSpeaking(true);
    window.speechSynthesis.speak(u);
  }

  function stopSpeaking() {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Hero />
      <main className="relative z-10 container mx-auto px-4 md:px-6 lg:px-10 pb-24">
        <section className="mx-auto max-w-5xl w-full bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-6 md:p-8">
          <TTSForm
            text={text}
            onTextChange={setText}
            voices={voices}
            selectedVoiceURI={selectedVoiceURI}
            onSelectVoice={setSelectedVoiceURI}
            rate={rate}
            onRateChange={setRate}
            pitch={pitch}
            onPitchChange={setPitch}
          />
          <AudioPanel
            isSpeaking={isSpeaking}
            speak={speak}
            stopSpeaking={stopSpeaking}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            recordingURL={recordingURL}
            setRecordingURL={setRecordingURL}
            textPresent={Boolean(text.trim())}
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}
