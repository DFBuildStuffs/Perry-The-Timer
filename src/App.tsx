import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PerryCharacter, SpecialMovementType } from './components/PerryCharacter';
import { CleanBreakTimer } from './components/CleanBreakTimer';
import { AgentBackgroundGear } from './components/AgentBackgroundGear';
import { chatterAudio } from './audio/chatterAudio';

const TITLE_OPTIONS = [
  { id: 'break', title: 'Break Time', subtitle: 'See you in a bit' },
  { id: 'class', title: 'Class Starting in', subtitle: '' } // Removed for Class Starting in
];

// Class Starting In: Stretch arms, sharpen pencil, meditate (5s), drink water
const CLASS_MOVEMENTS: SpecialMovementType[] = [
  'stretch-arms',
  'sharpen-pencil',
  'meditate',
  'drink-water'
];

// Break Time: Walk left and right, drink water, check the clock, check a notebook
const BREAK_MOVEMENTS: SpecialMovementType[] = [
  'walk-around',
  'drink-water',
  'check-clock',
  'check-notebook'
];

export default function App() {
  const [titleIndex, setTitleIndex] = useState<number>(0);
  const [isChatteringActive, setIsChatteringActive] = useState<boolean>(true);
  const [specialMovement, setSpecialMovement] = useState<SpecialMovementType>('none');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const movementIndexRef = useRef<number>(0);
  const movementTimeoutRef = useRef<number | null>(null);
  const burstTimeoutRef = useRef<number | null>(null);

  const currentTitle = TITLE_OPTIONS[titleIndex];
  const isClassMode = currentTitle.id === 'class';
  const activeMovementList = isClassMode ? CLASS_MOVEMENTS : BREAK_MOVEMENTS;

  const handlePrevTitle = () => {
    setTitleIndex((prev) => (prev === 0 ? TITLE_OPTIONS.length - 1 : prev - 1));
    movementIndexRef.current = 0;
    setSpecialMovement('none');
    chatterAudio.playClick(30);
  };

  const handleNextTitle = () => {
    setTitleIndex((prev) => (prev === TITLE_OPTIONS.length - 1 ? 0 : prev + 1));
    movementIndexRef.current = 0;
    setSpecialMovement('none');
    chatterAudio.playClick(30);
  };

  // Trigger movement from active mode's list
  const triggerMovement = useCallback((movement?: SpecialMovementType) => {
    if (movementTimeoutRef.current) {
      clearTimeout(movementTimeoutRef.current);
      movementTimeoutRef.current = null;
    }

    const currentList = TITLE_OPTIONS[titleIndex].id === 'class' ? CLASS_MOVEMENTS : BREAK_MOVEMENTS;
    const nextMv = movement || currentList[movementIndexRef.current % currentList.length];
    movementIndexRef.current = (movementIndexRef.current + 1) % currentList.length;

    setSpecialMovement(nextMv);

    // Duration: meditate for 5.0 seconds as specified; others 4.8 seconds
    const durationMs = nextMv === 'meditate' ? 5100 : 4800;

    movementTimeoutRef.current = window.setTimeout(() => {
      setSpecialMovement('none');
      movementTimeoutRef.current = null;
    }, durationMs);
  }, [titleIndex]);

  // 2-Minute Interval: Perry changes his movement every 2 minutes (120,000ms)
  useEffect(() => {
    const twoMinuteInterval = window.setInterval(() => {
      triggerMovement();
    }, 120000); // 120,000ms = 2 minutes

    return () => {
      clearInterval(twoMinuteInterval);
      if (movementTimeoutRef.current) {
        clearTimeout(movementTimeoutRef.current);
      }
    };
  }, [triggerMovement]);

  // Iconic rhythmic chatter: bursts of rapid chatter, brief pauses with shifting eyes
  useEffect(() => {
    let isRunning = true;

    const runChatterBurst = () => {
      if (!isRunning) return;
      setIsChatteringActive(true);

      const burstDuration = 1600 + Math.random() * 800; // ~1.6s to 2.4s of rapid chatter
      burstTimeoutRef.current = window.setTimeout(() => {
        if (!isRunning) return;
        setIsChatteringActive(false);

        const pauseDuration = 800 + Math.random() * 800; // ~0.8s to 1.6s quiet pause
        burstTimeoutRef.current = window.setTimeout(() => {
          if (!isRunning) return;
          runChatterBurst();
        }, pauseDuration);
      }, burstDuration);
    };

    runChatterBurst();

    return () => {
      isRunning = false;
      if (burstTimeoutRef.current) {
        clearTimeout(burstTimeoutRef.current);
        burstTimeoutRef.current = null;
      }
    };
  }, []);

  const handleToggleMute = () => {
    const muted = chatterAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      chatterAudio.playClick(20);
    }
  };

  // Clicking on Perry triggers the next special movement immediately (or plays pokey click)
  const handlePokePerry = () => {
    triggerMovement();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none relative">
      {/* Background Floating Agent Gear & Ambient Glow */}
      <AgentBackgroundGear />
      <div className="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-2xl sm:max-w-4xl flex flex-col items-center text-center my-auto px-2">
        {/* Swappable Heading with small < > on the sides */}
        <div className="relative mb-3 sm:mb-6 w-full flex items-center justify-center">
          {/* Small '<' button on left side */}
          <button
            onClick={handlePrevTitle}
            title="Switch text: Break Time / Class Starting in"
            aria-label="Previous text"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-teal-300 border border-slate-700/60 hover:border-teal-500/50 flex items-center justify-center transition-all shadow-md active:scale-90 shrink-0 z-20 group"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          {/* Center Heading & Subtitle */}
          <div className="flex-1 px-2 sm:px-6 flex flex-col items-center">
            <h1
              key={currentTitle.title}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-100 to-amber-300 drop-shadow-[0_6px_24px_rgba(15,165,181,0.45)] leading-none transition-all duration-300"
              style={{
                fontFamily: 'var(--font-display, cursive, sans-serif)',
                letterSpacing: '-0.025em',
                textWrap: 'balance'
              }}
            >
              {currentTitle.title}
            </h1>

            {currentTitle.subtitle ? (
              <h2
                className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-300/95 mt-2 sm:mt-4 tracking-normal drop-shadow-[0_2px_10px_rgba(252,211,77,0.3)] leading-tight"
                style={{
                  fontFamily: 'var(--font-display, cursive, sans-serif)',
                  textWrap: 'balance'
                }}
              >
                {currentTitle.subtitle}
              </h2>
            ) : null}
          </div>

          {/* Small '>' button on right side */}
          <button
            onClick={handleNextTitle}
            title="Switch text: Break Time / Class Starting in"
            aria-label="Next text"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-teal-300 border border-slate-700/60 hover:border-teal-500/50 flex items-center justify-center transition-all shadow-md active:scale-90 shrink-0 z-20 group"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Perry the Platypus with his iconic Fedora Hat */}
        <div className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[370px] my-1 sm:my-2 flex items-center justify-center">
          <PerryCharacter
            isChattering={isChatteringActive}
            chatterSpeed="rapid"
            hasFedora={true}
            specialMovement={specialMovement}
            showSpeechBubble={false}
            onPoke={handlePokePerry}
          />
        </div>

        {/* Timer below the Platypus with + side to change time */}
        <div className="w-full mt-2 sm:mt-4">
          <CleanBreakTimer
            onTimerComplete={handlePokePerry}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
          />
        </div>
      </div>
    </div>
  );
}
