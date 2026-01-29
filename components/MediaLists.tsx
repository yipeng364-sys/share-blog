
import React, { useState } from 'react';
import { MediaItem, UserRole } from '../types';

interface MediaProps {
  items: MediaItem[];
  currentUserUid: string;
  currentUserRole: UserRole;
  onAdd: (item: MediaItem) => void;
  onRemove: (id: string) => void;
  onSelect: (item: MediaItem) => void;
}

const MediaLists: React.FC<MediaProps> = ({ items, onAdd, onRemove, onSelect, currentUserUid, currentUserRole }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    cover: '',
    type: 'anime' as 'anime' | 'game',
    status: 'watching' as any,
    progress: 0,
    rating: 5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.cover) return;
    
    // Fix: Added approvalStatus: 'pending' to satisfy MediaItem type requirements
    onAdd({
      id: `media-${Date.now()}`,
      authorUid: currentUserUid,
      ...formData,
      approvalStatus: 'pending',
      comments: []
    });
    setIsAdding(false);
    setFormData({ title: '', cover: '', type: 'anime', status: 'watching', progress: 0, rating: 5 });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, cover: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
             <span className="text-pink-500">🌸</span> 追番 & 游戏 档案
          </h2>
          <p className="text-slate-500 font-medium italic">"每一场跨次元的旅程都值得被记录"</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
        >
          {isAdding ? '取消' : '+ 新增记录'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade">
          <div className="md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">作品标题</label>
            <input className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-pink-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="例如：Frieren" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">上传封面</label>
            <input type="file" accept="image/*" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" onChange={handleImageUpload} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">类型</label>
            <select className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-pink-500" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
              <option value="anime">动画 (Anime)</option>
              <option value="game">游戏 (Game)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">进度 (%)</label>
            <input type="number" className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-pink-500" value={formData.progress} onChange={e => setFormData({...formData, progress: parseInt(e.target.value)})} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">评分 (0-5)</label>
            <input type="number" step="0.5" max="5" min="0" className="w-full bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-sm outline-none border border-transparent focus:border-pink-500" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} />
          </div>
          <button type="submit" className="md:col-span-3 bg-pink-500 text-white font-black py-4 rounded-2xl shadow-lg">提交档案</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => {
          const canDelete = currentUserRole === 'admin' || item.authorUid === currentUserUid;
          return (
            <div 
              key={item.id} 
              onClick={() => onSelect(item)}
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 group hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 cursor-pointer"
            >
              <div className="h-64 relative overflow-hidden">
                <img src={item.cover} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                <div className="absolute top-4 right-4">
                  {canDelete && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); if(confirm('删除此媒体存档？')) onRemove(item.id); }}
                      className="w-8 h-8 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-500"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl shadow-xl text-white ${item.type === 'anime' ? 'bg-pink-500' : 'bg-blue-500'}`}>
                    {item.type}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(item.rating) ? 'opacity-100' : 'opacity-30'}`}>★</span>
                    ))}
                    <span className="text-white text-xs font-bold ml-2">{item.rating}</span>
                  </div>
                  <h4 className="text-white font-black text-xl truncate drop-shadow-md">{item.title}</h4>
                  <div className="mt-2 text-[10px] text-white/60 font-black uppercase tracking-widest flex items-center gap-2">
                    <span>详情 & 共鸣</span>
                    <span className="w-4 h-px bg-white/40"></span>
                    <span>{item.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Progress Archive</span>
                  <span className="text-sm font-black text-pink-500">{item.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-400 via-pink-500 to-rose-600 transition-all duration-1000" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaLists;