import React from 'react';
import { Search, Radio, Shield, Briefcase, Glasses, Key, Camera, Compass } from 'lucide-react';

interface GearItem {
  id: string;
  icon: React.ReactNode;
  top: string;
  left: string;
  size: number;
  colorClass: string;
  animationClass: string;
  delay: string;
  initialRotation: string;
}

export const AgentBackgroundGear: React.FC = () => {
  const gearItems: GearItem[] = [
    // Top-left sector
    {
      id: 'magnifier-1',
      icon: <Search className="w-full h-full" />,
      top: '12%',
      left: '10%',
      size: 36,
      colorClass: 'text-teal-400/25',
      animationClass: 'animate-gear-float-1',
      delay: '0s',
      initialRotation: '-15deg'
    },
    {
      id: 'walkie-1',
      icon: <Radio className="w-full h-full" />,
      top: '32%',
      left: '6%',
      size: 40,
      colorClass: 'text-amber-400/25',
      animationClass: 'animate-gear-float-2',
      delay: '-4s',
      initialRotation: '12deg'
    },
    {
      id: 'badge-1',
      icon: <Shield className="w-full h-full" />,
      top: '55%',
      left: '12%',
      size: 32,
      colorClass: 'text-teal-300/20',
      animationClass: 'animate-gear-float-3',
      delay: '-8s',
      initialRotation: '-8deg'
    },
    {
      id: 'key-1',
      icon: <Key className="w-full h-full" />,
      top: '76%',
      left: '8%',
      size: 28,
      colorClass: 'text-amber-300/20',
      animationClass: 'animate-gear-float-1',
      delay: '-2s',
      initialRotation: '25deg'
    },

    // Top-right sector
    {
      id: 'walkie-2',
      icon: <Radio className="w-full h-full" />,
      top: '14%',
      left: '86%',
      size: 38,
      colorClass: 'text-teal-400/25',
      animationClass: 'animate-gear-float-2',
      delay: '-6s',
      initialRotation: '-18deg'
    },
    {
      id: 'magnifier-2',
      icon: <Search className="w-full h-full" />,
      top: '36%',
      left: '89%',
      size: 34,
      colorClass: 'text-amber-400/25',
      animationClass: 'animate-gear-float-3',
      delay: '-3s',
      initialRotation: '20deg'
    },
    {
      id: 'briefcase-1',
      icon: <Briefcase className="w-full h-full" />,
      top: '60%',
      left: '85%',
      size: 36,
      colorClass: 'text-teal-300/20',
      animationClass: 'animate-gear-float-1',
      delay: '-9s',
      initialRotation: '-10deg'
    },
    {
      id: 'camera-1',
      icon: <Camera className="w-full h-full" />,
      top: '80%',
      left: '88%',
      size: 30,
      colorClass: 'text-amber-300/20',
      animationClass: 'animate-gear-float-2',
      delay: '-5s',
      initialRotation: '15deg'
    },

    // Center-peripheral items (drifting softly behind Perry)
    {
      id: 'glasses-1',
      icon: <Glasses className="w-full h-full" />,
      top: '22%',
      left: '26%',
      size: 32,
      colorClass: 'text-teal-400/18',
      animationClass: 'animate-gear-float-3',
      delay: '-7s',
      initialRotation: '-5deg'
    },
    {
      id: 'compass-1',
      icon: <Compass className="w-full h-full" />,
      top: '20%',
      left: '74%',
      size: 32,
      colorClass: 'text-amber-400/18',
      animationClass: 'animate-gear-float-1',
      delay: '-1s',
      initialRotation: '8deg'
    },
    {
      id: 'badge-2',
      icon: <Shield className="w-full h-full" />,
      top: '72%',
      left: '28%',
      size: 28,
      colorClass: 'text-teal-300/16',
      animationClass: 'animate-gear-float-2',
      delay: '-11s',
      initialRotation: '14deg'
    },
    {
      id: 'key-2',
      icon: <Key className="w-full h-full" />,
      top: '70%',
      left: '72%',
      size: 26,
      colorClass: 'text-amber-300/16',
      animationClass: 'animate-gear-float-3',
      delay: '-4s',
      initialRotation: '-22deg'
    }
  ];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {gearItems.map((item) => (
        <div
          key={item.id}
          className={`absolute ${item.colorClass} ${item.animationClass} transition-opacity duration-1000 hidden sm:block`}
          style={{
            top: item.top,
            left: item.left,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationDelay: item.delay,
            transform: `rotate(${item.initialRotation})`
          }}
        >
          {item.icon}
        </div>
      ))}

      {/* Floating "Engr. Plats Review" background text items (increased quantity, matched to icon scale) */}
      {[
        { id: 'review-1', top: '8%', left: '20%', rot: '-6deg', delay: '-1s', anim: 'animate-gear-float-1', col: 'text-teal-400/24' },
        { id: 'review-2', top: '16%', left: '48%', rot: '5deg', delay: '-8s', anim: 'animate-gear-float-2', col: 'text-amber-400/20' },
        { id: 'review-3', top: '25%', left: '72%', rot: '9deg', delay: '-6s', anim: 'animate-gear-float-1', col: 'text-teal-300/22' },
        { id: 'review-4', top: '44%', left: '5%', rot: '-11deg', delay: '-3s', anim: 'animate-gear-float-2', col: 'text-teal-400/24' },
        { id: 'review-5', top: '48%', left: '80%', rot: '12deg', delay: '-9s', anim: 'animate-gear-float-3', col: 'text-amber-300/22' },
        { id: 'review-6', top: '68%', left: '14%', rot: '7deg', delay: '-4s', anim: 'animate-gear-float-1', col: 'text-teal-400/22' },
        { id: 'review-7', top: '70%', left: '76%', rot: '-10deg', delay: '-11s', anim: 'animate-gear-float-2', col: 'text-amber-400/22' },
        { id: 'review-8', top: '86%', left: '28%', rot: '-5deg', delay: '-5s', anim: 'animate-gear-float-3', col: 'text-teal-300/24' },
        { id: 'review-9', top: '88%', left: '62%', rot: '8deg', delay: '-2s', anim: 'animate-gear-float-1', col: 'text-amber-300/22' },
      ].map((item) => (
        <div
          key={item.id}
          className={`absolute ${item.col} ${item.anim} font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest hidden sm:flex items-center gap-1.5 whitespace-nowrap`}
          style={{
            top: item.top,
            left: item.left,
            animationDelay: item.delay,
            transform: `rotate(${item.rot})`
          }}
        >
          <span>Engr. Plats Review</span>
        </div>
      ))}

      {/* Mobile-optimized subset of floating gear & Engr. Plats Review */}
      <div
        className="sm:hidden absolute top-[14%] left-[6%] w-7 h-7 text-teal-400/20 animate-gear-float-1 -rotate-12"
        style={{ animationDelay: '0s' }}
      >
        <Search className="w-full h-full" />
      </div>
      <div
        className="sm:hidden absolute top-[18%] right-[8%] w-7 h-7 text-amber-400/20 animate-gear-float-2 rotate-12"
        style={{ animationDelay: '-4s' }}
      >
        <Radio className="w-full h-full" />
      </div>
      <div
        className="sm:hidden absolute top-[10%] left-[22%] text-teal-400/22 font-mono text-[11px] font-extrabold uppercase tracking-wider animate-gear-float-1 -rotate-6 whitespace-nowrap"
        style={{ animationDelay: '-1s' }}
      >
        <span>Engr. Plats Review</span>
      </div>
      <div
        className="sm:hidden absolute top-[36%] left-[6%] text-teal-400/22 font-mono text-[11px] font-extrabold uppercase tracking-wider animate-gear-float-2 -rotate-6 whitespace-nowrap"
        style={{ animationDelay: '-3s' }}
      >
        <span>Engr. Plats Review</span>
      </div>
      <div
        className="sm:hidden absolute top-[58%] right-[5%] text-amber-400/22 font-mono text-[11px] font-extrabold uppercase tracking-wider animate-gear-float-3 rotate-8 whitespace-nowrap"
        style={{ animationDelay: '-7s' }}
      >
        <span>Engr. Plats Review</span>
      </div>
      <div
        className="sm:hidden absolute bottom-[24%] left-[8%] w-6 h-6 text-teal-300/20 animate-gear-float-3 -rotate-6"
        style={{ animationDelay: '-2s' }}
      >
        <Shield className="w-full h-full" />
      </div>
      <div
        className="sm:hidden absolute bottom-[20%] right-[10%] w-6 h-6 text-amber-300/20 animate-gear-float-1 rotate-15"
        style={{ animationDelay: '-6s' }}
      >
        <Search className="w-full h-full" />
      </div>
      <div
        className="sm:hidden absolute bottom-[14%] left-[10%] text-teal-300/20 font-mono text-[11px] font-extrabold uppercase tracking-wider animate-gear-float-2 -rotate-4 whitespace-nowrap"
        style={{ animationDelay: '-4s' }}
      >
        <span>Engr. Plats Review</span>
      </div>
      <div
        className="sm:hidden absolute bottom-[8%] right-[8%] text-amber-300/22 font-mono text-[11px] font-extrabold uppercase tracking-wider animate-gear-float-1 rotate-6 whitespace-nowrap"
        style={{ animationDelay: '-5s' }}
      >
        <span>Engr. Plats Review</span>
      </div>
    </div>
  );
};
