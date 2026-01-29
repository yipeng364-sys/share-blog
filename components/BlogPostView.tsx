import React, { useState } from 'react';
import { TimelinePost, Comment, UserProfile } from '../types';

interface ViewProps {
  post: TimelinePost;
  currentUser: UserProfile;
  onBack: () => void;
  onVisitUser: (uid: string) => void;
  onAddComment: (text: string) => void;
}

const BlogPostView: React.FC<ViewProps> = ({ post, currentUser, onBack, onVisitUser, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="animate-fade pb-20">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl">
        <div className="h-72 md:h-[500px] w-full relative">
          <img src={post.images?.[0]} className="w-full h-full object-cover" alt="p" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
          <button onClick={onBack} className="absolute top-8 left-8 bg-white/10 backdrop-blur-xl text-white px-6 py-3 rounded-2xl font-black text-xs">← 返回档案库</button>
          <div className="absolute bottom-12 left-12 right-12">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">{post.title}</h2>
          </div>
        </div>

        <div className="px-8 md:px-16 pt-10">
          <div className="flex items-center gap-4 py-8 border-y cursor-pointer group" onClick={() => onVisitUser(post.authorUid)}>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-black">{post.author.charAt(0)}</div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">记录员</span>
              <span className="text-sm font-black dark:text-white group-hover:text-pink-500">{post.author}</span>
            </div>
          </div>
          <article className="py-12 prose prose-xl dark:prose-invert max-w-none">
            <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 leading-[1.8] whitespace-pre-wrap">{post.content}</p>
          </article>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 md:p-16">
        <h4 className="text-3xl font-black mb-12 flex items-center gap-4 dark:text-white">💬 档案共鸣 ({post.comments?.length || 0})</h4>
        <form onSubmit={handleSubmitComment} className="mb-16 bg-slate-50 dark:bg-slate-950 p-8 rounded-3xl border">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 mb-2">
              <img src={currentUser.avatar} className="w-8 h-8 rounded-lg" alt="a" />
              <span className="text-xs font-black dark:text-white">以 {currentUser.name} 的身份回复</span>
            </div>
            <textarea placeholder="连接意识，分享你的 resonance..." value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full bg-white dark:bg-slate-900 p-5 rounded-2xl text-xs font-bold border outline-none focus:border-blue-500 transition-all dark:text-white resize-none h-24" required />
            <div className="flex justify-end"><button className="bg-blue-600 text-white font-black px-10 py-4 rounded-2xl text-[10px] uppercase">发送共鸣记录</button></div>
          </div>
        </form>

        <div className="space-y-8">
          {post.comments?.slice().reverse().map(c => (
            <div key={c.id} className="p-8 bg-slate-50 dark:bg-slate-800/20 rounded-[2rem] border animate-fade">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => c.senderUid && onVisitUser(c.senderUid)}>
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">{c.sender.charAt(0).toUpperCase()}</div>
                    <div className="flex flex-col"><span className="text-xs font-black text-blue-600 hover:underline">{c.sender}</span><span className="text-[10px] text-slate-400 uppercase">{new Date(c.timestamp).toLocaleString()}</span></div>
                  </div>
               </div>
               <div className="pl-12 text-sm text-slate-600 dark:text-slate-300 italic">"{c.text}"</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPostView;