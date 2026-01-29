
import React, { useState } from 'react';
import { UserProfile, TimelinePost, MediaItem, ArtItem } from '../types';
import Timeline from './Timeline';
import MediaLists from './MediaLists';
import Gallery from './Gallery';

interface SpaceProps {
  user: UserProfile;
  isMe: boolean;
  onEditProfile: () => void;
  posts: TimelinePost[];
  media: MediaItem[];
  gallery: ArtItem[];
  onSelectPost: (id: string) => void;
  onSelectMedia: (item: MediaItem) => void;
}

const PersonalSpaceView: React.FC<SpaceProps> = ({ user, isMe, onEditProfile, posts, media, gallery, onSelectPost, onSelectMedia }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'gallery'>('posts');

  const stats = [
    { label: '关注', value: user.stats?.following || 0 },
    { label: '粉丝', value: user.stats?.followers || 0 },
    { label: '动态', value: posts.length },
    { label: '收藏', value: gallery.length },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-24 animate-fade">
      {/* Immersive Header inspired by UID 55506 */}
      <div className="relative mb-32">
        <div className="h-[300px] md:h-[450px] w-full overflow-hidden rounded-b-[4rem] shadow-2xl relative">
          <img 
            src={user.banner || 'https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1920'} 
            className="w-full h-full object-cover" 
            alt="Space Banner" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Identity Block Overlay */}
        <div className="absolute -bottom-20 left-4 md:left-12 flex flex-col md:flex-row items-end gap-6 md:gap-10 w-full px-4">
          <div className="relative group">
            <img 
              src={user.avatar} 
              className="w-32 h-32 md:w-48 md:h-48 rounded-[3rem] border-8 border-white dark:border-slate-900 shadow-2xl object-cover" 
              alt="Avatar" 
            />
            <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white text-xs font-black px-4 py-1.5 rounded-2xl border-4 border-white dark:border-slate-900 shadow-xl">
              Lv.{user.stats?.level || 1}
            </div>
          </div>
          
          <div className="mb-6 flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h2 className="text-4xl md:text-5xl font-black dark:text-white drop-shadow-md">{user.name}</h2>
              <span className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-xl font-black uppercase tracking-widest shadow-lg">Authenticated</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <span className="text-sm font-black text-slate-500 dark:text-slate-400">UID: {user.uid}</span>
              <div className="flex items-center gap-4">
                {stats.map(s => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="text-sm font-black dark:text-white">{s.value}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Bio & Signature */}
        <div className="mb-12 max-w-3xl flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Memory Signature</h4>
            <p className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 italic leading-relaxed">
              "{user.signature || '探索记忆的旅途还在继续...'}"
            </p>
          </div>
          {isMe && (
            <button 
              onClick={onEditProfile}
              className="bg-pink-500 text-white text-[10px] font-black px-6 py-3 rounded-xl shadow-xl uppercase tracking-widest hover:bg-pink-600 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              装修空间 / 编辑资料
            </button>
          )}
        </div>

        {/* Space Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-12 gap-10 overflow-x-auto no-scrollbar">
          {[
            { id: 'posts', label: isMe ? '我的发布' : 'TA的发布', icon: '📝' },
            { id: 'media', label: isMe ? '我的进度' : 'TA的进度', icon: '📺' },
            { id: 'gallery', label: isMe ? '我的收藏' : 'TA的收藏', icon: '🎨' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-sm font-black flex items-center gap-2 transition-all border-b-4 ${activeTab === tab.id ? 'border-pink-500 text-pink-500' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade">
          {activeTab === 'posts' && (
            <Timeline 
              posts={posts} 
              onSelect={onSelectPost} 
              onVisitUser={() => {}} 
              currentUserUid={user.uid} 
              currentUserRole={user.role} 
            />
          )}
          {activeTab === 'media' && (
            <MediaLists 
              items={media} 
              onAdd={(i) => {}} 
              onRemove={(id) => {}} 
              onSelect={onSelectMedia} 
              currentUserUid={user.uid} 
              currentUserRole={user.role} 
            />
          )}
          {activeTab === 'gallery' && (
            <Gallery 
              items={gallery} 
              onAdd={(i) => {}} 
              onRemove={(id) => {}} 
              currentUserUid={user.uid} 
              currentUserRole={user.role} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalSpaceView;
