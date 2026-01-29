
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface SettingsProps {
  user: UserProfile;
  onUpdate: (user: UserProfile) => void;
  onBack: () => void;
}

const SettingsView: React.FC<SettingsProps> = ({ user, onUpdate, onBack }) => {
  const [form, setForm] = useState({ ...user });
  const [password, setPassword] = useState(user.password || '');
  const avatarRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate({ ...form, password });
    alert('个人档案已更新。');
    onBack();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, [field]: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-10 md:p-16">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-black dark:text-white">个人中心</h2>
              <p className="text-slate-400 font-medium">配置您的数字身份与空间视觉</p>
            </div>
            <button onClick={onBack} className="text-slate-400 font-black text-xs uppercase hover:text-pink-500">放弃修改</button>
          </header>

          <div className="space-y-12">
            {/* Visuals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avatar / 头像</label>
                 <div className="relative group w-32 h-32 cursor-pointer" onClick={() => avatarRef.current?.click()}>
                    <img src={form.avatar} className="w-full h-full rounded-[2rem] object-cover border-4 border-slate-100 dark:border-slate-800 shadow-lg" alt="av" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2.5rem] flex items-center justify-center text-white text-[10px] font-black backdrop-blur-sm">UPDATE</div>
                 </div>
                 <input type="file" ref={avatarRef} className="hidden" accept="image/*" onChange={e => handleFile(e, 'avatar')} />
              </div>
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Banner / 空间背景</label>
                 <div className="relative group w-full h-32 cursor-pointer" onClick={() => bannerRef.current?.click()}>
                    <img src={form.banner} className="w-full h-full rounded-[2rem] object-cover border-4 border-slate-100 dark:border-slate-800 shadow-lg" alt="bn" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-[2.5rem] flex items-center justify-center text-white text-[10px] font-black backdrop-blur-sm">UPDATE</div>
                 </div>
                 <input type="file" ref={bannerRef} className="hidden" accept="image/*" onChange={e => handleFile(e, 'banner')} />
              </div>
            </div>

            {/* Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Display Name</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-pink-500 outline-none dark:text-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Identity Title</label>
                 <input className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-pink-500 outline-none dark:text-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="space-y-2 md:col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Credential / 通行密码</label>
                 <input type="password" placeholder="留空则保持原密码" className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-pink-500 outline-none dark:text-white" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Void Signature</label>
                 <textarea className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-sm font-bold border border-transparent focus:border-pink-500 outline-none dark:text-white resize-none" rows={3} value={form.signature} onChange={e => setForm({...form, signature: e.target.value})} />
              </div>
            </div>

            <button onClick={handleSave} className="w-full bg-pink-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-pink-500/20 active:scale-95 transition-all">
              保存修改并更新档案
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
