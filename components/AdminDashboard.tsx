
import React, { useState, useRef } from 'react';
import { UserProfile, TimelinePost, MediaItem, ArtItem } from '../types';

interface AdminProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  posts: TimelinePost[];
  media: MediaItem[];
  gallery: ArtItem[];
  onDeletePost: (id: string) => void;
  onApprovePost: (id: string) => void;
  onRejectPost: (id: string) => void;
  onApproveMedia: (id: string) => void;
  onApproveGallery: (id: string) => void;
  onDeleteMedia: (id: string) => void;
  onDeleteUser: (uid: string) => void;
  onBanUser: (uid: string, days: number) => void;
  onVisitUser: (uid: string) => void;
  onExit: () => void;
  onUpdateProfile: (user: UserProfile) => void;
}

const AdminDashboard: React.FC<AdminProps> = ({ 
  currentUser, allUsers, posts, media, gallery, 
  onDeletePost, onApprovePost, onRejectPost, onApproveMedia, onApproveGallery, onDeleteMedia, onDeleteUser, onBanUser, onVisitUser, onExit, onUpdateProfile 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'media' | 'profile' | 'users' | 'approval'>('overview');
  const [profileForm, setProfileForm] = useState(currentUser);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const pendingMedia = media.filter(m => m.approvalStatus === 'pending');
  const pendingGallery = gallery.filter(g => g.status === 'pending');
  const totalPending = pendingPosts.length + pendingMedia.length + pendingGallery.length;

  // Fix: Added handleSaveProfile function to handle admin profile updates
  const handleSaveProfile = () => {
    onUpdateProfile(profileForm);
    alert('管理员档案已同步。');
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 p-12 rounded-[3rem] border border-white/10 text-center max-w-lg">
          <h2 className="text-2xl font-black text-white mb-4">访问受限</h2>
          <button onClick={onExit} className="bg-pink-500 text-white font-black px-12 py-4 rounded-2xl">返回主页</button>
        </div>
      </div>
    );
  }

  const isBanned = (user: UserProfile) => user.bannedUntil && new Date(user.bannedUntil) > new Date();

  return (
    <div className="min-h-screen bg-[#f4f7f9] dark:bg-[#0a0c10] flex animate-fade">
      <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-8">
        <h2 className="text-lg font-black dark:text-white mb-8">管理系统</h2>
        <nav className="flex-1 space-y-1">
          {[
            { id: 'overview', label: '概览', icon: '📊' },
            { id: 'approval', label: '内容审核', icon: '⚖️', badge: totalPending },
            { id: 'users', label: '用户管理', icon: '👥' },
            { id: 'content', label: '动态管理', icon: '📁' },
            { id: 'media', label: '媒体档案', icon: '📺' },
            { id: 'profile', label: '空间装修', icon: '🎨' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full text-left px-6 py-4 rounded-2xl text-xs font-black flex items-center gap-4 relative transition-all ${activeTab === tab.id ? 'bg-pink-500 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && <span className="absolute right-4 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
            </button>
          ))}
        </nav>
        <button onClick={onExit} className="w-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest mt-8">退出系统</button>
      </aside>

      <main className="flex-1 p-12 overflow-y-auto no-scrollbar">
        <div className="animate-fade">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[{ label: '注册用户', val: allUsers.length }, { label: '待审队列', val: totalPending }, { label: '总档案数', val: posts.length }].map((s, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800"><h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">{s.label}</h4><p className="text-3xl font-black dark:text-white">{s.val}</p></div>
              ))}
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="space-y-8">
              <h2 className="text-xl font-black dark:text-white">待审核内容</h2>
              {pendingPosts.map(post => (
                <div key={post.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border flex gap-8 items-start">
                  <img src={post.images[0]} className="w-32 h-32 object-cover rounded-2xl" alt="p" />
                  <div className="flex-1">
                    <span className="text-[10px] text-pink-500 font-black uppercase">Post Submission • UID: {post.authorUid}</span>
                    <h3 className="text-xl font-black dark:text-white my-2">{post.title}</h3>
                    <div className="flex gap-4 mt-4">
                      <button onClick={() => onApprovePost(post.id)} className="bg-green-500 text-white px-6 py-2 rounded-xl text-xs font-black">通过审核</button>
                      <button onClick={() => onRejectPost(post.id)} className="bg-red-500 text-white px-6 py-2 rounded-xl text-xs font-black">拒绝</button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingMedia.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border flex gap-8 items-start">
                  <img src={item.cover} className="w-24 h-32 object-cover rounded-xl" alt="m" />
                  <div className="flex-1">
                    <span className="text-[10px] text-blue-500 font-black uppercase">Media Submission • UID: {item.authorUid}</span>
                    <h3 className="text-xl font-black dark:text-white my-2">{item.title}</h3>
                    <div className="flex gap-4 mt-4">
                      <button onClick={() => onApproveMedia(item.id)} className="bg-green-500 text-white px-6 py-2 rounded-xl text-xs font-black">通过审核</button>
                      <button onClick={() => onDeleteMedia(item.id)} className="bg-red-500 text-white px-6 py-2 rounded-xl text-xs font-black">拒绝</button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingGallery.map(img => (
                <div key={img.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border flex gap-8 items-start">
                  <img src={img.url} className="w-32 h-32 object-contain rounded-xl" alt="g" />
                  <div className="flex-1">
                    <span className="text-[10px] text-purple-500 font-black uppercase">Gallery Submission • UID: {img.authorUid}</span>
                    <h3 className="text-xl font-black dark:text-white my-2">{img.title}</h3>
                    <div className="flex gap-4 mt-4">
                      <button onClick={() => onApproveGallery(img.id)} className="bg-green-500 text-white px-6 py-2 rounded-xl text-xs font-black">通过审核</button>
                      <button onClick={() => onDeleteMedia(img.id)} className="bg-red-500 text-white px-6 py-2 rounded-xl text-xs font-black">拒绝</button>
                    </div>
                  </div>
                </div>
              ))}
              {totalPending === 0 && <p className="text-slate-400 italic">暂无待审核内容</p>}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border overflow-hidden">
               <table className="w-full text-left">
                 <thead><tr className="border-b"><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">用户</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">状态</th><th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-right">操作</th></tr></thead>
                 <tbody className="divide-y">
                    {allUsers.map(user => {
                      const banned = isBanned(user);
                      return (
                        <tr key={user.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
                          <td className="px-8 py-6 flex items-center gap-4">
                            <img src={user.avatar} className="w-10 h-10 rounded-xl cursor-pointer" onClick={() => onVisitUser(user.uid)} alt="a" />
                            <div><p className="text-sm font-black dark:text-white cursor-pointer hover:text-pink-500" onClick={() => onVisitUser(user.uid)}>{user.name}</p><p className="text-[10px] text-slate-500">UID: {user.uid}</p></div>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase ${banned ? 'bg-red-100 text-red-600' : (user.role === 'admin' ? 'bg-pink-500 text-white' : 'bg-green-100 text-green-600')}`}>
                              {banned ? '封禁中' : user.role}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right space-x-2">
                            <button onClick={() => onVisitUser(user.uid)} className="text-blue-500 text-[10px] font-black uppercase">空间</button>
                            {user.uid !== currentUser.uid && (
                              <>{banned ? <button onClick={() => onBanUser(user.uid, 0)} className="text-green-500 text-[10px] font-black uppercase">解封</button> : <button onClick={() => onBanUser(user.uid, 7)} className="text-amber-500 text-[10px] font-black uppercase">封禁7天</button>}<button onClick={() => onDeleteUser(user.uid)} className="text-red-500 text-[10px] font-black uppercase">删除</button></>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                 </tbody>
               </table>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border max-w-3xl mx-auto text-center">
               <h3 className="text-2xl font-black mb-8 dark:text-white">管理员档案同步</h3>
               <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="cursor-pointer group" onClick={() => avatarInputRef.current?.click()}>
                    <img src={profileForm.avatar} className="w-32 h-32 mx-auto rounded-3xl object-cover border-4 border-slate-100 group-hover:scale-105 transition-all" alt="a" />
                    <input type="file" ref={avatarInputRef} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setProfileForm({...profileForm, avatar: r.result as string}); r.readAsDataURL(f); } }} />
                  </div>
                  <div className="cursor-pointer group" onClick={() => bannerInputRef.current?.click()}>
                    <img src={profileForm.banner} className="w-full h-32 rounded-3xl object-cover border-4 border-slate-100 group-hover:scale-105 transition-all" alt="b" />
                    <input type="file" ref={bannerInputRef} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if(f) { const r = new FileReader(); r.onloadend = () => setProfileForm({...profileForm, banner: r.result as string}); r.readAsDataURL(f); } }} />
                  </div>
               </div>
               <input className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-sm font-bold mb-4 dark:text-white" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} placeholder="管理名" />
               <button onClick={handleSaveProfile} className="w-full bg-pink-500 text-white font-black py-5 rounded-3xl">同步档案</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;