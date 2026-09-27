/**
 * Browser Speech Recognition (STT) and Speech Synthesis (TTS) Helper
 */

// 1. Text to Speech (TTS)
export function speakText(text, onStart, onEnd) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onStart) onStart();
    setTimeout(() => { if (onEnd) onEnd(); }, 2000);
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*_#`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 0.98;
  utterance.pitch = 1.0;

  // Pick high-quality natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Neural') || v.name.includes('Samantha') || v.name.includes('David'))
  ) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis event error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// 2. Speech-to-Text Recognition (STT)
export class SpeechToTextManager {
  constructor(onTranscriptUpdate, onError) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onError = onError;
    this.recognition = null;
    this.isListening = false;
    this.fullTranscript = '';

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalChunk += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (finalChunk) {
          this.fullTranscript += (this.fullTranscript ? ' ' : '') + finalChunk.trim();
        }

        const currentDisplay = (this.fullTranscript + ' ' + interim).trim();
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(currentDisplay, interim);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (this.onError) this.onError(event.error);
      };

      this.recognition.onend = () => {
        // Automatically restart if user hasn't explicitly stopped it
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
          }
        }
      };
    }
  }

  isSupported() {
    return !!this.recognition;
  }

  start(initialText = '') {
    this.fullTranscript = initialText;
    this.isListening = true;
    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Recognition already started or error:', e);
      }
    }
  }

  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    }
    return this.fullTranscript;
  }
}
