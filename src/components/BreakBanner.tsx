import React from 'react';
import { Sparkles, Coffee } from 'lucide-react';

interface BreakBannerProps {
  customSubtitle?: string;
  isAgentMode?: boolean;
}

export const BreakBanner: React.FC<BreakBannerProps> = ({
  customSubtitle,
  isAgentMode = false
}) => {
  return (
    <div className="flex flex-col items-center text-center px-4 relative z-10">
      {/* Top Quiet Metadata Pill-Free Indicator */}
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-teal-400 mb-2 uppercase">
        <Coffee className="w-3.5 h-3.5 text-teal-400" />
        <span>Study & Work Intermission</span>
        <span aria-hidden="true">·</span>
        <span className="text-amber-400">{isAgentMode ? 'Secret Mission Pause' : 'Platypus Powered'}</span>
      </div>

      {/* Main Bold Display Headline: "Break Time" */}
      <div className="relative inline-block my-1">
        <h1
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_12px_rgba(15,165,181,0.35)] select-none"
          style={{
            fontFamily: 'var(--font-display, cursive, sans-serif)',
            letterSpacing: '-0.02em',
            textWrap: 'balance'
          }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-100 to-amber-300">
            Break Time
          </span>
        </h1>

        {/* Decorative corner sparkles */}
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 absolute -top-2 -right-4 sm:-right-6 animate-pulse" />
      </div>

      {/* Iconic Subtitle: "See you in a Bit" */}
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-300/90 mt-1 sm:mt-2 tracking-normal drop-shadow-sm select-none"
        style={{
          fontFamily: 'var(--font-display, cursive, sans-serif)',
          textWrap: 'balance'
        }}
      >
        {customSubtitle || 'See you in a Bit'}
      </h2>

      {/* Soft description */}
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-2 font-medium">
        Take a deep breath, grab some water, and stretch your legs. Perry is on duty keeping your spot safe!
      </p>
    </div>
  );
};
