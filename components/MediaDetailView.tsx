import React, { useState } from 'react';
import { MediaItem, Comment, UserProfile } from '../types';

interface MediaDetailProps {
  item: MediaItem;
  currentUser: UserProfile;
  onBack: () => void;
  onVisitUser: (uid: string) => void;
  onAddComment: (mediaId: string, text: string) => void;
}

const MediaDetailView: React.FC<MediaDetailProps> = ({ item, currentUser, onBack, onVisitUser, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(item.id, newComment);
    setNewComment('');
  };

  return (
    <div className="animate-fade">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="h-64 md:h-96 relative">
          <img src={item.cover} className="w-full h-full object-cover" alt="c" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          <button onClick={onBack} className="absolute top-8 left-8 bg-white/20 backdrop-blur-xl text-white px-6 py-3 rounded-2xl font-black text-xs">← 返回列表</button>
          <div className="absolute bottom-10 left-10 right-10"><h2 className="text-4xl md:text-6xl font-black text-white">{item.title}</h2></div>
        </div>

        <div className="p-10 md:p-16">
          <h4 className="text-2xl font-black mb-8 dark:text-white">🌸 观影/游玩 回响 ({item.comments?.length || 0})</h4>
          <form onSubmit={handleSubmit} className="mb-12 bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border">
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-2">
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-lg" alt="a" />
                  <span className="text-xs font-black dark:text-white">以 {currentUser.name} 的身份点评</span>
                </div>
                <textarea placeholder="在这里留下你的评分与评价..." value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl text-xs font-bold outline-none border resize-none h-24 dark:text-white" required />
                <button type="submit" className="self-end bg-pink-500 text-white px-8 py-3 rounded-2xl font-black text-xs">提交回响</button>
             </div>
          </form>
          <div className="space-y-6">
            {item.comments?.slice().reverse().map(c => (
              <div key={c.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border shadow-sm transition-all hover:translate-x-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-pink-500 cursor-pointer hover:underline" onClick={() => c.senderUid && onVisitUser(c.senderUid)}>{c.sender}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{new Date(c.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{c.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailView;