import React, { useState } from 'react';

interface BagProps {
  isDark: boolean;
  toggleDark: () => void;
  onRandom: () => void;
}

const TravelersBag: React.FC<BagProps> = ({ isDark, toggleDark, onRandom }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuActions = [
    { icon: isDark ? '☀️' : '🌙', label: 'Ethereal Shift', onClick: toggleDark, color: 'bg-amber-500' },
    { icon: '🧹', label: 'Ride Skyward', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }), color: 'bg-indigo-500' },
    { icon: '📜', label: 'Ancient Script', onClick: onRandom, color: 'bg-emerald-500' },
    { icon: '🎵', label: 'Bards Song', onClick: () => {}, color: 'bg-rose-500' },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      {/* Radial Menu */}
      <div className="relative">
        {menuActions.map((action, i) => {
          const angle = (i * (360 / menuActions.length) * Math.PI) / 180;
          const radius = isOpen ? 90 : 0;
          const tx = Math.cos(angle) * radius;
          const ty = Math.sin(angle) * radius;

          return (
            <button
              key={i}
              onClick={() => { action.onClick(); setIsOpen(false); }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full text-white shadow-2xl transition-all duration-500 flex items-center justify-center hover:scale-110 group ${action.color} ${isOpen ? 'opacity-100' : 'opacity-0 scale-0 pointer-events-none'}`}
              style={{ transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))` }}
            >
              <span className="text-xl">{action.icon}</span>
              <span className="absolute right-full mr-4 px-2 py-1 bg-slate-900/80 backdrop-blur-md text-[10px] font-fantasy text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {action.label}
              </span>
            </button>
          );
        })}

        {/* Main Bag Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-[0_0_30px_rgba(139,92,246,0.3)] group ${isOpen ? 'rotate-[360deg] scale-110' : ''}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-800 rounded-2xl border-2 border-white/20"></div>
          <div className="relative z-10 text-3xl transition-transform group-hover:scale-125">
            {isOpen ? '📖' : '👜'}
          </div>
          {/* Pulse Effect */}
          {!isOpen && <div className="absolute inset-0 rounded-2xl bg-purple-500/20 animate-ping"></div>}
        </button>
      </div>
    </div>
  );
};

export default TravelersBag;