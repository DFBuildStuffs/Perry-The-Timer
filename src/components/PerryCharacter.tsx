import React, { useEffect, useState, useRef, useId } from 'react';
import { chatterAudio } from '../audio/chatterAudio';

export type SpecialMovementType =
  | 'none'
  | 'hat-tip'
  | 'look-around'
  | 'tail-thump'
  | 'watch-check'
  | 'stealth-crouch'
  // Class Starting in mode:
  | 'stretch-arms'
  | 'sharpen-pencil'
  | 'meditate'
  | 'drink-water'
  // Break Time mode:
  | 'walk-around'
  | 'check-clock'
  | 'check-notebook';

export interface PerryCharacterProps {
  isChattering: boolean;
  chatterSpeed: 'steady' | 'rapid' | 'turbo';
  hasFedora: boolean;
  specialMovement?: SpecialMovementType;
  eyeMode?: 'auto' | 'center' | 'left' | 'right' | 'squint';
  onPoke?: () => void;
  showSpeechBubble?: boolean;
  speechText?: string;
}

export const PerryCharacter: React.FC<PerryCharacterProps> = ({
  isChattering,
  chatterSpeed,
  hasFedora,
  specialMovement = 'none',
  eyeMode = 'auto',
  onPoke,
  showSpeechBubble = false,
  speechText = 'k-k-k-k-k-kr-r-r!'
}) => {
  const isSpecialActive = specialMovement !== 'none';
  const [internalEyeState, setInternalEyeState] = useState<'center' | 'left' | 'right' | 'squint'>('center');
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPoked, setIsPoked] = useState(false);
  const audioIntervalRef = useRef<number | null>(null);
  const maskId = useId();

  // Eye shift cycle: creates the iconic periodic eye shifting
  useEffect(() => {
    if (eyeMode !== 'auto') {
      setInternalEyeState(eyeMode);
      return;
    }

    const eyePositions: Array<'center' | 'left' | 'right' | 'squint'> = [
      'center',
      'center',
      'left',
      'center',
      'right',
      'left',
      'center'
    ];
    let currentIndex = 0;

    const eyeTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % eyePositions.length;
      setInternalEyeState(eyePositions[currentIndex]);
    }, 2800);

    return () => clearInterval(eyeTimer);
  }, [eyeMode]);

  // Truly random, organic eye-blink animation occurring independently of chatter and movement cycles
  useEffect(() => {
    let isMounted = true;
    let blinkTimeout: number | null = null;
    let sequenceTimeout: number | null = null;

    const scheduleNextBlink = () => {
      if (!isMounted) return;

      // Random interval between 1.8s and 4.8s for lively, natural blinking
      const nextDelay = 1800 + Math.random() * 3000;

      blinkTimeout = window.setTimeout(() => {
        if (!isMounted) return;

        // ~28% probability of an authentic cartoon double-blink
        const isDoubleBlink = Math.random() < 0.28;

        setIsBlinking(true);

        if (isDoubleBlink) {
          // First quick blink shut (100ms) -> Flutter open (80ms) -> Second quick blink (90ms) -> Reopen
          sequenceTimeout = window.setTimeout(() => {
            if (!isMounted) return;
            setIsBlinking(false);

            sequenceTimeout = window.setTimeout(() => {
              if (!isMounted) return;
              setIsBlinking(true);

              sequenceTimeout = window.setTimeout(() => {
                if (!isMounted) return;
                setIsBlinking(false);
                scheduleNextBlink();
              }, 90);
            }, 80);
          }, 100);
        } else {
          // Standard single organic blink (110-135ms)
          const blinkDuration = 110 + Math.random() * 25;
          sequenceTimeout = window.setTimeout(() => {
            if (!isMounted) return;
            setIsBlinking(false);
            scheduleNextBlink();
          }, blinkDuration);
        }
      }, nextDelay);
    };

    scheduleNextBlink();

    return () => {
      isMounted = false;
      if (blinkTimeout) clearTimeout(blinkTimeout);
      if (sequenceTimeout) clearTimeout(sequenceTimeout);
    };
  }, []);

  // Audio synchronization with Beak Movement
  useEffect(() => {
    // If a special movement is active or chattering is paused, stop regular chatter clicking
    if (!isChattering || isSpecialActive) {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }
      return;
    }

    const intervalMs = chatterSpeed === 'turbo' ? 88 : chatterSpeed === 'rapid' ? 115 : 140;
    chatterAudio.playClick();

    audioIntervalRef.current = window.setInterval(() => {
      chatterAudio.playClick();
    }, intervalMs);

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }
    };
  }, [isChattering, chatterSpeed, isSpecialActive]);

  // Sound effects for special movements
  useEffect(() => {
    if (specialMovement === 'tail-thump') {
      chatterAudio.playTailThump();
      const t1 = setTimeout(() => chatterAudio.playTailThump(), 450);
      const t2 = setTimeout(() => chatterAudio.playTailThump(), 900);
      const t3 = setTimeout(() => chatterAudio.playTailThump(), 1350);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (specialMovement === 'stretch-arms') {
      chatterAudio.playClick(60);
    } else if (specialMovement === 'sharpen-pencil') {
      chatterAudio.playPencilSharpen();
    } else if (specialMovement === 'meditate') {
      chatterAudio.playMeditateChime();
    } else if (specialMovement === 'drink-water') {
      chatterAudio.playWaterGulp();
    } else if (specialMovement === 'walk-around') {
      chatterAudio.playClick(25);
      const t1 = setTimeout(() => chatterAudio.playClick(15), 500);
      const t2 = setTimeout(() => chatterAudio.playClick(25), 1000);
      const t3 = setTimeout(() => chatterAudio.playClick(15), 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (specialMovement === 'check-clock') {
      chatterAudio.playWatchBeep();
    } else if (specialMovement === 'check-notebook') {
      chatterAudio.playSteamWhoosh();
    } else if (specialMovement === 'hat-tip') {
      chatterAudio.playHatTipSound();
    } else if (specialMovement === 'watch-check') {
      chatterAudio.playSteamWhoosh();
      const t = setTimeout(() => chatterAudio.playWatchBeep(), 800);
      return () => clearTimeout(t);
    } else if (specialMovement === 'stealth-crouch') {
      chatterAudio.playSteamWhoosh();
    }
  }, [specialMovement]);

  const handleCharacterClick = () => {
    setIsPoked(true);
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 120);
    chatterAudio.playClick(40);
    setTimeout(() => {
      chatterAudio.playClick(80);
    }, 90);
    setTimeout(() => {
      chatterAudio.playClick(60);
      setIsPoked(false);
    }, 220);

    if (onPoke) {
      onPoke();
    }
  };

  const isEyeClosed = isBlinking || specialMovement === 'meditate';

  // Determine pupil offsets based on eye state or active movement
  const getPupilTransform = (eye: 'left' | 'right') => {
    if (specialMovement === 'meditate') {
      return 'translate(0, 0) scale(1, 0.1)';
    }
    if (specialMovement === 'check-clock') {
      return 'translate(0, -6)';
    }
    if (specialMovement === 'drink-water') {
      return 'translate(1, -3)';
    }
    if (specialMovement === 'check-notebook') {
      return 'translate(0, 3)';
    }
    if (specialMovement === 'look-around') {
      return 'translate(0, 0)';
    }
    if (specialMovement === 'watch-check') {
      return 'translate(0, 3.5)';
    }
    if (specialMovement === 'stealth-crouch') {
      return 'translate(0, 2) scale(0.9, 0.55)';
    }
    if (hasFedora && internalEyeState === 'squint') {
      return 'translate(0, 1)';
    }
    switch (internalEyeState) {
      case 'left':
        return 'translate(-4.5, 0)';
      case 'right':
        return 'translate(4.5, -0.5)';
      case 'squint':
        return 'translate(0, 1.5) scale(0.9, 0.6)';
      case 'center':
      default:
        return eye === 'left' ? 'translate(0.5, 0)' : 'translate(-0.5, 0)';
    }
  };

  // Beak CSS animation class (paused during special movements)
  const isChatteringEffective = isChattering && !isSpecialActive;
  const beakAnimationClass = isChatteringEffective
    ? chatterSpeed === 'steady'
      ? 'animate-beak-steady'
      : 'animate-beak-rapid'
    : '';

  // Body and head animation classes
  const bodyAnimationClass =
    specialMovement === 'stretch-arms'
      ? 'animate-body-stretch'
      : specialMovement === 'meditate'
      ? 'animate-zen-breathe'
      : specialMovement === 'walk-around'
      ? 'animate-walk-around'
      : specialMovement === 'stealth-crouch'
      ? 'animate-stealth-crouch'
      : specialMovement === 'tail-thump'
      ? 'animate-body-thump'
      : 'animate-body-breathe';

  const headAnimationClass =
    specialMovement === 'drink-water'
      ? 'animate-drink-head'
      : specialMovement === 'check-clock'
      ? 'animate-clock-head'
      : specialMovement === 'look-around'
      ? 'animate-double-take'
      : specialMovement === 'watch-check'
      ? 'animate-head-watch'
      : isChatteringEffective
      ? 'animate-head-vibe'
      : '';

  const tailAnimationClass =
    specialMovement === 'tail-thump'
      ? 'animate-tail-thump'
      : isChatteringEffective
      ? 'animate-tail-active'
      : 'animate-tail-idle';

  const leftArmAnimationClass =
    specialMovement === 'stretch-arms'
      ? 'animate-arm-stretch-l'
      : specialMovement === 'watch-check'
      ? 'animate-arm-watch'
      : '';

  const rightArmAnimationClass =
    specialMovement === 'stretch-arms'
      ? 'animate-arm-stretch-r'
      : specialMovement === 'drink-water'
      ? 'animate-drink-arm'
      : specialMovement === 'check-clock'
      ? 'animate-clock-arm'
      : specialMovement === 'hat-tip'
      ? 'animate-arm-hat-tip'
      : '';

  const fedoraAnimationClass = specialMovement === 'hat-tip' ? 'animate-fedora-tip' : '';

  return (
    <div
      className="relative flex items-center justify-center select-none cursor-pointer group"
      onClick={handleCharacterClick}
      role="button"
      tabIndex={0}
      aria-label="Perry the Platypus character. Click to interact and hear chatter."
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCharacterClick();
        }
      }}
    >
      {/* Speech / Sound Bubble */}
      {showSpeechBubble && (
        <div
          className={`absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 pointer-events-none transform ${
            isChattering ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <div className="bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-2xl shadow-lg border-2 border-amber-600 text-xs sm:text-sm tracking-wide whitespace-nowrap animate-bounce flex items-center gap-1.5">
            <span className="text-amber-900 font-mono text-xs">💬</span>
            <span>{speechText}</span>
          </div>
          <div className="w-3 h-3 bg-amber-400 border-r-2 border-b-2 border-amber-600 rotate-45 mx-auto -mt-1.5" />
        </div>
      )}

      {/* Main SVG Character Container */}
      <svg
        viewBox="0 0 460 480"
        className={`w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] h-auto drop-shadow-2xl transition-transform duration-200 ${
          isPoked ? 'scale-95 translate-y-1' : 'hover:scale-[1.02]'
        }`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Gradients for vibrant cartoon shading */}
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0b7e88" />
            <stop offset="25%" stopColor="#119ca7" />
            <stop offset="70%" stopColor="#15aab7" />
            <stop offset="100%" stopColor="#0d848f" />
          </linearGradient>

          <linearGradient id="tummyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22bcc9" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#119ca7" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aa5e2a" />
            <stop offset="50%" stopColor="#8d491c" />
            <stop offset="100%" stopColor="#6e3510" />
          </linearGradient>

          <linearGradient id="beakTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fcae26" />
            <stop offset="45%" stopColor="#f39c12" />
            <stop offset="100%" stopColor="#d37703" />
          </linearGradient>

          <linearGradient id="beakBottomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1950d" />
            <stop offset="100%" stopColor="#bd5b02" />
          </linearGradient>

          <linearGradient id="feetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5a623" />
            <stop offset="100%" stopColor="#cf6d03" />
          </linearGradient>

          <linearGradient id="fedoraCrownGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5a3818" />
            <stop offset="30%" stopColor="#754b23" />
            <stop offset="70%" stopColor="#875628" />
            <stop offset="100%" stopColor="#563516" />
          </linearGradient>

          {/* Tail waffle texture pattern */}
          <pattern id="tailGrid" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="16" stroke="#502409" strokeWidth="2.2" strokeOpacity="0.75" />
            <line x1="0" y1="0" x2="16" y2="0" stroke="#502409" strokeWidth="2.2" strokeOpacity="0.75" />
          </pattern>

          {/* Clip path for eye eyelids blinking */}
          <clipPath id={`${maskId}-leftEye`}>
            <ellipse cx="178" cy="182" rx="22" ry="26" />
          </clipPath>
          <clipPath id={`${maskId}-rightEye`}>
            <ellipse cx="236" cy="182" rx="22" ry="26" />
          </clipPath>

          {/* Filter for subtle cartoon drop shadow */}
          <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
          </filter>

          {/* Steam & Mist Gradients and Filters for Secret Agent Theme */}
          <radialGradient id="steamGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0f7fa" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#b2ebf2" stopOpacity="0.45" />
            <stop offset="80%" stopColor="#80deea" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#80deea" stopOpacity="0" />
          </radialGradient>
          <filter id="steamFilter" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
        </defs>

        {/* ================= GROUND SHADOW ================= */}
        <ellipse cx="230" cy="452" rx="145" ry="16" fill="#091422" fillOpacity="0.6" />

        {/* ================= BEAVER TAIL (Back layer) ================= */}
        <g className={`transition-transform duration-300 ${tailAnimationClass}`}>
          {/* Tail Base and Paddle Shape */}
          <path
            d="M 285 345 C 330 340, 395 330, 425 315 C 448 303, 452 278, 432 268 C 400 252, 335 285, 290 310 Z"
            fill="url(#tailGrad)"
            stroke="#4a2007"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          {/* Tail Waffle / Crosshatch Pattern Overlay */}
          <path
            d="M 288 343 C 330 338, 393 328, 423 313 C 445 301, 448 280, 430 270 C 400 255, 337 286, 292 312 Z"
            fill="url(#tailGrid)"
          />
          {/* Tail Depth Shadow Line */}
          <path
            d="M 290 312 C 340 286, 400 258, 428 272"
            fill="none"
            stroke="#3a1804"
            strokeWidth="3.5"
            strokeOpacity="0.6"
          />
        </g>

        {/* ================= BACK / LEFT WEBBED FOOT ================= */}
        <g id="backFoot">
          <path
            d="M 135 422 C 120 422, 95 432, 90 444 C 88 449, 93 454, 100 454 C 112 454, 120 445, 128 454 C 136 462, 148 456, 154 448 C 160 440, 168 436, 175 436 C 182 436, 172 422, 148 422 Z"
            fill="url(#feetGrad)"
            stroke="#964803"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Toe webbing lines */}
          <path d="M 108 446 C 118 438, 134 434, 145 432" stroke="#8d4201" strokeWidth="2.5" fill="none" />
          <path d="M 135 450 C 142 442, 152 436, 160 435" stroke="#8d4201" strokeWidth="2.5" fill="none" />
        </g>

        {/* ================= FRONT / RIGHT WEBBED FOOT ================= */}
        <g id="frontFoot">
          <path
            d="M 245 424 C 235 424, 215 432, 210 445 C 208 450, 214 455, 222 455 C 234 455, 242 446, 250 455 C 258 463, 272 458, 278 449 C 285 440, 296 437, 305 437 C 314 437, 295 424, 260 424 Z"
            fill="url(#feetGrad)"
            stroke="#964803"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Toe webbing lines */}
          <path d="M 228 447 C 238 439, 252 435, 266 433" stroke="#8d4201" strokeWidth="2.5" fill="none" />
          <path d="M 256 450 C 264 443, 274 437, 284 436" stroke="#8d4201" strokeWidth="2.5" fill="none" />
        </g>

        {/* ================= ENTIRE BODY & HEAD GROUP ================= */}
        <g className={bodyAnimationClass}>
          {/* Three Spiky Hairs on Head */}
          <g id="headHairs">
            <path
              d="M 198 128 C 196 108, 190 92, 185 86 C 188 95, 193 112, 196 128 Z"
              fill="#06484e"
            />
            <path
              d="M 207 127 C 207 102, 205 84, 202 76 C 206 86, 209 106, 210 127 Z"
              fill="#06484e"
            />
            <path
              d="M 216 127 C 218 107, 222 93, 226 84 C 224 96, 221 112, 219 127 Z"
              fill="#06484e"
            />
          </g>

          {/* Main Rectangular Teal Body with Rounded Contours */}
          <rect
            x="130"
            y="125"
            width="168"
            height="305"
            rx="52"
            ry="48"
            fill="url(#bodyGrad)"
            stroke="#074e54"
            strokeWidth="5"
          />

          {/* Tummy soft highlight */}
          <rect
            x="148"
            y="145"
            width="132"
            height="260"
            rx="40"
            ry="40"
            fill="url(#tummyGrad)"
          />

          {/* Left / Back Arm (raises to check watch during watch-check) */}
          <path
            d="M 132 290 C 112 300, 102 332, 114 350 C 122 362, 134 356, 136 342 C 138 326, 134 306, 132 290 Z"
            fill="#0f939e"
            stroke="#074e54"
            strokeWidth="4"
            className={leftArmAnimationClass}
          />

          {/* Right / Front Arm (reaches up to tip fedora during hat-tip) */}
          <path
            d="M 296 290 C 316 300, 326 332, 314 350 C 306 362, 294 356, 292 342 C 290 326, 294 306, 296 290 Z"
            fill="#0f939e"
            stroke="#074e54"
            strokeWidth="4"
            className={rightArmAnimationClass}
          />

          {/* ================= HEAD & FACIAL FEATURES (with vibration / movements) ================= */}
          <g className={headAnimationClass}>
            {/* Left Eye White */}
            <ellipse
              cx="178"
              cy="182"
              rx="22"
              ry="26"
              fill="#ffffff"
              stroke="#074e54"
              strokeWidth="4"
            />

            {/* Right Eye White */}
            <ellipse
              cx="236"
              cy="182"
              rx="22"
              ry="26"
              fill="#ffffff"
              stroke="#074e54"
              strokeWidth="4"
            />

            {/* Left Pupil + Specular Highlight */}
            <g clipPath={`url(#${maskId}-leftEye)`}>
              <g
                style={{
                  transform: getPupilTransform('left'),
                  transition: 'transform 0.28s cubic-bezier(0.2, 0.8, 0.4, 1)'
                }}
              >
                <circle cx="178" cy="182" r="7.5" fill="#111827" />
                <circle cx="180.5" cy="179" r="2.4" fill="#ffffff" />
              </g>
              {/* Eyelid for Independent Random Blinking / Squint */}
              <g
                style={{
                  transform: isEyeClosed
                    ? 'translateY(0px)'
                    : hasFedora && internalEyeState === 'squint'
                    ? 'translateY(-38px)'
                    : 'translateY(-62px)',
                  transition: 'transform 95ms cubic-bezier(0.2, 0.9, 0.3, 1.15)'
                }}
              >
                <rect
                  x="148"
                  y="115"
                  width="60"
                  height="95"
                  fill="#119ca7"
                  stroke="#074e54"
                  strokeWidth="3.5"
                />
                <path
                  d="M 152 204 Q 178 208 204 204"
                  stroke="#074e54"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            </g>

            {/* Right Pupil + Specular Highlight */}
            <g clipPath={`url(#${maskId}-rightEye)`}>
              <g
                style={{
                  transform: getPupilTransform('right'),
                  transition: 'transform 0.28s cubic-bezier(0.2, 0.8, 0.4, 1)'
                }}
              >
                <circle cx="236" cy="182" r="7.5" fill="#111827" />
                <circle cx="238.5" cy="179" r="2.4" fill="#ffffff" />
              </g>
              {/* Eyelid for Independent Random Blinking / Squint */}
              <g
                style={{
                  transform: isEyeClosed
                    ? 'translateY(0px)'
                    : hasFedora && internalEyeState === 'squint'
                    ? 'translateY(-38px)'
                    : 'translateY(-62px)',
                  transition: 'transform 95ms cubic-bezier(0.2, 0.9, 0.3, 1.15)'
                }}
              >
                <rect
                  x="206"
                  y="115"
                  width="60"
                  height="95"
                  fill="#119ca7"
                  stroke="#074e54"
                  strokeWidth="3.5"
                />
                <path
                  d="M 210 204 Q 236 208 262 204"
                  stroke="#074e54"
                  strokeWidth="2"
                  fill="none"
                />
              </g>
            </g>

            {/* Eyebrow / Agent Focus Squint overlays */}
            {hasFedora && (
              <g className="transition-opacity duration-300">
                <path
                  d="M 158 160 Q 180 166 198 168"
                  stroke="#06484e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 218 168 Q 236 166 256 160"
                  stroke="#06484e"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            )}

            {/* ================= BEAK ASSEMBLY (The iconic chatter!) ================= */}

            {/* INNER MOUTH CAVITY (Exposed when lower jaw drops) */}
            <g id="mouthCavity">
              <path
                d="M 132 238 Q 200 248 274 238 Q 268 266 206 270 Q 142 266 132 238 Z"
                fill="#611218"
                stroke="#3f0a0d"
                strokeWidth="2"
              />
              {/* Tongue */}
              <path
                d="M 172 262 Q 206 250 238 262 Q 206 272 172 262 Z"
                fill="#df4f64"
              />
            </g>

            {/* LOWER BILL / JAW (Rhythmic Rapid Flap / Chatter Animation) */}
            <g
              id="lowerBeak"
              className={beakAnimationClass}
              style={{
                transformOrigin: '206px 240px',
                transition: isChattering ? 'none' : 'transform 0.15s ease-out'
              }}
            >
              <path
                d="M 125 236 C 115 258, 142 278, 206 282 C 270 278, 298 258, 288 236 C 280 252, 246 264, 206 264 C 166 264, 134 252, 125 236 Z"
                fill="url(#beakBottomGrad)"
                stroke="#9c4701"
                strokeWidth="4.5"
                strokeLinejoin="round"
              />
              {/* Lower bill lip highlight */}
              <path
                d="M 148 262 Q 206 272 262 262"
                stroke="#faaf3c"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* UPPER BILL (Wide duck-bill with signature Perry nostril holes) */}
            <g id="upperBeak">
              {/* Main upper bill shape */}
              <path
                d="M 118 222 C 105 240, 130 254, 206 256 C 282 254, 308 240, 294 222 C 285 208, 248 214, 206 216 C 164 214, 128 208, 118 222 Z"
                fill="url(#beakTopGrad)"
                stroke="#9c4701"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              {/* Upper bill ridge highlight */}
              <path
                d="M 134 226 C 162 234, 250 234, 278 226"
                stroke="#ffcb6b"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Nostril Holes */}
              <ellipse cx="188" cy="226" rx="2.4" ry="3.2" fill="#7a3400" />
              <ellipse cx="224" cy="226" rx="2.4" ry="3.2" fill="#7a3400" />
              {/* Beak base center seam */}
              <path
                d="M 206 216 L 206 226"
                stroke="#ad5202"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* ================= ICONIC FEDORA HAT (Agent P Mode) ================= */}
          {hasFedora && (
            <g
              id="fedoraHat"
              className={`transition-all duration-300 ease-out ${fedoraAnimationClass}`}
              style={{
                animation: fedoraAnimationClass ? undefined : 'float-gentle 6s infinite ease-in-out'
              }}
            >
              {/* Hat Brim */}
              <path
                d="M 104 140 C 130 148, 290 148, 318 140 C 330 137, 334 130, 312 126 C 265 118, 155 118, 110 126 C 90 130, 94 137, 104 140 Z"
                fill="#533113"
                stroke="#2a1606"
                strokeWidth="4"
              />
              {/* Hat Crown Base */}
              <path
                d="M 142 130 L 150 78 C 152 70, 164 64, 185 68 C 196 70, 218 70, 230 68 C 250 64, 262 70, 264 78 L 272 130 Z"
                fill="url(#fedoraCrownGrad)"
                stroke="#2a1606"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              {/* Fedora Indentation / Crease at Top */}
              <path
                d="M 166 70 C 185 80, 226 80, 246 70"
                stroke="#371d07"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Black Ribbon Hat Band */}
              <path
                d="M 144 116 L 142 130 C 172 136, 242 136, 272 130 L 270 116 C 242 122, 172 122, 144 116 Z"
                fill="#18181b"
                stroke="#09090b"
                strokeWidth="2.5"
              />
              {/* Hat band sheen highlight */}
              <path
                d="M 170 120 C 192 124, 224 124, 246 120"
                stroke="#3f3f46"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}
        </g>

        {/* ================= SPECIAL MOVEMENT VISUAL PROPS ================= */}
        {/* 1. Meditate: Glowing Zen Aura Rings */}
        {specialMovement === 'meditate' && (
          <g id="zenAura" className="pointer-events-none">
            <circle cx="214" cy="270" r="160" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeDasharray="8 6" className="animate-zen-aura" />
            <circle cx="214" cy="270" r="130" fill="#2dd4bf" fillOpacity="0.08" className="animate-zen-aura" />
          </g>
        )}

        {/* 2. Drink Water: Glass Cup */}
        {specialMovement === 'drink-water' && (
          <g id="drinkWaterCup" className="animate-drink-arm pointer-events-none">
            <rect x="250" y="215" width="24" height="32" rx="4" fill="#e0f2fe" fillOpacity="0.55" stroke="#38bdf8" strokeWidth="2.5" />
            <rect x="252" y="226" width="20" height="19" rx="2" fill="#0284c7" fillOpacity="0.85" />
            <line x1="254" y1="218" x2="254" y2="242" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}

        {/* 3. Sharpen Pencil */}
        {specialMovement === 'sharpen-pencil' && (
          <g id="sharpenPencilProps" className="animate-sharpen-twirl pointer-events-none">
            {/* Yellow No. 2 Pencil */}
            <rect x="180" y="278" width="46" height="8" rx="2" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" transform="rotate(-30 180 278)" />
            <rect x="174" y="278" width="8" height="8" rx="1.5" fill="#f43f5e" transform="rotate(-30 180 278)" />
            <polygon points="224,272 238,265 224,265" fill="#fde68a" />
            <polygon points="234,267 238,265 234,265" fill="#1e293b" />
            {/* Mini Sharpener */}
            <rect x="226" y="254" width="18" height="22" rx="3" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
          </g>
        )}

        {/* 4. Check Notebook */}
        {specialMovement === 'check-notebook' && (
          <g id="checkNotebookProps" className="animate-notebook-arm pointer-events-none">
            {/* Notebook Cover */}
            <rect x="172" y="265" width="84" height="56" rx="4" fill="#0f766e" stroke="#042f2e" strokeWidth="2.5" />
            {/* Notebook Pages */}
            <rect x="176" y="269" width="76" height="48" rx="2" fill="#f8fafc" className="animate-notebook-page" />
            <line x1="182" y1="279" x2="244" y2="279" stroke="#0d9488" strokeWidth="1.5" />
            <line x1="182" y1="287" x2="240" y2="287" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="182" y1="295" x2="236" y2="295" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="182" y1="303" x2="228" y2="303" stroke="#94a3b8" strokeWidth="1.2" />
            <text x="214" y="277" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#0f766e" fontFamily="sans-serif">ENGR REVIEW</text>
          </g>
        )}

        {/* ================= SECRET AGENT STEAM PARTICLES ================= */}
        {specialMovement === 'stealth-crouch' && (
          <g id="stealthSteamParticles" filter="url(#steamFilter)" className="pointer-events-none">
            {/* Left ninja ground mist puffs */}
            <circle cx="110" cy="438" r="18" fill="url(#steamGrad)" className="animate-steam-1" />
            <circle cx="88" cy="434" r="14" fill="url(#steamGrad)" className="animate-steam-2" />
            <ellipse cx="140" cy="444" rx="22" ry="14" fill="url(#steamGrad)" className="animate-steam-3" />

            {/* Right ninja ground mist puffs */}
            <circle cx="310" cy="436" r="17" fill="url(#steamGrad)" className="animate-steam-2" />
            <circle cx="334" cy="440" r="14" fill="url(#steamGrad)" className="animate-steam-1" />
            <ellipse cx="278" cy="444" rx="21" ry="13" fill="url(#steamGrad)" className="animate-steam-3" />

            {/* Ground perimeter wisps */}
            <ellipse cx="168" cy="448" rx="24" ry="10" fill="url(#steamGrad)" className="animate-steam-1" />
            <ellipse cx="242" cy="448" rx="24" ry="10" fill="url(#steamGrad)" className="animate-steam-2" />
          </g>
        )}

        {specialMovement === 'watch-check' && (
          <g id="watchSteamParticles" filter="url(#steamFilter)" className="pointer-events-none">
            {/* High-tech communicator cooling vapor venting from Perry's wrist gadget */}
            <circle cx="178" cy="208" r="9" fill="url(#steamGrad)" className="animate-steam-fast-1" />
            <circle cx="186" cy="198" r="13" fill="url(#steamGrad)" className="animate-steam-fast-2" />
            <circle cx="172" cy="214" r="8" fill="url(#steamGrad)" className="animate-steam-3" />
            <ellipse cx="182" cy="192" rx="14" ry="8" fill="url(#steamGrad)" className="animate-steam-1" />
          </g>
        )}
      </svg>
    </div>
  );
};
