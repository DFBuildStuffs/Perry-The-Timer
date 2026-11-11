import React, { useState } from 'react';
import { CheckCircle2, Circle, Droplets, Eye, Activity, Sparkles, Smile } from 'lucide-react';
import { chatterAudio } from '../audio/chatterAudio';

interface BreakTask {
  id: string;
  label: string;
  tip: string;
  icon: React.ReactNode;
}

export const BreakTips: React.FC = () => {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const tasks: BreakTask[] = [
    {
      id: 'water',
      label: 'Drink a glass of water',
      tip: 'Hydration boosts focus and keeps mental fatigue away.',
      icon: <Droplets className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 'eyes',
      label: '20-20-20 Eye Rest',
      tip: 'Look at something 20 feet away for 20 seconds to ease eye strain.',
      icon: <Eye className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'stretch',
      label: 'Roll shoulders & neck',
      tip: 'Release spine and trapezius tension from sitting.',
      icon: <Activity className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'breathe',
      label: 'Take 3 deep belly breaths',
      tip: 'Calms your nervous system before diving back in.',
      icon: <Smile className="w-4 h-4 text-teal-400" />
    }
  ];

  const toggleTask = (id: string) => {
    const nextState = !completed[id];
    setCompleted((prev) => ({ ...prev, [id]: nextState }));
    if (nextState) {
      chatterAudio.playClick(30);
    }
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between">
      {/* Title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Break Wellness Checklist</h3>
        </div>
        <span className="text-xs font-mono tabular-nums text-teal-400">
          {completedCount}/{tasks.length} Done
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => {
          const isDone = !!completed[task.id];
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                isDone
                  ? 'bg-teal-950/40 border-teal-500/40 text-slate-300'
                  : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600 text-slate-200'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-400 fill-teal-400/20" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {task.label}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{task.tip}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Encouragement */}
      <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
        <span>Perry approves healthy study breaks!</span>
        <span className="text-teal-400 font-semibold font-mono">Doofenshmirtz Evil Inc. is paused</span>
      </div>
    </div>
  );
};
