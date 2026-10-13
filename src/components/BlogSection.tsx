'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// Module-scoped client prevents multiple GoTrue instances across renders/HMR
let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseBrowserClient;
}

interface BlogSectionProps {
  setActivePage?: (page: string) => void;
  user?: any;
}

export interface BlogPost {
  id: string | number;
  title: string;
  category: string;
  type?: 'article' | 'video' | string;
  created_at?: string;
  date?: string;
  read_time?: string;
  readOrWatchTime?: string;
  snippet?: string;
  content?: string;
  video_url?: string;
  [key: string]: any;
}

export interface Comment {
  id: string;
  blog_id: string;
  user_id?: string;
  user_email?: string;
  user_name?: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  blogId: string | number;
  user?: any; // Pass the authenticated user from the parent page
}

function resolveUserName(user: any): string {
  if (!user) return 'Guest User';

  const meta = user.user_metadata || user.raw_user_meta_data || {};

  const displayName =
    meta.display_name ||
    meta.full_name ||
    meta.name ||
    meta.username;

  if (displayName && displayName.trim() !== '') {
    return displayName;
  }

  if (user.email && user.email.includes('@')) {
    return user.email.split('@')[0];
  }

  return 'Guest User';
}

export function CommentSection({ blogId, user: initialUser }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(initialUser || null);

  // Fallback local check if prop isn't initially passed
  useEffect(() => {
    if (initialUser) {
      setCurrentUser(initialUser);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setCurrentUser(session.user);
    }
    checkAuth();
  }, [initialUser]);

  const currentUserName = resolveUserName(currentUser);

  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetch(`/api/comments?blogId=${blogId}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setComments(data);
        }
      } catch (e) {
        console.error('Failed to load comments:', e);
      } finally {
        setLoadingComments(false);
      }
    }
    if (blogId) loadComments();
  }, [blogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const finalName = resolveUserName(currentUser);

      const payload = {
        blog_id: String(blogId),
        user_id: currentUser?.id || null,
        user_email: currentUser?.email || 'guest@anonymous.com',
        user_name: finalName,
        content: newComment,
      };

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        const addedComment = {
          ...data,
          user_name: data.user_name || finalName,
        };
        setComments((prev) => [addedComment, ...prev]);
        setNewComment('');
      } else {
        alert(data.error || 'Failed to post comment');
      }
    } catch (e) {
      console.error('Error posting comment:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>💬 Comments</span>
          <span className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 py-1">
          <span className="text-slate-500">Posting as:</span>
          <strong className="text-slate-900 dark:text-white font-bold">{currentUserName}</strong>
        </div>

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={2}
          className="w-full p-2 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:outline-none transition resize-none"
        />

        <div className="flex justify-end items-center">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-md shadow transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {loadingComments ? (
          <div className="text-xs text-slate-400 py-2 text-center">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const displayName = comment.user_name && comment.user_name !== 'Guest User'
              ? comment.user_name
              : (comment.user_email && comment.user_email !== 'guest@anonymous.com'
                  ? comment.user_email.split('@')[0]
                  : 'Guest User');

            return (
              <div
                key={comment.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-[10px] uppercase">
                      {displayName[0]}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">
                        {displayName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 leading-normal">
                  {comment.content}
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-slate-400 py-2 text-center">No comments yet. Be the first to share a thought!</div>
        )}
      </div>
    </div>
  );
}

export default function BlogSection({ setActivePage, user }: BlogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; isYouTube: boolean; post?: BlogPost } | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All', 'Research', 'Reflections', 'Video Lecture'];

  const extractVideoUrl = (post: BlogPost): string => {
    if (post.video_url) return post.video_url;
    if (post.videoEmbedUrl) return post.videoEmbedUrl;
    if (post.video_embed_url) return post.video_embed_url;
    if (post.youtube_url) return post.youtube_url;
    if (post.youtubeUrl) return post.youtubeUrl;
    if (post.url && (post.url.includes('youtu') || post.url.includes('supabase') || post.type === 'video')) return post.url;
    if (post.video) return post.video;
    if (post.link && (post.link.includes('youtu') || post.link.includes('supabase'))) return post.link;

    const allValues = Object.values(post);
    for (const val of allValues) {
      if (typeof val === 'string') {
        if (
          val.includes('youtube.com') ||
          val.includes('youtu.be') ||
          val.endsWith('.mp4') ||
          val.endsWith('.webm') ||
          val.includes('/storage/v1/object/public/')
        ) {
          return val;
        }
      }
    }
    return '';
  };

  const parseVideoSource = (rawUrl?: string): { url: string; isYouTube: boolean } => {
    if (!rawUrl) return { url: '', isYouTube: false };
    const isYouTube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be');
    if (!isYouTube) return { url: rawUrl, isYouTube: false };

    try {
      if (rawUrl.includes('youtube.com/watch')) {
        const parts = rawUrl.split('v=');
        if (parts[1]) {
          const videoId = parts[1].split('&')[0].split('?')[0];
          return {
            url: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
            isYouTube: true,
          };
        }
      }
      if (rawUrl.includes('youtu.be/')) {
        const parts = rawUrl.split('youtu.be/')[1];
        if (parts) {
          const videoId = parts.split('?')[0].split('&')[0];
          return {
            url: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`,
            isYouTube: true,
          };
        }
      }
      if (rawUrl.includes('youtube.com/embed/')) {
        return {
          url: rawUrl.includes('?') ? rawUrl : `${rawUrl}?autoplay=1&rel=0`,
          isYouTube: true,
        };
      }
    } catch (e) {
      console.error('Error parsing video URL:', e);
    }
    return { url: rawUrl, isYouTube: true };
  };

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (res.ok) {
          const postsArray = Array.isArray(data)
            ? data
            : data.blogs || data.data || data.posts || [];
          setBlogPosts(postsArray);
        }
      } catch (err) {
        console.error('Network error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      post.title?.toLowerCase().includes(query) ||
      (post.snippet && post.snippet.toLowerCase().includes(query)) ||
      (post.content && post.content.toLowerCase().includes(query)) ||
      (post.category && post.category.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === 'All' || post.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="bg-slate-100 py-12 sm:py-16 text-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-amber-600 text-xs font-bold tracking-wider uppercase font-sans">
            Insights & Media Feed
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-1 mb-3">
            Blog, Articles & Video Insights
          </h1>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Written reflections, research articles, and video lectures on international social work and safeguarding.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search articles or videos by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-slate-950 text-amber-400 shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                <div className="h-16 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 pt-4"></div>
              </div>
            ))
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const rawUrl = extractVideoUrl(post);
              const isVideo = post.type === 'video' || post.category === 'Video Lecture' || !!rawUrl;
              const videoData = parseVideoSource(rawUrl);

              const postDate = post.created_at
                ? new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : post.date || 'Recent';

              const handleVideoClick = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (videoData.url) {
                  setSelectedVideo({ ...videoData, post });
                } else {
                  alert(`No video URL found for "${post.title}". Check database column mappings.`);
                }
              };

              const handleCardClick = () => {
                if (isVideo) {
                  handleVideoClick({ stopPropagation: () => {} } as React.MouseEvent);
                } else {
                  setSelectedArticle(post);
                }
              };

              return (
                <div
                  key={post.id}
                  onClick={handleCardClick}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden cursor-pointer group"
                >
                  {isVideo && (
                    <div 
                      onClick={handleVideoClick}
                      className="bg-slate-950 h-44 flex flex-col items-center justify-center cursor-pointer relative border-b border-amber-500/30 overflow-hidden"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-lg z-10">
                        ▶
                      </div>
                      <span className="text-amber-400 text-xs font-semibold mt-2 tracking-wider uppercase z-10">
                        Watch Video Lecture
                      </span>
                    </div>
                  )}

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] uppercase ${
                        isVideo ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {post.category || (isVideo ? 'Video Lecture' : 'Article')}
                      </span>
                      <span>{post.read_time || post.readOrWatchTime || (isVideo ? 'Video' : '5 min read')}</span>
                    </div>

                    <h2 className="text-lg font-bold font-serif text-slate-900 leading-snug group-hover:text-amber-600 transition">
                      {post.title}
                    </h2>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {post.snippet || post.content}
                    </p>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-xs text-slate-400">{postDate}</span>
                    {isVideo ? (
                      <button
                        type="button"
                        onClick={handleVideoClick}
                        className="text-xs font-bold text-red-600 group-hover:text-red-700 uppercase tracking-wider flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-red-50 transition"
                      >
                        Watch Video &rarr;
                      </button>
                    ) : (
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedArticle(post);
                        }}
                        className="text-xs font-bold text-amber-600 group-hover:text-amber-700 uppercase tracking-wider hover:bg-amber-50 py-1 px-2 rounded transition"
                      >
                        Read Article &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
              No posts or videos found matching your search term.
            </div>
          )}
        </div>

      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 relative shadow-2xl my-8 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 bg-slate-100 text-slate-700 w-8 h-8 rounded-full font-bold flex items-center justify-center hover:bg-slate-200 transition z-10"
            >
              ✕
            </button>
            <div className="mb-4 pr-8">
              <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase">
                {selectedArticle.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-2">
                {selectedArticle.title}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                {selectedArticle.created_at ? new Date(selectedArticle.created_at).toLocaleDateString() : selectedArticle.date}
              </div>
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              {(selectedArticle.content || selectedArticle.snippet || 'No article content available.').split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              <CommentSection blogId={selectedArticle.id} user={user} />
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full p-6 border border-amber-500/40 relative shadow-2xl max-h-[90vh] flex flex-col my-8">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-3 -right-3 bg-amber-400 text-slate-950 w-8 h-8 rounded-full font-bold flex items-center justify-center shadow hover:bg-amber-500 z-10 transition"
            >
              ✕
            </button>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center mb-4">
              {selectedVideo.isYouTube ? (
                <iframe
                  className="w-full h-full"
                  src={selectedVideo.url}
                  title="Video Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  className="w-full h-full"
                  src={selectedVideo.url}
                  controls
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <div className="overflow-y-auto pr-2">
              {selectedVideo.post && (
                <h3 className="text-xl font-bold font-serif mb-2">{selectedVideo.post.title}</h3>
              )}

              {selectedVideo.post && (
                <CommentSection blogId={selectedVideo.post.id} user={user} />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}