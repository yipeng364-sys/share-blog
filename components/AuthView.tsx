import React, { useState } from 'react';
import { UserProfile } from '../types';

interface AuthViewProps {
  onLogin: (user: UserProfile) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateUid = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const savedUsersStr = localStorage.getItem('share_users_db_v8');
    const users: UserProfile[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];

    if (isLogin) {
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        // Check for ban
        if (found.bannedUntil && new Date(found.bannedUntil) > new Date()) {
          setError(`该账户已被禁封。解封日期: ${new Date(found.bannedUntil).toLocaleDateString()}`);
          return;
        }
        onLogin(found);
      } else {
        setError('登录失败：邮箱或密码错误，请检查输入。');
      }
    } else {
      if (users.find(u => u.email === email)) {
        setError('注册失败：该邮箱已被注册。');
        return;
      }
      
      const role = users.length === 0 ? 'admin' : 'user';

      const newUser: UserProfile = {
        id: `u-${Date.now()}`,
        uid: generateUid(),
        name: name || '新用户',
        email,
        password,
        role: role,
        title: role === 'admin' ? '系统管理员' : 'Share 新成员',
        subtitle: '记录生活的旅者',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || Date.now()}`,
        banner: 'https://images.unsplash.com/photo-1516706562776-08fd5035cc04?q=80&w=1920',
        signature: role === 'admin' ? '维护这个世界的秩序。' : '欢迎来到我的数字空间。',
        stats: {
          followers: 0,
          following: 0,
          score: 100,
          level: 1
        }
      };
      users.push(newUser);
      localStorage.setItem('share_users_db_v8', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-[-1]">
        <img 
          src="https://images.unsplash.com/photo-1516706562776-08fd5035cc04?q=80&w=1920" 
          className="w-full h-full object-cover filter blur-[4px] brightness-75 transition-all"
          alt="bg"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-slate-900/60 to-slate-950/80 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-[420px] animate-fade">
        <div className="bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden">
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="inline-block p-4 rounded-3xl bg-pink-500/10 mb-4">
                <h1 className="text-5xl font-black text-pink-500 tracking-tighter">Share</h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                {isLogin ? 'MEMORY ARCHIVE PORTAL' : 'CREATE YOUR LEGACY'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase ml-2">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="昵称" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-pink-500 outline-none transition-all dark:text-white"
                    required
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="电子邮箱" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-pink-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase ml-2">Credential</label>
                <input 
                  type="password" 
                  placeholder="通行密码" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-pink-500 outline-none transition-all dark:text-white"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-bold animate-pulse">
                  {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-pink-500/20 active:scale-95 transition-all uppercase text-xs tracking-widest"
              >
                {isLogin ? 'Login / 登录' : 'Register / 立即注册'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[10px] font-black text-slate-400 hover:text-pink-500 uppercase tracking-widest transition-colors"
              >
                {isLogin ? 'Create Account' : 'Back to Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;