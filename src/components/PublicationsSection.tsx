'use client';

import React, { useState, useEffect } from 'react';

export interface PublicationItem {
  id: string;
  type: string;
  title: string;
  category: string;
  author?: string;
  journal_or_publisher?: string;
  publication_date?: string;
  abstract_summary?: string;
  external_link?: string;
  file_url?: string;
  is_visible: boolean;
  created_at?: string;
  [key: string]: any;
}

interface ResourceFile {
  id: string;
  title: string;
  category: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  description?: string;
  uploadedAt?: string;
  isVisible: boolean;
  allowDownload?: boolean;
  [key: string]: any;
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  type: 'article' | 'video' | string;
  videoUrl?: string;
  videoSourceType?: 'embed' | 'file';
  content?: string;
  publishedAt?: string;
  isVisible: boolean;
  [key: string]: any;
}

export default function PublicationsSection({ _setActivePage }: { _setActivePage?: (page: string) => void }) {
  const [activeTab, setActiveTab] = useState<'all' | 'papers' | 'books' | 'notes' | 'videos'>('all');
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; isYouTube: boolean; title: string; downloadUrl?: string } | null>(null);

  // Strict Video Extraction Helper
  const extractVideoUrl = (item: any): string => {
    if (item.video_url) return item.video_url;
    if (item.videoUrl) return item.videoUrl;
    
    const link = item.external_link || item.externalLink;
    if (link && (link.includes('youtube.com') || link.includes('youtu.be') || link.endsWith('.mp4') || link.endsWith('.webm'))) {
      return link;
    }

    const file = item.file_url || item.fileUrl;
    if (file && (file.endsWith('.mp4') || file.endsWith('.webm'))) {
      return file;
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

  // Direct File Blob Download Handler (Forces browser download without navigation)
  const handleDirectDownload = async (fileUrl: string, fileName: string, itemId?: string) => {
    if (!fileUrl) return;

    if (itemId) setDownloadingId(itemId);

    const isYouTube = fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be');

    if (isYouTube) {
      let cleanUrl = fileUrl;
      if (fileUrl.includes('youtu.be/')) {
        const videoId = fileUrl.split('youtu.be/')[1]?.split('?')[0];
        cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
      } else if (fileUrl.includes('youtube.com/watch')) {
        const videoId = fileUrl.split('v=')[1]?.split('&')[0];
        cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
      }

      const downloadEndpoint = `/api/download-youtube?url=${encodeURIComponent(cleanUrl)}&title=${encodeURIComponent(fileName)}`;
      
      const a = document.createElement('a');
      a.href = downloadEndpoint;
      a.download = `${fileName}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (itemId) setDownloadingId(null);
      return;
    }

    try {
      const response = await fetch(fileUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('File fetch failed');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const cleanFileName = fileName 
        ? (fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`)
        : 'publication-document.pdf';

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = cleanFileName;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn('Blob download fallback triggered:', err);
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = fileName || 'download';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      if (itemId) setDownloadingId(null);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [pubRes, resResponse, blogsResponse] = await Promise.all([
          fetch('/api/publications?includeHidden=true&t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/resources?includeHidden=true&t=' + Date.now(), { cache: 'no-store' }),
          fetch('/api/blogs?includeHidden=true&t=' + Date.now(), { cache: 'no-store' }),
        ]);

        if (pubRes.ok) {
          const pubData = await pubRes.json();
          const items = Array.isArray(pubData) ? pubData : pubData.data || [];
          setPublications(items.filter((p: PublicationItem) => p.is_visible));
        }

        if (resResponse.ok) {
          const resData = await resResponse.json();
          const items = Array.isArray(resData) ? resData : resData.data || [];
          setResources(items.filter((r: ResourceFile) => r.isVisible));
        }

        if (blogsResponse.ok) {
          const blogData = await blogsResponse.json();
          const items = Array.isArray(blogData) ? blogData : blogData.data || [];
          setBlogs(items.filter((b: BlogPost) => b.isVisible));
        }
      } catch (err) {
        console.error('Error fetching publications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const resolveType = (category: string, isVideo: boolean) => {
    if (isVideo) return 'videos';
    const cat = (category || '').toLowerCase();
    if (cat.includes('paper') || cat.includes('journal') || cat.includes('academic')) return 'papers';
    if (cat.includes('book') || cat.includes('chapter')) return 'books';
    if (cat.includes('video') || cat.includes('media') || cat.includes('lecture')) return 'videos';
    return 'notes';
  };

  const allPublications = [
    ...publications.map((p) => {
      const rawVideoUrl = extractVideoUrl(p);
      const isVideo = p.category?.toLowerCase().includes('video') || Boolean(rawVideoUrl);
      return {
        id: p.id,
        title: p.title,
        category: p.category || 'Academic Paper',
        type: resolveType(p.category, isVideo),
        description: p.abstract_summary || p.journal_or_publisher || '',
        date: p.publication_date ? new Date(p.publication_date).getFullYear().toString() : '2026',
        fileUrl: p.file_url,
        externalLink: p.external_link,
        canDownload: Boolean(p.file_url || rawVideoUrl),
        isVideo,
        videoRawUrl: rawVideoUrl,
      };
    }),
    ...resources.map((r) => {
      const rawVideoUrl = extractVideoUrl(r);
      const isVideo = r.category?.toLowerCase().includes('video') || Boolean(rawVideoUrl);
      return {
        id: r.id,
        title: r.title,
        category: r.category,
        type: resolveType(r.category, isVideo),
        description: r.description || `Resource document: ${r.fileName || r.title}`,
        date: r.uploadedAt ? new Date(r.uploadedAt).getFullYear().toString() : '2026',
        fileUrl: r.fileUrl,
        externalLink: undefined,
        canDownload: r.isVisible && (r.allowDownload ?? true),
        isVideo,
        videoRawUrl: rawVideoUrl,
      };
    }),
    ...blogs.map((b) => {
      const rawVideoUrl = extractVideoUrl(b);
      const isVideo = b.type === 'video' || b.category?.toLowerCase().includes('video') || Boolean(rawVideoUrl);
      return {
        id: b.id,
        title: b.title,
        category: b.category,
        type: resolveType(b.category, isVideo),
        description: b.content || '',
        date: b.publishedAt ? new Date(b.publishedAt).getFullYear().toString() : '2026',
        fileUrl: undefined,
        externalLink: b.videoUrl,
        canDownload: Boolean(rawVideoUrl),
        isVideo,
        videoRawUrl: rawVideoUrl,
      };
    }),
  ];

  const filteredItems = allPublications.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <section className="bg-slate-100 py-12 sm:py-16 text-slate-800 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-amber-600 text-xs font-bold tracking-wider uppercase font-sans">
            Research & Academic Resources
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-1 mb-3">
            Publications & Media
          </h1>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Access, stream, and download academic papers, course notes, research publications, and video lectures.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 border-b border-slate-200 pb-4">
          {[
            { id: 'all', label: 'All Publications' },
            { id: 'papers', label: 'Academic Papers & Journals' },
            { id: 'books', label: 'Books & Chapters' },
            { id: 'notes', label: 'Lecture Notes & Guides' },
            { id: 'videos', label: 'Video Lectures & Media' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-950 text-amber-400 shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 font-mono text-xs">
            Loading publications...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
            No publications found under this category.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const videoData = parseVideoSource(item.videoRawUrl);

              const handleOpenVideo = () => {
                if (videoData.url) {
                  setSelectedVideo({
                    url: videoData.url,
                    isYouTube: videoData.isYouTube,
                    title: item.title,
                    downloadUrl: item.fileUrl || item.videoRawUrl,
                  });
                }
              };

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Media Header */}
                  {item.isVideo && item.videoRawUrl ? (
                    <div
                      onClick={handleOpenVideo}
                      className="bg-slate-950 h-48 flex flex-col items-center justify-center cursor-pointer relative border-b border-amber-500/30 overflow-hidden"
                    >
                      <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition shadow-lg z-10">
                        ▶
                      </div>
                      <span className="text-amber-400 text-xs font-semibold mt-2 tracking-wider uppercase z-10">
                        Watch Video Lecture
                      </span>
                    </div>
                  ) : item.fileUrl ? (
                    <div className="h-36 bg-slate-900 border-b border-slate-200 flex flex-col items-center justify-center p-4 text-center text-white">
                      <span className="text-3xl mb-1">📄</span>
                      <span className="text-xs font-semibold text-amber-400">PDF Document</span>
                    </div>
                  ) : null}

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                        item.isVideo ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.category || (item.isVideo ? 'Video Lecture' : 'Publication')}
                      </span>
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-lg font-bold font-serif text-slate-900 leading-snug group-hover:text-amber-600 transition">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                    {item.isVideo ? (
                      <div className="flex items-center justify-between w-full">
                        <button
                          type="button"
                          onClick={handleOpenVideo}
                          className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded hover:bg-red-50 transition"
                        >
                          <span>▶</span> Watch Video
                        </button>

                        {(item.fileUrl || item.videoRawUrl) && (
                          <button
                            type="button"
                            disabled={downloadingId === item.id}
                            onClick={() => handleDirectDownload(item.fileUrl || item.videoRawUrl, item.title, item.id)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <span>📥</span> {downloadingId === item.id ? 'Downloading...' : 'Download'}
                          </button>
                        )}
                      </div>
                    ) : item.canDownload && item.fileUrl ? (
                      <button
                        type="button"
                        disabled={downloadingId === item.id}
                        onClick={() => handleDirectDownload(item.fileUrl!, item.title, item.id)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>📥</span> {downloadingId === item.id ? 'Downloading...' : 'Download File'}
                      </button>
                    ) : item.externalLink ? (
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>🔗</span> View Link
                      </a>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                        🔒 Restricted Access
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal Popup */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl max-w-3xl w-full p-6 border border-amber-500/40 relative shadow-2xl max-h-[90vh] flex flex-col my-8">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-3 -right-3 bg-amber-400 text-slate-950 w-8 h-8 rounded-full font-bold flex items-center justify-center shadow hover:bg-amber-500 z-10 transition cursor-pointer"
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
                />
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

            <div className="flex justify-between items-center pt-2">
              <h3 className="text-lg font-bold font-serif text-white truncate pr-4">
                {selectedVideo.title}
              </h3>
              {selectedVideo.downloadUrl && (
                <button
                  type="button"
                  onClick={() => handleDirectDownload(selectedVideo.downloadUrl!, selectedVideo.title)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>📥</span> Download Video
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
