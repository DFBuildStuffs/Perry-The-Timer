import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, BellRing } from 'lucide-react';
import { chatterAudio } from '../audio/chatterAudio';

interface BreakTimerProps {
  onTimerComplete?: () => void;
  isStreamMode?: boolean;
}

export const BreakTimer: React.FC<BreakTimerProps> = ({ onTimerComplete, isStreamMode = false }) => {
  const [totalSeconds, setTotalSeconds] = useState(300); // Default 5 minutes
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
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

  const selectPreset = (minutes: number) => {
    const sec = minutes * 60;
    setTotalSeconds(sec);
    setSecondsRemaining(sec);
    setIsRunning(false);
    setHasFinished(false);
  };

  const toggleRunning = () => {
    if (secondsRemaining === 0) {
      setSecondsRemaining(totalSeconds);
      setHasFinished(false);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
    setHasFinished(false);
  };

  const addExtraMinutes = (min: number) => {
    setSecondsRemaining((prev) => prev + min * 60);
    setTotalSeconds((prev) => prev + min * 60);
    setHasFinished(false);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressFraction = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const strokeDashoffset = 283 - 283 * (1 - progressFraction);

  return (
    <div
      className={`bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between transition-all duration-300 ${
        isStreamMode ? 'scale-110 shadow-2xl' : 'shadow-lg'
      }`}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
        <span className="uppercase tracking-wider">Break Timer</span>
        <span className="font-mono tabular-nums text-teal-400">
          {isRunning ? 'Running' : hasFinished ? 'Break Over!' : 'Paused'}
        </span>
      </div>

      {/* Progress Ring and Digital Time */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center my-2">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-slate-700/60"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Animated active progress */}
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`transition-all duration-500 ease-linear ${
              hasFinished ? 'stroke-amber-400' : 'stroke-teal-400'
            }`}
            strokeWidth="7"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center digital clock */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span
            className={`font-mono text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums ${
              hasFinished
                ? 'text-amber-400 animate-pulse'
                : isRunning
                ? 'text-white'
                : 'text-slate-300'
            }`}
          >
            {formattedTime}
          </span>
          <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            {hasFinished ? 'Time to return!' : isRunning ? 'Remaining' : 'Preset'}
          </span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-4 gap-1.5 w-full my-3">
        {[5, 10, 15, 25].map((mins) => {
          const isActive = totalSeconds === mins * 60;
          return (
            <button
              key={mins}
              onClick={() => selectPreset(mins)}
              className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all ${
                isActive
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {mins}m
            </button>
          );
        })}
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-2 w-full mt-1">
        <button
          onClick={toggleRunning}
          className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
              : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Break</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{hasFinished ? 'Restart Break' : 'Start Break'}</span>
            </>
          )}
        </button>

        <button
          onClick={() => addExtraMinutes(1)}
          title="Add 1 minute"
          className="p-2.5 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={resetTimer}
          title="Reset timer"
          className="p-2.5 rounded-xl bg-slate-700/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {hasFinished && (
        <div className="w-full mt-3 p-2 bg-amber-500/15 border border-amber-500/30 rounded-lg flex items-center gap-2 text-amber-300 text-xs">
          <BellRing className="w-4 h-4 shrink-0 animate-bounce" />
          <span>Break finished! Hope you feel refreshed.</span>
        </div>
      )}
    </div>
  );
};
