
import { TimelinePost, MediaItem, ArtItem } from './types';

export const MOCK_TIMELINE: TimelinePost[] = [
  {
    id: '1',
    type: 'article',
    category: 'analysis',
    title: '重塑的记忆：谈《艾尔登法环》中的叙事艺术',
    content: '在交界地中行走，每一处风景都是一段被遗忘的历史。Share 的意义在于将这些碎片拼凑。宫崎英高的环境叙事不需要长篇大论，只需要一处颓圮的废墟 and 一段若有若无的旋律...',
    author: 'Share 管理员',
    // Fix: Added required authorUid property
    authorUid: '100001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800'],
    tags: ['艾尔登法环', '游戏评测'],
    comments: [],
    views: 1240,
    // Fix: Added missing required status property
    status: 'published'
  },
  {
    id: '2',
    type: 'news',
    category: 'news',
    title: '2024 秋季新番导视：值得关注的佳作',
    content: '又是一个收获的季节。今年秋季档佳作云集，《死神 千年血战篇》最终章回归。除此之外，几部原创动画的PV也展现出了极高的制作水平...',
    author: 'Share 管理员',
    // Fix: Added required authorUid property
    authorUid: '100001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    images: ['https://images.unsplash.com/photo-1578632738980-4204f98c4172?q=80&w=800'],
    tags: ['动漫资讯', '秋季新番'],
    comments: [],
    views: 3500,
    // Fix: Added missing required status property
    status: 'published'
  }
];

export const MOCK_MEDIA: MediaItem[] = [
  { 
    id: 'm1', 
    title: '葬送的芙莉莲', 
    // Fix: Added required authorUid property
    authorUid: '100001',
    cover: 'https://picsum.photos/seed/frieren/200/300', 
    progress: 100, 
    rating: 5, 
    status: 'completed', 
    type: 'anime',
    // Fix: Added missing required approvalStatus property
    approvalStatus: 'published',
    comments: [
      { id: 'mc1', sender: '旅行者', text: '这种平淡中的感动才是最真实的。', timestamp: new Date() }
    ]
  },
  { 
    id: 'm2', 
    title: '塞尔达传说：王国的眼泪', 
    // Fix: Added required authorUid property
    authorUid: '100001',
    cover: 'https://picsum.photos/seed/zelda/200/300', 
    progress: 75, 
    rating: 5, 
    status: 'watching', 
    type: 'game',
    // Fix: Added missing required approvalStatus property
    approvalStatus: 'published',
    comments: []
  },
];

export const MOCK_GALLERY: ArtItem[] = [
  // Fix: Added required status property to all ArtItems
  { id: 'g1', authorUid: '100001', url: 'https://picsum.photos/seed/art1/400/600', title: '回忆中的城市', aspectRatio: 'portrait', status: 'published' },
  { id: 'g2', authorUid: '100001', url: 'https://picsum.photos/seed/art2/600/400', title: '静谧之森', aspectRatio: 'landscape', status: 'published' },
  { id: 'g3', authorUid: '100001', url: 'https://picsum.photos/seed/art3/400/400', title: '少女与猫', aspectRatio: 'square', status: 'published' },
];