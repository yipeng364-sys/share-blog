export type Section = 'all' | 'news' | 'analysis' | 'collection' | 'life' | 'media' | 'gallery' | 'guestbook';
export type UserRole = 'admin' | 'user';

export interface Comment {
  id: string;
  sender: string;
  senderUid?: string;
  text: string;
  timestamp: Date;
}

export interface TimelinePost {
  id: string;
  type: 'article' | 'news' | 'review' | 'whisper';
  category: Section;
  content: string;
  title: string;
  author: string;
  authorUid: string;
  timestamp: Date;
  images: string[];
  tags: string[];
  comments: Comment[];
  views: number;
  status: 'pending' | 'published';
}

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  title: string;
  subtitle: string;
  avatar: string;
  signature: string;
  banner?: string;
  bannedUntil?: string;
  stats?: {
    followers: number;
    following: number;
    score: number;
    level: number;
  };
}

export interface MediaItem {
  id: string;
  authorUid: string;
  title: string;
  cover: string;
  progress: number;
  rating: number;
  status: 'watching' | 'completed' | 'dropped' | 'plan-to-watch';
  type: 'anime' | 'game';
  comments?: Comment[];
  approvalStatus: 'pending' | 'published'; // New field for moderation
}

export interface ArtItem {
  id: string;
  authorUid: string;
  url: string;
  title: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  status: 'pending' | 'published'; // New field for moderation
}

export interface Message {
  id: string;
  sender: string;
  senderUid: string;
  text: string;
  timestamp: Date;
}