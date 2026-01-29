
import React from 'react';
import { TimelinePost, UserRole } from '../types';

interface BlogCardProps {
  post: TimelinePost;
  onSelect: (id: string) => void;
  onVisitUser: (uid: string) => void;
  currentUserUid: string;
  currentUserRole: UserRole;
  onDelete?: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onSelect, onVisitUser, currentUserUid, currentUserRole, onDelete }) => {
  const canDelete = currentUserRole === 'admin' || post.authorUid === currentUserUid;

  return (
    <div 
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden mb-8 flex flex-col md:flex-row card-hover group transition-all duration-500 animate-fade shadow-sm relative"
    >
      {/* Visual Component */}
      <div 
        className="md:w-[38%] h-60 md:h-auto overflow-hidden cursor-pointer relative"
        onClick={() => onSelect(post.id)}
      >
        <img 
          src={post.images?.[0] || `https://picsum.photos/seed/${post.id}/800/600`} 
          className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700" 
          alt={post.title}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
        <div className="absolute top-6 left-6">
          <span className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
            {post.category}
          </span>
        </div>
      </div>

      {/* Semantic Component */}
      <div className="md:w-[62%] p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span className="text-blue-500">{post.type}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full" />
               <span>{new Date(post.timestamp).toLocaleDateString()}</span>
            </div>
            {canDelete && (
              <button 
                onClick={(e) => { e.stopPropagation(); if(onDelete) onDelete(post.id); }}
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                title="删除存档"
              >
                🗑️
              </button>
            )}
          </div>
          <h3 
            className="text-2xl lg:text-3xl font-black mb-4 dark:text-white hover:text-pink-600 transition-colors cursor-pointer line-clamp-2 leading-[1.2]"
            onClick={() => onSelect(post.id)}
          >
            {post.title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-8 font-medium">
            {post.content}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5 text-[10px] font-black text-slate-400 tracking-tighter uppercase">
             <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><i className="text-lg">👁️</i> {post.views || 0}</span>
             <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><i className="text-lg">💬</i> {post.comments?.length || 0}</span>
             <span 
              className="flex items-center gap-1.5 cursor-pointer hover:text-pink-500 transition-colors" 
              onClick={(e) => { e.stopPropagation(); onVisitUser(post.authorUid); }}
              title={`点击访问 UID: ${post.authorUid} 的空间`}
             >
              <i className="text-lg">👤</i> {post.author}
             </span>
          </div>
          <div className="flex gap-2">
            {post.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TimelineProps {
  posts: TimelinePost[];
  onSelect: (id: string) => void;
  onVisitUser: (uid: string) => void;
  currentUserUid: string;
  currentUserRole: UserRole;
  onDelete?: (id: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ posts, onSelect, onVisitUser, currentUserUid, currentUserRole, onDelete }) => {
  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 p-24 rounded-3xl text-center shadow-inner">
        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">📭</div>
        <h4 className="text-xl font-black mb-2">未发现任何存档</h4>
        <p className="text-slate-400 text-sm font-medium">在这片荒野中，还没有留下任何脚印。</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <BlogCard 
          key={post.id} 
          post={post} 
          onSelect={onSelect} 
          onVisitUser={onVisitUser}
          currentUserUid={currentUserUid} 
          currentUserRole={currentUserRole}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default Timeline;
