
import React, { useState, useRef } from 'react';
import { TimelinePost, Section } from '../types';

const BlogPostEditor: React.FC<{ onPublish: (post: TimelinePost) => void, onCancel: () => void }> = ({ onPublish, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Section>('news');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: { id: Section; label: string }[] = [
    { id: 'news', label: '资讯动态' },
    { id: 'analysis', label: '深度评测' },
    { id: 'collection', label: '藏品整理' },
    { id: 'life', label: '生活记录' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) return;

    const newPost: TimelinePost = {
      id: `post-${Date.now()}`,
      type: category === 'news' ? 'news' : 'article',
      category: category,
      title: title,
      content,
      author: 'Share 管理员',
      // Fix: Added required authorUid property (placeholder as App.tsx overrides it)
      authorUid: '',
      timestamp: new Date(),
      tags: tags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
      images: images.length > 0 ? images : [`https://picsum.photos/seed/p${Date.now()}/1200/800`],
      comments: [],
      views: 1,
      // Fix: Added missing required status property
      status: 'pending'
    };

    onPublish(newPost);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-10 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-4xl font-black border-l-8 border-pink-500 pl-6">撰写新动态</h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl font-bold">关闭</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">存档归类</label>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button 
                  key={cat.id} 
                  type="button" 
                  onClick={() => setCategory(cat.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-black transition-all ${category === cat.id ? 'bg-pink-500 text-white shadow-xl shadow-pink-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">档案标签</label>
            <input 
              type="text" 
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="例如：新番, 旅行, 吐槽"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 text-xs font-bold rounded-2xl outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">上传图片档案</label>
          <div className="flex flex-wrap gap-4 mb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-pink-100 group">
                <img src={img} className="w-full h-full object-cover" alt="upload preview" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:border-pink-500 hover:text-pink-500 transition-all"
            >
              <span className="text-2xl">+</span>
              <span className="text-[10px] font-bold">上传</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange} 
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">标题</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="为这段记忆命名..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 text-2xl font-black rounded-2xl outline-none focus:border-pink-500"
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-4 block">内容</label>
          <textarea 
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="此刻的想法是..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 text-lg rounded-2xl outline-none focus:border-pink-500 resize-none leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-end pt-10 border-t border-slate-100 dark:border-slate-800">
          <button type="submit" className="px-12 py-4 bg-pink-500 hover:bg-pink-600 text-white font-black rounded-2xl shadow-xl shadow-pink-500/20 transition-all active:scale-95">发布动态</button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostEditor;
