import React, { useState, useEffect, useMemo } from 'react';
import { Section, TimelinePost, UserProfile, Message, Comment, MediaItem, ArtItem } from './types';
import Timeline from './components/Timeline';
import MediaLists from './components/MediaLists';
import MediaDetailView from './components/MediaDetailView';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import Sidebar from './components/Sidebar';
import BlogPostView from './components/BlogPostView';
import BlogPostEditor from './components/BlogPostEditor';
import SakuraEffect from './components/SakuraEffect';
import AuthView from './components/AuthView';
import PersonalSpaceView from './components/PersonalSpaceView';
import AdminDashboard from './components/AdminDashboard';
import SettingsView from './components/SettingsView';
import { MOCK_TIMELINE, MOCK_MEDIA, MOCK_GALLERY } from './constants';

type AppView = 'home' | 'space' | 'admin' | 'settings';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [viewUser, setViewUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('all');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [posts, setPosts] = useState<TimelinePost[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<ArtItem[]>([]);
  const [guestbookMessages, setGuestbookMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('share_current_user_v8');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));

    const savedUsersStr = localStorage.getItem('share_users_db_v8');
    if (savedUsersStr) setAllUsers(JSON.parse(savedUsersStr));

    const savedPosts = localStorage.getItem('share_posts_v8');
    const savedMedia = localStorage.getItem('share_media_v8');
    const savedGallery = localStorage.getItem('share_gallery_v8');
    const savedGuestbook = localStorage.getItem('share_guestbook_v8');
    const savedTheme = localStorage.getItem('share_theme_v8');

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts).map((p: any) => ({
        ...p,
        timestamp: new Date(p.timestamp),
        comments: p.comments?.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })) || []
      })));
    } else {
      setPosts(MOCK_TIMELINE.map(p => ({ ...p, status: 'published' })));
    }

    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia).map((m: any) => ({
        ...m,
        comments: m.comments?.map((c: any) => ({ ...c, timestamp: new Date(c.timestamp) })) || []
      })));
    } else {
      setMediaItems(MOCK_MEDIA.map(m => ({ ...m, approvalStatus: 'published' })));
    }

    if (savedGallery) {
      setGalleryItems(JSON.parse(savedGallery));
    } else {
      setGalleryItems(MOCK_GALLERY.map(g => ({ ...g, status: 'published' })));
    }

    if (savedGuestbook) {
      setGuestbookMessages(JSON.parse(savedGuestbook).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    }

    if (savedTheme === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => { localStorage.setItem('share_posts_v8', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('share_media_v8', JSON.stringify(mediaItems)); }, [mediaItems]);
  useEffect(() => { localStorage.setItem('share_gallery_v8', JSON.stringify(galleryItems)); }, [galleryItems]);
  useEffect(() => { localStorage.setItem('share_guestbook_v8', JSON.stringify(guestbookMessages)); }, [guestbookMessages]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('share_current_user_v8', JSON.stringify(currentUser));
    else localStorage.removeItem('share_current_user_v8');
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('share_users_db_v8', JSON.stringify(allUsers)); }, [allUsers]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('share_theme_v8', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    const savedUsersStr = localStorage.getItem('share_users_db_v8');
    if (savedUsersStr) setAllUsers(JSON.parse(savedUsersStr));
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setViewUser(null);
    setView('home');
  };

  const handleVisitUser = (uid: string) => {
    const user = allUsers.find(u => u.uid === uid);
    if (user) {
      setViewUser(user);
      setView('space');
      window.scrollTo(0, 0);
    }
  };

  const handlePublishPost = (newPost: TimelinePost) => {
    if (!currentUser) return;
    const isApproved = currentUser.role === 'admin';
    const postWithAuthor: TimelinePost = { 
      ...newPost, 
      author: currentUser.name, 
      authorUid: currentUser.uid,
      status: isApproved ? 'published' : 'pending' 
    };
    setPosts([postWithAuthor, ...posts]);
    setIsWriting(false);
    if (!isApproved) alert('动态已提交审核。');
  };

  const handleApprovePost = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
  const handleRejectPost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));

  const handleAddMedia = (item: MediaItem) => {
    if (!currentUser) return;
    const isApproved = currentUser.role === 'admin';
    const newItem = { ...item, approvalStatus: isApproved ? 'published' : ('pending' as any) };
    setMediaItems(prev => [newItem, ...prev]);
    if (!isApproved) alert('媒体存档已提交审核。');
  };
  const handleApproveMedia = (id: string) => setMediaItems(prev => prev.map(m => m.id === id ? { ...m, approvalStatus: 'published' } : m));

  const handleAddGallery = (item: ArtItem) => {
    if (!currentUser) return;
    const isApproved = currentUser.role === 'admin';
    const newItem = { ...item, status: isApproved ? 'published' : ('pending' as any) };
    setGalleryItems(prev => [newItem, ...prev]);
    if (!isApproved) alert('视觉存档已提交审核。');
  };
  const handleApproveGallery = (id: string) => setGalleryItems(prev => prev.map(g => g.id === id ? { ...g, status: 'published' } : g));

  const handleAddComment = (postId: string, text: string) => {
    if (!currentUser) return;
    const comment: Comment = {
      id: Date.now().toString(),
      sender: currentUser.name,
      senderUid: currentUser.uid,
      text,
      timestamp: new Date()
    };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p));
  };

  const handleAddMediaComment = (mediaId: string, text: string) => {
    if (!currentUser) return;
    const comment: Comment = {
      id: `m-comm-${Date.now()}`,
      sender: currentUser.name,
      senderUid: currentUser.uid,
      text,
      timestamp: new Date()
    };
    setMediaItems(prev => prev.map(m => m.id === mediaId ? { ...m, comments: [...(m.comments || []), comment] } : m));
  };

  const handleRemoveMedia = (id: string) => setMediaItems(prev => prev.filter(m => m.id !== id));
  const handleRemoveGallery = (id: string) => setGalleryItems(prev => prev.filter(i => i.id !== id));
  const handleAddGuestMessage = (msg: Message) => setGuestbookMessages(prev => [msg, ...prev]);
  const handleRemoveGuestMessage = (id: string) => setGuestbookMessages(prev => prev.filter(m => m.id !== id));
  const handleDeletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));
  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    setAllUsers(prev => prev.map(u => u.id === updatedProfile.id ? updatedProfile : u));
  };
  const handleDeleteUser = (uid: string) => setAllUsers(prev => prev.filter(u => u.uid !== uid));
  const handleBanUser = (uid: string, days: number) => {
    const until = new Date();
    until.setDate(until.getDate() + days);
    const dateStr = days === 0 ? undefined : until.toISOString();
    setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, bannedUntil: dateStr } : u));
    alert(days === 0 ? '用户已解封' : `用户已被封禁 ${days} 天`);
  };

  const filteredPosts = useMemo(() => posts.filter(p => p.status === 'published' && (activeSection === 'all' || p.category === activeSection) && (p.title.includes(searchQuery) || p.content.includes(searchQuery))), [posts, activeSection, searchQuery]);
  const publishedMedia = useMemo(() => mediaItems.filter(m => m.approvalStatus === 'published'), [mediaItems]);
  const publishedGallery = useMemo(() => galleryItems.filter(g => g.status === 'published'), [galleryItems]);

  const currentPost = posts.find(p => p.id === selectedPostId);
  const currentMedia = mediaItems.find(m => m.id === selectedMediaId);

  if (!currentUser) return <><SakuraEffect /><AuthView onLogin={handleLogin} /></>;

  if (view === 'admin') {
    return (
      <AdminDashboard 
        currentUser={currentUser} 
        allUsers={allUsers}
        posts={posts} 
        media={mediaItems}
        gallery={galleryItems}
        onDeletePost={handleDeletePost}
        onApprovePost={handleApprovePost}
        onRejectPost={handleRejectPost}
        onApproveMedia={handleApproveMedia}
        onApproveGallery={handleApproveGallery}
        onDeleteMedia={handleRemoveMedia}
        onDeleteUser={handleDeleteUser}
        onBanUser={handleBanUser}
        onVisitUser={handleVisitUser}
        onExit={() => setView('home')} 
        onUpdateProfile={handleProfileUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative">
      <SakuraEffect />
      <header className="sticky top-0 z-[100] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-3xl font-black text-pink-500 cursor-pointer" onClick={() => { setView('home'); setActiveSection('all'); setViewUser(null); }}>Share</h1>
          <nav className="hidden lg:flex gap-8">
            {[{ id: 'all', label: '空间动态' }, { id: 'media', label: '进度存档' }, { id: 'gallery', label: '视觉墙' }, { id: 'guestbook', label: '留言板' }].map(s => (
              <button key={s.id} onClick={() => { setView('home'); setActiveSection(s.id as Section); setViewUser(null); }} className={`text-sm font-bold tracking-tight pb-1 border-b-2 transition-all ${activeSection === s.id && view === 'home' ? 'text-pink-500 border-pink-500' : 'text-slate-500 border-transparent hover:text-pink-500'}`}>{s.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            {currentUser.role === 'admin' && <button onClick={() => setView('admin')} className="text-[10px] font-black text-white bg-slate-900 dark:bg-pink-500 px-4 py-2 rounded-xl">后台管理</button>}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl transition-all">{isDarkMode ? '☀️' : '🌙'}</button>
            <button onClick={() => { setViewUser(null); setView('space'); window.scrollTo(0,0); }} className="hidden md:flex items-center gap-2 group">
              <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-pink-200 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-black dark:text-white group-hover:text-pink-500">我的空间</span>
            </button>
            <button onClick={() => { setIsWriting(true); setView('home'); setSelectedPostId(null); setViewUser(null); }} className="bg-pink-500 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-pink-500/20 active:scale-95">发表</button>
          </div>
        </div>
      </header>

      {view === 'settings' ? (
        <div className="max-w-7xl mx-auto px-4 py-12"><SettingsView user={currentUser} onUpdate={handleProfileUpdate} onBack={() => setView('home')} /></div>
      ) : view === 'space' ? (
        <PersonalSpaceView 
          user={viewUser || currentUser} 
          isMe={!viewUser || viewUser.uid === currentUser.uid}
          onEditProfile={() => setView('settings')}
          posts={posts.filter(p => p.authorUid === (viewUser?.uid || currentUser.uid) && p.status === 'published')} 
          media={mediaItems.filter(m => m.authorUid === (viewUser?.uid || currentUser.uid) && m.approvalStatus === 'published')} 
          gallery={galleryItems.filter(g => g.authorUid === (viewUser?.uid || currentUser.uid) && g.status === 'published')}
          onSelectPost={(id) => { setSelectedPostId(id); setView('home'); setViewUser(null); }}
          onSelectMedia={(m) => { setSelectedMediaId(m.id); setView('home'); setViewUser(null); }}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 flex flex-col lg:flex-row gap-8">
          <main className="lg:w-[72%]">
            {isWriting ? <BlogPostEditor onPublish={handlePublishPost} onCancel={() => setIsWriting(false)} /> : 
             selectedPostId && currentPost ? <BlogPostView post={currentPost} currentUser={currentUser} onBack={() => setSelectedPostId(null)} onVisitUser={handleVisitUser} onAddComment={(t) => handleAddComment(currentPost.id, t)} /> : 
             selectedMediaId && currentMedia ? <MediaDetailView item={currentMedia} currentUser={currentUser} onBack={() => setSelectedMediaId(null)} onVisitUser={handleVisitUser} onAddComment={(id, t) => handleAddMediaComment(id, t)} /> : 
             (<>
                {activeSection === 'all' && <Timeline posts={filteredPosts} onSelect={setSelectedPostId} onVisitUser={handleVisitUser} currentUserUid={currentUser.uid} currentUserRole={currentUser.role} onDelete={handleDeletePost} />}
                {activeSection === 'media' && <MediaLists items={publishedMedia} currentUserUid={currentUser.uid} currentUserRole={currentUser.role} onAdd={handleAddMedia} onRemove={handleRemoveMedia} onSelect={(m) => setSelectedMediaId(m.id)} />}
                {activeSection === 'gallery' && <Gallery items={publishedGallery} currentUserUid={currentUser.uid} currentUserRole={currentUser.role} onAdd={handleAddGallery} onRemove={handleRemoveGallery} />}
                {activeSection === 'guestbook' && <Guestbook messages={guestbookMessages} currentUserUid={currentUser.uid} currentUserRole={currentUser.role} onVisitUser={handleVisitUser} onAdd={handleAddGuestMessage} onDelete={handleRemoveGuestMessage} />}
             </>)}
          </main>
          <aside className="lg:w-[28%]">
            <Sidebar profile={currentUser} posts={posts.filter(p => p.authorUid === currentUser.uid)} onWrite={() => setIsWriting(true)} onSettings={() => setView('settings')} onSearch={setSearchQuery} searchQuery={searchQuery} onSelectPost={setSelectedPostId} onTabChange={setActiveSection} onEnterSpace={() => setView('space')} />
            <button onClick={handleLogout} className="w-full mt-6 bg-slate-200 dark:bg-slate-800 text-slate-500 text-[10px] font-black py-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-[0.2em]">登出账户 / Logout</button>
          </aside>
        </div>
      )}
    </div>
  );
}