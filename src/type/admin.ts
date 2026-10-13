export interface BlogPost {
  id: string;
  title: string;
  category: string;
  type: 'article' | 'video';
  videoSourceType?: 'embed' | 'file';
  videoUrl?: string;
  content: string;
  isVisible: boolean; // Controls whether public users can see it
  is_visible?: boolean;
  publishedAt: string;
}

export interface ResourceFile {
  id: string;
  title: string;
  category: string;
  fileName: string;
  fileSize: string;
  filePath?: string;
  isVisible: boolean; // Controls whether public users can see it
  uploadedAt: string;
}

// src/type/admin.ts
export interface Booking {
  id: string;
  name: string;
  email: string;
  organization?: string | null;
  event_type?: string | null;
  event_date?: string | null;
  location?: string | null;
  message: string;
  status: 'pending' | 'confirmed' | 'declined';
  created_at?: string;
}
export interface LiveStream {
  id: string;
  title: string;
  description?: string;
  host_name?: string;
  meeting_url: string;
  status: 'upcoming' | 'live' | 'ended';
  scheduled_at?: string;
  created_at?: string;
}