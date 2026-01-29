
import React, { useState, useRef } from 'react';
import { ArtItem, UserRole } from '../types';

interface GalleryProps {
  items: ArtItem[];
  currentUserUid: string;
  currentUserRole: UserRole;
  onAdd: (item: ArtItem) => void;
  onRemove: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onAdd, onRemove, currentUserUid, currentUserRole }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    // Fix: Added status: 'pending' to satisfy ArtItem type requirements
    onAdd({
      id: `art-${Date.now()}`,
      authorUid: currentUserUid,
      url: previewUrl,
      title: newTitle || '未命名的碎片',
      aspectRatio: 'portrait',
      status: 'pending'
    });
    setPreviewUrl(null);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="animate-fade">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-black mb-2 flex items-center gap-3">
             <span className="text-pink-500">🖼️</span> 美图收藏墙
          </h2>
          <p className="text-slate-500 font-medium italic">"定格流淌在指尖的视觉碎片"</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-pink-500 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-pink-500/20 active:scale-95 transition-all"
        >
          {isAdding ? '取消' : '+ 收藏美图'}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl animate-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 min-h-[200px] relative">
              {previewUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                   <img src={previewUrl} className="max-h-[180px] rounded-xl object-contain" alt="preview" />
                   <button 
                    type="button" 
                    onClick={() => setPreviewUrl(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex items-center justify-center"
                   >✕</button>
                </div>
              ) : (
                <div 
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span className="text-4xl text-slate-300">📷</span>
                  <span className="text-xs font-black text-slate-400 mt-2 uppercase">点击上传美图文件</span>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            <div className="flex flex-col justify-center">
              <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">作品描述</label>
              <textarea 
                className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-pink-500 resize-none h-32" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                placeholder="记录这张图对你的意义..." 
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-pink-500 text-white font-black py-4 rounded-2xl shadow-lg disabled:opacity-50" disabled={!previewUrl}>
            永久记录到墙面
          </button>
        </form>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {items.map(item => {
          const canDelete = currentUserRole === 'admin' || item.authorUid === currentUserUid;
          return (
            <div 
              key={item.id} 
              className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {canDelete && (
                <button 
                  onClick={() => { if(confirm('从墙上移除此收藏？')) onRemove(item.id); }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500"
                >
                  ✕
                </button>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6 pointer-events-none">
                <h4 className="text-white font-black text-sm">{item.title}</h4>
                <p className="text-[8px] text-white/50 uppercase tracking-widest mt-1">Shared by {item.authorUid}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;