
import React from 'react';
import { UserProfile, TimelinePost, Section } from '../types';

interface SidebarProps {
  profile: UserProfile;
  posts: TimelinePost[];
  onWrite: () => void;
  onSettings: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onSelectPost: (id: string) => void;
  onTabChange: (section: Section) => void;
  onEnterSpace: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ profile, posts, onWrite, onSettings, onSearch, searchQuery, onSelectPost, onTabChange, onEnterSpace }) => {
  const stats = [
    { label: '动态', value: posts.length },
    { label: '关注', value: profile.stats?.following || 0 },
    { label: '粉丝', value: profile.stats?.followers || 0 },
    { label: '积分', value: profile.stats?.score || 100 }
  ];

  return (
    <div className="space-y-6 animate-fade" style={{ animationDelay: '0.2s' }}>
      {/* YMGAL Style Profile Info Card */}
      <div 
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all"
        onClick={onEnterSpace}
      >
        <div className="p-8">
          <div className="flex items-start gap-5 mb-8">
            <div className="relative flex-shrink-0">
               <img 
                src={profile.avatar} 
                className="w-20 h-20 rounded-[1.8rem] border-4 border-white dark:border-slate-800 shadow-xl object-cover group-hover:scale-105 transition-transform"
                alt="Avatar"
              />
              <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white text-[9px] font-black px-2 py-1 rounded-lg border-2 border-white dark:border-slate-800">
                Lv.{profile.stats?.level || 1}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black dark:text-white truncate mb-1 group-hover:text-pink-500 transition-colors">{profile.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-slate-400 font-bold tracking-tight">UID: {profile.uid}</span>
                <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[8px] font-black rounded uppercase">Verified</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic line-clamp-2">
                "{profile.signature || '这个人很懒，什么都没有写~'}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 border-y border-slate-100 dark:border-slate-800 py-6 mb-8">
            {stats.map(s => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-lg font-black dark:text-white">{s.value}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
             <button onClick={(e) => { e.stopPropagation(); onEnterSpace(); }} className="flex-1 text-center text-pink-500 text-[10px] font-black uppercase tracking-widest hover:underline">
               个人空间 →
             </button>
             <button onClick={(e) => { e.stopPropagation(); onSettings(); }} className="flex-1 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-pink-500">
               设置档案
             </button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'media', label: '我的进度', icon: '📺' },
            { id: 'gallery', label: '视觉存档', icon: '🎨' },
            { id: 'analysis', label: '深度评测', icon: '✍️' },
            { id: 'guestbook', label: '留言回响', icon: '💬' },
          ].map(link => (
            <button 
              key={link.id} 
              onClick={(e) => { e.stopPropagation(); onTabChange(link.id as Section); }}
              className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all border border-transparent hover:border-pink-200 group"
            >
              <span className="text-2xl group-hover:scale-125 transition-transform">{link.icon}</span>
              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 group-hover:text-pink-500">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Container */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.2em] text-slate-400">Memory Search</h4>
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="搜寻存档..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-xs font-bold outline-none focus:border-pink-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
