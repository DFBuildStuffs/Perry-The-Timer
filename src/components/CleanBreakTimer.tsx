import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, BellRing } from 'lucide-react';
import { chatterAudio } from '../audio/chatterAudio';

interface CleanBreakTimerProps {
  onTimerComplete?: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const CleanBreakTimer: React.FC<CleanBreakTimerProps> = ({
  onTimerComplete,
  isMuted,
  onToggleMute
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // 5 minutes default
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(true); // Auto-running for seamless break
  const [hasFinished, setHasFinished] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            chatterAudio.playBreakBell();
            if (onTimerComplete) {
              onTimerComplete();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, secondsRemaining, onTimerComplete]);

  // Adjust time functions
  const addMinutes = (min: number) => {
    setSecondsRemaining((prev) => prev + min * 60);
    setTotalSeconds((prev) => Math.max(prev + min * 60, 60));
    setHasFinished(false);
    chatterAudio.playClick(30);
  };

  const subtractMinutes = (min: number) => {
    setSecondsRemaining((prev) => {
      const next = Math.max(60, prev - min * 60);
      return next;
    });
    setTotalSeconds((prev) => Math.max(60, prev - min * 60));
    setHasFinished(false);
    chatterAudio.playClick(-20);
  };

  const toggleRunning = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(totalSeconds > 0 ? totalSeconds : 300);
      setHasFinished(false);
    }
    setIsRunning(!isRunning);
    chatterAudio.playClick(10);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds > 0 ? totalSeconds : 300);
    setHasFinished(false);
    chatterAudio.playClick(0);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Increased Size Digital Clock Display */}
      <div className="relative w-full bg-slate-950/95 border-2 border-slate-800/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[inset_0_2px_14px_rgba(0,0,0,0.85),0_10px_28px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
        {/* Subtle horizontal CRT/LED scanline raster */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px]"
          aria-hidden="true"
        />

        {/* Faint LED "88:88" ghost segments for authentic digital clock design */}
        <span
          className="absolute font-mono text-6xl sm:text-7xl md:text-8xl font-black tracking-widest text-slate-800/25 select-none pointer-events-none tabular-nums"
          aria-hidden="true"
        >
          88:88
        </span>

        {/* Active Digital Clock Time */}
        <span
          className={`relative z-10 font-mono text-6xl sm:text-7xl md:text-8xl font-black tracking-widest tabular-nums select-none ${
            hasFinished
              ? 'text-amber-400 drop-shadow-[0_0_22px_rgba(251,191,36,0.85)] animate-pulse'
              : isRunning
              ? 'text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]'
              : 'text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.3)]'
          }`}
          style={{ letterSpacing: '0.08em' }}
        >
          {formattedTime}
        </span>
      </div>

      {/* Control Row: Buttons with text REMOVED, +1 and +5 on the side of Pause Button */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 w-full">
        {/* Decrement (-1) Button */}
        <button
          onClick={() => subtractMinutes(1)}
          disabled={secondsRemaining <= 60}
          title="Subtract 1 minute"
          aria-label="Subtract 1 minute"
          className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-700/80 active:scale-95 shrink-0 shadow-md font-mono font-bold text-xs sm:text-sm"
        >
          -1
        </button>

        {/* Play/Pause Button - Text Removed (Icon Only) */}
        <button
          onClick={toggleRunning}
          title={isRunning ? 'Pause' : hasFinished ? 'Restart' : 'Resume'}
          aria-label={isRunning ? 'Pause' : 'Play'}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 shrink-0 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
              : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-teal-500/25'
          }`}
        >
          {isRunning ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current stroke-[2.5]" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5 stroke-[2.5]" />
          )}
        </button>

        {/* +1 on the side of Pause button */}
        <button
          onClick={() => addMinutes(1)}
          title="Add 1 minute"
          aria-label="Add 1 minute"
          className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 hover:text-teal-200 border border-teal-500/40 flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md"
        >
          +1
        </button>

        {/* +5 on the side of Pause button */}
        <button
          onClick={() => addMinutes(5)}
          title="Add 5 minutes"
          aria-label="Add 5 minutes"
          className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-md"
        >
          +5
        </button>

        {/* Reset Button - Icon Only */}
        <button
          onClick={resetTimer}
          title="Reset timer"
          aria-label="Reset timer"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/80 active:scale-95 flex items-center justify-center shrink-0 shadow-md"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Sound Toggle Button - Icon Only */}
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute chatter sound' : 'Mute chatter sound'}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl transition-all border active:scale-95 flex items-center justify-center shrink-0 shadow-md ${
            isMuted
              ? 'bg-slate-900/90 text-slate-500 border-slate-700'
              : 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>

      {hasFinished && (
        <div className="mt-3 flex items-center gap-2 text-amber-300 text-xs font-semibold animate-bounce">
          <BellRing className="w-4 h-4 text-amber-400" />
          <span>Timer finished! Time to roll!</span>
        </div>
      )}
    </div>
  );
};
