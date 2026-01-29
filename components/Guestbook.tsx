
import React, { useState } from 'react';
import { Message, UserRole } from '../types';

interface GuestbookProps {
  messages: Message[];
  currentUserUid: string;
  currentUserRole: UserRole;
  onVisitUser: (uid: string) => void;
  onAdd: (msg: Message) => void;
  onDelete?: (id: string) => void;
}

const Guestbook: React.FC<GuestbookProps> = ({ messages, onAdd, onDelete, onVisitUser, currentUserUid, currentUserRole }) => {
  const [text, setText] = useState('');
  const [sender, setSender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !sender.trim()) return;

    onAdd({
      id: Date.now().toString(),
      sender,
      senderUid: currentUserUid,
      text,
      timestamp: new Date()
    });

    setText('');
    setSender('');
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12 text-center">
        <h2 className="text-5xl font-black mb-4 dark:text-white">回响长廊</h2>
        <p className="text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase text-[10px] font-bold">Leave a trace of your resonance in the sanctuary.</p>
      </div>

      <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800 mb-12">
        <form onSubmit={handleSubmit} className="space-y-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <input 
               placeholder="Persona Name" 
               value={sender}
               onChange={e => setSender(e.target.value)}
               className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
               required
             />
             <input 
               placeholder="Write your resonance here..." 
               value={text}
               onChange={e => setText(e.target.value)}
               className="md:col-span-2 bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
               required
             />
             <button className="bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-pink-600 transition-all uppercase text-[10px] tracking-widest active:scale-95">
               发送共鸣
             </button>
          </div>
        </form>

        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
          {messages.length > 0 ? messages.map(msg => {
            const canDelete = currentUserRole === 'admin' || msg.senderUid === currentUserUid;
            return (
              <div key={msg.id} className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border-l-4 border-pink-400 group hover:translate-x-2 transition-all duration-300 relative">
                <div className="flex justify-between items-center mb-2">
                  <span 
                    className="text-[10px] font-bold text-pink-500 uppercase tracking-widest cursor-pointer hover:underline"
                    onClick={() => onVisitUser(msg.senderUid)}
                  >
                    {msg.sender} 
                    <span className="text-slate-300 ml-2">UID:{msg.senderUid}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-slate-400 font-medium">
                      {msg.timestamp.toLocaleDateString()} @ {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {canDelete && (
                      <button 
                        onClick={() => { if(confirm('撤回此共鸣？')) onDelete?.(msg.id); }}
                        className="text-[10px] text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        删除
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">"{msg.text}"</p>
              </div>
            );
          }) : (
            <div className="text-center py-16 opacity-40 italic text-slate-400">
               "The sanctuary is quiet, waiting for your echo..."
            </div>
          )}
          
          <div className="p-6 bg-pink-50/30 dark:bg-pink-900/10 rounded-3xl border border-dashed border-pink-200 dark:border-pink-900/30 text-center animate-pulse">
            <p className="text-xs text-pink-600 dark:text-pink-300 font-bold uppercase tracking-widest">A Memory Capsule Has Arrived! 🫧</p>
            <p className="text-[11px] mt-2 text-pink-400 italic">"May you find what you seek in the digital currents..."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guestbook;
