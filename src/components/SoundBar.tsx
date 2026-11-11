import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Zap, Sparkles } from 'lucide-react';
import { chatterAudio } from '../audio/chatterAudio';

interface SoundBarProps {
  isChattering: boolean;
  chatterSpeed: 'steady' | 'rapid' | 'turbo';
  setChatterSpeed: (speed: 'steady' | 'rapid' | 'turbo') => void;
  onInstantBurst: () => void;
}

export const SoundBar: React.FC<SoundBarProps> = ({
  isChattering,
  chatterSpeed,
  setChatterSpeed,
  onInstantBurst
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.65);
  const [audioPulse, setAudioPulse] = useState(false);

  useEffect(() => {
    if (!isChattering || isMuted) {
      setAudioPulse(false);
      return;
    }

    const intervalMs = chatterSpeed === 'turbo' ? 88 : chatterSpeed === 'rapid' ? 115 : 140;
    const pulseTimer = setInterval(() => {
      setAudioPulse(true);
      setTimeout(() => setAudioPulse(false), intervalMs * 0.45);
    }, intervalMs);

    return () => clearInterval(pulseTimer);
  }, [isChattering, isMuted, chatterSpeed]);

  const handleToggleMute = () => {
    const muted = chatterAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      chatterAudio.playClick(20);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    chatterAudio.setVolume(newVol);
    if (isMuted && newVol > 0) {
      chatterAudio.setMute(false);
      setIsMuted(false);
    }
  };

  return (
    <div className="w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-3.5 sm:p-4 shadow-lg flex flex-col gap-3">
      {/* Top zone: Audio status & sync flash */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-xl transition-all flex items-center gap-1.5 ${
              isMuted
                ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                : 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="text-xs font-semibold">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>

          {/* Sync indicator LED */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-700 text-xs">
            <span
              className={`w-2 h-2 rounded-full transition-transform duration-75 ${
                audioPulse && !isMuted
                  ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(251,191,36,0.9)]'
                  : 'bg-slate-600 scale-100'
              }`}
            />
            <span className="text-[11px] font-mono text-slate-400">Audio Sync</span>
          </div>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label="Sound volume slider"
            className="w-16 sm:w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <span className="text-[11px] font-mono text-slate-400 tabular-nums w-7 text-right">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* Bottom zone: Speed options & Quick Burst trigger */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-700/60">
        <div className="flex items-center gap-1 bg-slate-900/70 p-1 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 px-2 hidden sm:inline">Speed:</span>
          {(['steady', 'rapid', 'turbo'] as const).map((spd) => {
            const isActive = chatterSpeed === spd;
            const labels = {
              steady: 'Relaxed (7Hz)',
              rapid: 'Iconic (9Hz)',
              turbo: 'Turbo (11Hz)'
            };
            return (
              <button
                key={spd}
                onClick={() => setChatterSpeed(spd)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {labels[spd]}
              </button>
            );
          })}
        </div>

        {/* Test Chatter Button */}
        <button
          onClick={onInstantBurst}
          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ml-auto"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Poke Beak</span>
        </button>
      </div>
    </div>
  );
};
