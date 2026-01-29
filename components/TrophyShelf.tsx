import React from 'react';

const TrophyItem: React.FC<{ title: string; image: string; delay: string }> = ({ title, image, delay }) => (
  <div 
    className="relative group trophy-float transition-all duration-500 cursor-help"
    style={{ transitionDelay: delay }}
  >
    <div className="absolute -inset-1 bg-gradient-to-t from-pink-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
    <div className="relative w-14 h-20 bg-slate-800 rounded-md overflow-hidden border border-white/20 shadow-lg">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
        <span className="text-[8px] font-bold text-center text-white leading-tight uppercase">{title}</span>
      </div>
    </div>
  </div>
);

const TrophyShelf: React.FC = () => {
  const trophies = [
    { title: 'Elden Ring', image: 'https://picsum.photos/seed/elden/60/80' },
    { title: 'Cyberpunk', image: 'https://picsum.photos/seed/cyber/60/80' },
    { title: 'Zelda', image: 'https://picsum.photos/seed/zelda2/60/80' },
    { title: 'Apex', image: 'https://picsum.photos/seed/apex/60/80' },
    { title: 'Genshin', image: 'https://picsum.photos/seed/genshin2/60/80' },
  ];

  return (
    <div className="mt-8">
      <h4 className="text-[10px] font-fantasy font-bold tracking-[0.3em] text-pink-500/80 mb-4 flex items-center gap-2">
        <span className="w-8 h-px bg-pink-500/30"></span>
        WARRIOR'S ARTIFACTS
        <span className="w-8 h-px bg-pink-500/30"></span>
      </h4>
      <div className="flex flex-wrap gap-4">
        {trophies.map((t, i) => (
          <TrophyItem key={t.title} title={t.title} image={t.image} delay={`${i * 100}ms`} />
        ))}
        <div className="w-14 h-20 border-2 border-dashed border-white/10 rounded-md flex items-center justify-center text-white/20 hover:border-white/30 transition-colors">
          <span className="text-xl">+</span>
        </div>
      </div>
    </div>
  );
};

export default TrophyShelf;