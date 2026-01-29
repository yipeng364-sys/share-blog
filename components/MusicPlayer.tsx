
import React, { useState } from 'react';

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="glass-morphism p-4 rounded-3xl flex items-center gap-4 group">
      <div className={`relative w-12 h-12 flex-shrink-0 transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
        <div className="absolute inset-0 rounded-full border-4 border-slate-800 bg-black flex items-center justify-center overflow-hidden">
           <img src="https://picsum.photos/seed/album/100/100" className="w-full h-full object-cover opacity-80" alt="Album" />
           <div className="absolute w-3 h-3 bg-white rounded-full z-10 shadow-inner"></div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h5 className="text-[10px] font-bold text-pink-500 uppercase tracking-widest truncate">Now Playing</h5>
        <p className="text-xs font-medium truncate dark:text-slate-200">Lost in Shinjuku - Lofi Mix</p>
      </div>

      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-pink-500/30"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Visualizer bars */}
      <div className="flex items-end gap-0.5 h-6">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1 bg-pink-400 rounded-full transition-all duration-300 ${isPlaying ? 'animate-[bounce_1s_infinite]' : 'h-1'}`}
            style={{ animationDelay: `${i * 0.1}s`, height: isPlaying ? `${Math.random() * 100}%` : '4px' }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
