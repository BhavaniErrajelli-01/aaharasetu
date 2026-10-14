/**
 * Aahara Setu - Automated Voice Call & Speech Synthesis Engine
 * Simulates Automated Interactive Voice Response (IVR) in English & Telugu
 */

class VoiceCallSimulator {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.audioCtx = null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.activeLanguage = 'en'; // 'en' or 'te'
    this.timerInterval = null;
    this.callSeconds = 0;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Generates dual-language voice scripts for a beneficiary
  generateScripts(beneficiary) {
    const benName = beneficiary.name || 'Beneficiary';
    const benNameTe = beneficiary.nameTe || beneficiary.name || 'లబ్ధిదారుడు';
    const fps = beneficiary.fpsNumber || 'FPS-102';
    const slotName = beneficiary.slotName || 'Slot 1';
    const slotTime = beneficiary.slotTime || '08:00 AM - 10:30 AM';
    const slotDate = beneficiary.slotDate || 'October 12, 2026';
    const card = beneficiary.rationCardNumber || 'WAP07190022001';

    const english = {
      title: "English Automated IVR Notification",
      languageCode: "en-IN",
      callerId: "1800-425-0012 (Aahara Setu PDS Toll-Free)",
      audioDuration: "0:42",
      script: `Hello ${benName}. This is an automated broadcast from the Department of Civil Supplies, Aahara Setu Public Distribution System. Your monthly subsidized ration collection slot has been confirmed at Fair Price Shop ${fps}. Your allotted date is ${slotDate}, during ${slotName} between ${slotTime}. Please visit the shop with your Ration Card ${card} and complete your biometric authentication. To repeat this message, press one. Thank you for using Aahara Setu.`
    };

    const telugu = {
      title: "తెలుగు స్వయంచాలక వాయిస్ కాల్ (Telugu IVR Notification)",
      languageCode: "te-IN",
      callerId: "1800-425-0012 (ఆహార సేతు టోల్ ఫ్రీ)",
      audioDuration: "0:48",
      script: `నమస్కారం ${benNameTe} గారు. ఇది ఆహార భద్రత మరియు ప్రజా పంపిణీ వ్యవస్థ, ఆహార సేతు నుండి స్వయంచాలక వాయిస్ కాల్. మీకు కేటాయించిన ఫెయిర్ ప్రైస్ షాపు ${fps} వద్ద మీ రేషన్ సరుకుల సేకరణ స్లాట్ ${slotDate} తేదీన, ${slotName} లో సమయం ${slotTime} కి నిర్ధారించబడింది. దయచేసి మీ రేషన్ కార్డు నంబర్ ${card} తో వచ్చి బయోమెట్రిక్ పూర్తి చేసి మీ కోటా పొందండి. ఈ సందేశాన్ని మళ్లీ వినడానికి ఒకటి నొక్కండి. ఆహార సేతు సేవలను వినియోగించుకున్నందుకు ధన్యవాదాలు.`
    };

    return { english, telugu };
  }

  // Beep chime sound simulation using Web Audio API
  playTelecomTone(freq = 440, type = 'sine', duration = 0.2) {
    try {
      this.initAudioContext();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio tone playback skipped", e);
    }
  }

  // Play ringing sound
  playRingingTone() {
    this.playTelecomTone(440, 'sine', 0.4);
    setTimeout(() => this.playTelecomTone(480, 'sine', 0.4), 100);
  }

  // Text-to-speech execution
  speak(text, lang = 'en-IN', onStart, onEnd, onError) {
    this.stop();
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported in this browser.');
      return;
    }

    this.playTelecomTone(800, 'triangle', 0.15); // IVR chime

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = lang.startsWith('te') ? 0.9 : 0.95; // Slightly slower for clarity
      utterance.pitch = 1.0;

      // Try selecting an Indian or regional voice if available
      const voices = this.synth.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2))) ||
                            voices.find(v => v.lang.includes('IN')) ||
                            voices[0];
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => {
        this.isPlaying = true;
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.isPlaying = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = (err) => {
        this.isPlaying = false;
        if (onError) onError(err);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    }, 250);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.stopCallTimer();
  }

  startCallTimer(onTick) {
    this.callSeconds = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.callSeconds++;
      const mins = String(Math.floor(this.callSeconds / 60)).padStart(2, '0');
      const secs = String(this.callSeconds % 60).padStart(2, '0');
      if (onTick) onTick(`${mins}:${secs}`);
    }, 1000);
  }

  stopCallTimer() {
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.callSeconds = 0;
  }
}

window.aaharaVoice = new VoiceCallSimulator();
