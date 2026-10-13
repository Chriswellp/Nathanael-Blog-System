'use client';

import React, { useState, useEffect } from 'react';
import { BlogPost, ResourceFile, Booking, LiveStream } from '@/src/type/admin';
import LiveRoomModal from './LiveRoomModal';
import { supabase } from '@/src/lib/supabaseClient';

interface CommentItem {
  id: string;
  blog_id: string;
  user_id?: string | null;
  user_email?: string | null;
  user_name?: string | null;
  content: string;
  created_at: string;
}

interface ChatUser {
  id: string;
  name: string;
  email: string;
  isOnline?: boolean;
  lastActive?: string;
  unreadCount?: number;
}

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  sender_type: 'user' | 'admin';
  content: string;
  created_at: string;
}

interface PublicationItem {
  id: string;
  title: string;
  category: 'Academic Papers & Journals' | 'Books & Chapters' | 'Lecture Notes & Guides' | 'Video Lectures & Media';
  type: string;
  author?: string;
  journal_or_publisher?: string;
  publication_date?: string;
  abstract_summary?: string;
  file_url?: string;
  external_link?: string;
  is_visible: boolean;
  created_at?: string;
}

interface HomeHeroData {
  badgeText: string;
  authorName: string;
  tagline: string;
  quote: string;
  logoUrl?: string;
  cardTitle: string;
  cardSubtitle: string;
  cardDescription: string;
}

interface HomePillarCard {
  id: string;
  title: string;
  desc: string;
  icon?: string;
  media_type?: 'none' | 'image' | 'video';
  media_url?: string;
  is_visible?: boolean;
}

interface AdminDashboardProps {
  setActivePage?: (page: string) => void;
}

export default function AdminDashboard({ setActivePage }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'home' | 'publications' | 'blogs' | 'resources' | 'bookings' | 'comments' | 'streams' | 'chats'
  >('overview');

  const [activeCallUrl, setActiveCallUrl] = useState<string | null>(null);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState<number>(0);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState<boolean>(true);

  // --- DATABASE DATA STATES ---
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [resources, setResources] = useState<ResourceFile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // --- HOME PAGE EDITOR STATES ---
  const [homeCards, setHomeCards] = useState<HomePillarCard[]>([]);
  const [heroData, setHeroData] = useState<HomeHeroData>({
    badgeText: 'Social Work Across Borders (SWAB)',
    authorName: 'Nathanael Maradza',
    tagline: 'Social Worker | Author | Speaker | Researcher',
    quote: '"My passion lies in connecting practice, research and lived experience across countries..."',
    logoUrl: '/logo2.png',
    cardTitle: 'SOCIAL WORK ACROSS BORDERS',
    cardSubtitle: 'Different Countries. Shared Purpose.',
    cardDescription: 'Connecting Practice, Research and Lived Experience Across Africa and England.',
  });


  const [cardMediaUrl, setCardMediaUrl] = useState('');
const [cardStoryText, setCardStoryText] = useState('');
const [cardLinkPage, setCardLinkPage] = useState('blog');

  const [isHomeModalOpen, setIsHomeModalOpen] = useState<boolean>(false);
  const [editingHomeCard, setEditingHomeCard] = useState<HomePillarCard | null>(null);
  const [isSavingHomeCard, setIsSavingHomeCard] = useState<boolean>(false);
  const [isSavingHero, setIsSavingHero] = useState<boolean>(false);

  // --- CHAT SYSTEM STATES ---
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  // --- MODAL POPUP STATES ---
  const [isPubModalOpen, setIsPubModalOpen] = useState<boolean>(false);
  const [editingPub, setEditingPub] = useState<PublicationItem | null>(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState<boolean>(false);
  const [editingResource, setEditingResource] = useState<ResourceFile | null>(null);

  const [isStreamModalOpen, setIsStreamModalOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  // --- FORM STATES: PUBLICATIONS ---
  const [pubTitle, setPubTitle] = useState('');
  const [pubCategory, setPubCategory] = useState<PublicationItem['category']>('Academic Papers & Journals');
  const [pubAuthor, setPubAuthor] = useState('Nathanael Maradza');
  const [pubPublisher, setPubPublisher] = useState('');
  const [pubDate, setPubDate] = useState('');
  const [pubAbstract, setPubAbstract] = useState('');
  const [pubExternalLink, setPubExternalLink] = useState('');
  const [pubFile, setPubFile] = useState<File | null>(null);
  const [pubIsVisible, setPubIsVisible] = useState(true);
  const [isSavingPub, setIsSavingPub] = useState(false);
  const [pubUploadProgress, setPubUploadProgress] = useState<number>(0);

  // --- FORM STATES: BLOG / VIDEO ---
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Research');
  const [blogType, setBlogType] = useState<'article' | 'video'>('article');
  const [videoSourceType, setVideoSourceType] = useState<'embed' | 'file'>('embed');
  const [videoEmbedUrl, setVideoEmbedUrl] = useState('');
  const [localVideoFile, setLocalVideoFile] = useState<File | null>(null);
  const [blogContent, setBlogContent] = useState('');
  const [blogIsVisible, setBlogIsVisible] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [blogUploadProgress, setBlogUploadProgress] = useState<number>(0);

  // --- FORM STATES: RESOURCE TOOLKIT ---
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceCategory, setResourceCategory] = useState('Practice Templates');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resourceIsVisible, setResourceIsVisible] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [resourceUploadProgress, setResourceUploadProgress] = useState<number>(0);

  // --- FORM STATES: LIVE STREAM ---
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamMeetingUrl, setStreamMeetingUrl] = useState('');
  const [streamScheduledAt, setStreamScheduledAt] = useState('');
  const [isCreatingStream, setIsCreatingStream] = useState(false);

  // --- FORM STATES: HOME CARD MODAL ---
  const [cardTitle, setCardTitle] = useState('');
  const [cardDesc, setCardDesc] = useState('');
  const [cardIcon, setCardIcon] = useState('📖');
  const [cardMediaType, setCardMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [cardMediaFile, setCardMediaFile] = useState<File | null>(null);
  const [cardIsVisible, setCardIsVisible] = useState(true);

  // --- TOAST NOTIFICATION STATE ---
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('adminToken');
      if (setActivePage) {
        setActivePage('login');
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (setActivePage) {
          setActivePage('login');
        } else {
          window.location.href = '/login';
        }
        return;
      }
      setIsVerifyingAuth(false);
    };

    checkAdminAccess();
  }, [setActivePage]);

  // ==========================================
  // FETCH ALL DATA FROM DATABASE ON LOAD
  // ==========================================
 

  const fetchPublications = async () => {
    try {
      const res = await fetch(`/api/publications?includeHidden=true&t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch publications: ${res.status} ${res.statusText}`);
        return;
      }

      const result = await res.json();
      let records = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result?.publications)
        ? result.publications
        : null;

      if (records && Array.isArray(records)) {
        const normalizedRecords = records.map((pub: any) => ({
          id: pub.id,
          title: pub.title || '',
          category: pub.category || 'Academic Papers & Journals',
          author: pub.author || 'Nathanael Maradza',
          journal_or_publisher: pub.journal_or_publisher || pub.publisher || '',
          publication_date: pub.publication_date || pub.date || '',
          abstract_summary: pub.abstract_summary || pub.abstract || '',
          external_link: pub.external_link || pub.externalLink || '',
          file_url: pub.file_url || pub.fileUrl || '',
          is_visible: pub.is_visible !== undefined ? Boolean(pub.is_visible) : true,
          created_at: pub.created_at || new Date().toISOString(),
        }));

       setPublications((prev) => {
          if (normalizedRecords.length === 0 && prev.length > 0) {
            return prev;
          }
          return normalizedRecords.map((record: any) => {
            const existing = prev.find((p) => p.id === record.id);
            return {
              ...(existing || {}),
              ...record,
              type: record.type || existing?.type || 'article',
            };
          });
        });
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await fetchPublications();
      await fetchHomeContent();

      const [blogsRes, resourcesRes, bookingsRes, commentsRes, streamsRes, chatUsersRes] = await Promise.all([
        fetch('/api/blogs?includeHidden=true', { cache: 'no-store' }),
        fetch('/api/resources?includeHidden=true', { cache: 'no-store' }),
        fetch('/api/bookings', { cache: 'no-store' }),
        fetch('/api/comments', { cache: 'no-store' }),
        fetch('/api/streams', { cache: 'no-store' }),
        fetch('/api/chat/users', { cache: 'no-store' }),
      ]);

      if (blogsRes.ok) {
        const data = await blogsRes.json();
        setBlogs(Array.isArray(data) ? data : data?.data || []);
      }
      if (resourcesRes.ok) {
        const data = await resourcesRes.json();
        setResources(Array.isArray(data) ? data : data?.data || []);
      }
      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(Array.isArray(data) ? data : data?.data || []);
      }
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(Array.isArray(commentsData) ? commentsData : commentsData?.data || []);
      }
      if (streamsRes.ok) {
        const streamsData = await streamsRes.json();
        setStreams(Array.isArray(streamsData) ? streamsData : streamsData?.data || []);
      }
      if (chatUsersRes.ok) {
        const usersData = await chatUsersRes.json();
        const parsedUsers = Array.isArray(usersData) ? usersData : usersData?.data || [];
        setChatUsers(parsedUsers);
        setTotalRegisteredUsers(parsedUsers.length);
      }
    } catch (error) {
      console.error('Error loading data from database:', error);
      showNotification('Error loading records from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Presence channel subscription for online status
  useEffect(() => {
    const presenceChannel = supabase.channel('online-users');

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const activeIds = new Set<string>();

        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: { user_id: string }) => {
            if (p.user_id) activeIds.add(p.user_id);
          });
        });

        setOnlineUserIds(activeIds);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
    };
  }, []);

  // ==========================================
  // CHAT HANDLERS & POLLING
  // ==========================================
  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?userId=${userId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    }
  };

  useEffect(() => {
    if (!selectedUser || activeTab !== 'chats') return;

    fetchMessages(selectedUser.id);
    const interval = setInterval(() => {
      fetchMessages(selectedUser.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedUser, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setIsSendingMessage(true);
    const textToSend = newMessage;
    setNewMessage('');

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_id: selectedUser.id,
          sender_type: 'admin',
          content: textToSend,
        }),
      });

      if (res.ok) {
        await fetchMessages(selectedUser.id);
      } else {
        showNotification('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Error sending message.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // ==========================================
  // HOME PAGE EDIT HANDLERS


  
// ==========================================
// 1. Standalone Data Fetching Helper
// ==========================================
const fetchHomeContent = async () => {
  try {
    const [heroRes, cardsRes] = await Promise.all([
      fetch('/api/home-content/hero'),
      fetch('/api/home-content/card'),
    ]);

    if (heroRes.ok) {
      const heroResult = await heroRes.json();
      const heroDataPayload = heroResult.data || heroResult;
      if (heroDataPayload) {
        setHeroData(heroDataPayload);
      }
    }

    if (cardsRes.ok) {
      const cardsResult = await cardsRes.json();
      const loadedCards = Array.isArray(cardsResult)
        ? cardsResult
        : cardsResult.data || [];

      // Update state (adjust variable name if you use setPillarCards)
      setHomeCards(loadedCards);
    }
  } catch (err) {
    console.error('Error fetching home content:', err);
  }
};

// ==========================================
// 2. Hero Section Save Handler
// ==========================================
const handleSaveHero = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSavingHero(true);

  // Guarantee clean payload without undefined fields
  const payload: HomeHeroData = {
    badgeText: heroData?.badgeText || '',
    authorName: heroData?.authorName || '',
    tagline: heroData?.tagline || '',
    quote: heroData?.quote || '',
    logoUrl: heroData?.logoUrl || '',
    cardTitle: heroData?.cardTitle || '',
    cardSubtitle: heroData?.cardSubtitle || '',
    cardDescription: heroData?.cardDescription || '',
  };

  try {
    const res = await fetch('/api/home-content/hero', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      showNotification('Hero section updated successfully!');
      if (typeof fetchHomeContent === 'function') {
        await fetchHomeContent();
      }
    } else {
      const errorData = await res.json();
      showNotification(errorData.error || 'Failed to update hero section.');
    }
  } catch (err) {
    console.error('Error saving hero section:', err);
    showNotification('An unexpected error occurred.');
  } finally {
    setIsSavingHero(false);
  }
};

// ==========================================
// 3. Open Modal Helper
// ==========================================
const openHomeCardModal = (card?: HomePillarCard) => {
  if (card) {
    setEditingHomeCard(card);
    setCardTitle(card.title || '');
    setCardDesc(card.desc || '');
    setCardIcon(card.icon || '📖');
    setCardMediaType(card.media_type || 'none');
    setCardIsVisible(card.is_visible !== false);
  } else {
    setEditingHomeCard(null);
    setCardTitle('');
    setCardDesc('');
    setCardIcon('📖');
    setCardMediaType('none');
    setCardIsVisible(true);
  }
  setCardMediaFile(null);
  setIsHomeModalOpen(true);
};

// ==========================================
// 4. Home Card Save Handler
// ==========================================
const handleSaveHomeCard = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSavingHomeCard(true);

  try {
    const formData = new FormData();

    if (editingHomeCard?.id) {
      formData.append('id', editingHomeCard.id);
    }

    // Core Content Fields
    formData.append('title', cardTitle);
    formData.append('desc', cardDesc);
    formData.append('icon', cardIcon || '📖');
    formData.append('media_type', cardMediaType || 'none');
    formData.append('media_url', cardMediaUrl || '');
    formData.append('story_text', cardStoryText || '');
    formData.append('link_page', cardLinkPage || 'blog');
    formData.append('isVisible', String(cardIsVisible));

    // Uploaded Media File
    if (cardMediaFile) {
      formData.append('file', cardMediaFile);
    }

    const res = await fetch('/api/home-content/card', {
      method: editingHomeCard ? 'PUT' : 'POST',
      body: formData,
    });

    if (res.ok) {
      showNotification(
        editingHomeCard ? 'Card updated successfully!' : 'New Home card added!'
      );
      setIsHomeModalOpen(false);

      // Reset form input states cleanly
      setCardTitle('');
      setCardDesc('');
      setCardIcon('📖');
      setCardMediaType('none');
      setCardMediaUrl('');
      setCardStoryText('');
      setCardLinkPage('blog');
      setCardMediaFile(null);
      setCardIsVisible(true);

      // Reload dashboard cards list to reflect changes immediately
      await fetchHomeContent();
    } else {
      const errorData = await res.json();
      showNotification(errorData.error || 'Failed to save card.');
    }
  } catch (err) {
    console.error('Error saving home card:', err);
    showNotification('An unexpected error occurred.');
  } finally {
    setIsSavingHomeCard(false);
  }
};

// ==========================================
// 5. Delete Home Card Handler
// ==========================================
const handleDeleteHomeCard = async (id: string) => {
  if (!confirm('Are you sure you want to delete this Home card?')) return;
  
  try {
    const res = await fetch(`/api/home-content/card?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setHomeCards((prev) => prev.filter((c) => c.id !== id));
      showNotification('Card deleted from Home Page.');
    } else {
      const errorData = await res.json();
      showNotification(errorData.error || 'Failed to delete card.');
    }
  } catch (err) {
    console.error('Error deleting home card:', err);
    showNotification('An unexpected error occurred while deleting.');
  }
};

  // ==========================================
  // PUBLICATIONS HANDLERS
  // ==========================================
  const openNewPubModal = () => {
    setEditingPub(null);
    setPubTitle('');
    setPubCategory('Academic Papers & Journals');
    setPubAuthor('Nathanael Maradza');
    setPubPublisher('');
    setPubDate('');
    setPubAbstract('');
    setPubExternalLink('');
    setPubFile(null);
    setPubIsVisible(true);
    setIsPubModalOpen(true);
  };

  const openEditPubModal = (pub: PublicationItem) => {
    setEditingPub(pub);
    setPubTitle(pub.title);
    setPubCategory(pub.category);
    setPubAuthor(pub.author || 'Nathanael Maradza');
    setPubPublisher(pub.journal_or_publisher || '');
    setPubDate(pub.publication_date || '');
    setPubAbstract(pub.abstract_summary || '');
    setPubExternalLink(pub.external_link || '');
    setPubIsVisible(pub.is_visible);
    setPubFile(null);
    setIsPubModalOpen(true);
  };

  const handlePubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPub(true);

    try {
      const formData = new FormData();
      if (editingPub?.id) {
        formData.append('id', editingPub.id);
      }

      formData.append('title', pubTitle);
      formData.append('category', pubCategory);
      formData.append('author', pubAuthor);
      formData.append('journal_or_publisher', pubPublisher);
      formData.append('publication_date', pubDate);
      formData.append('abstract_summary', pubAbstract);
      formData.append('external_link', pubExternalLink);
      formData.append('is_visible', String(pubIsVisible));

      if (pubFile) {
        formData.append('file', pubFile);
      }

      const res = await fetch('/api/publications', {
        method: editingPub ? 'PUT' : 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save publication');
      }

      setIsPubModalOpen(false);
      await new Promise((resolve) => setTimeout(resolve, 300));
      await fetchPublications();

      showNotification(editingPub ? 'Publication updated.' : 'Publication published successfully.');
    } catch (err: any) {
      console.error('Submission failed:', err);
      alert(err.message || 'An error occurred while saving.');
    } finally {
      setIsSavingPub(false);
    }
  };

  const togglePubVisibility = async (pub: PublicationItem) => {
    const nextVisibility = !pub.is_visible;

    try {
      const response = await fetch('/api/publications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: pub.id,
          is_visible: nextVisibility,
        }),
      });

      if (response.ok) {
        setPublications((prev) =>
          prev.map((p) => (p.id === pub.id ? { ...p, is_visible: nextVisibility } : p))
        );
        showNotification(nextVisibility ? 'Publication is now Live.' : 'Publication is now Hidden.');
      } else {
        alert('Failed to update visibility.');
      }
    } catch (error) {
      console.error('Error toggling publication visibility:', error);
    }
  };

  const handleDeletePub = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this publication?')) return;

    try {
      const response = await fetch(`/api/publications?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setPublications((prev) => prev.filter((p) => p.id !== id));
        showNotification('Publication permanently deleted.');
      } else {
        alert('Failed to delete publication.');
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
    }
  };

  // ==========================================
  // BLOG HANDLERS
  // ==========================================
  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogCategory('Research');
    setBlogType('article');
    setVideoSourceType('embed');
    setVideoEmbedUrl('');
    setLocalVideoFile(null);
    setBlogContent('');
    setBlogIsVisible(true);
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogCategory(blog.category);
    setBlogType(blog.type);
    setVideoSourceType(blog.videoSourceType || 'embed');
    setVideoEmbedUrl(blog.videoUrl || '');
    setBlogContent(blog.content || '');
    setBlogIsVisible(blog.isVisible);
    setIsBlogModalOpen(true);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    setBlogUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('title', blogTitle);
      formData.append('category', blogCategory);
      formData.append('type', blogType);
      formData.append('content', blogContent);
      formData.append('isVisible', String(blogIsVisible));

      if (editingBlog) {
        formData.append('id', editingBlog.id);
      }

      if (blogType === 'video') {
        formData.append('videoSourceType', videoSourceType);
        if (videoSourceType === 'file' && localVideoFile) {
          formData.append('videoFile', localVideoFile);
        } else {
          formData.append('videoEmbedUrl', videoEmbedUrl);
        }
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setBlogUploadProgress(percent);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          showNotification(editingBlog ? 'Post updated in database!' : 'Post published to database!');
          setIsBlogModalOpen(false);
          await fetchAllData();
        } else {
          alert('Database operation failed.');
        }
        setIsPublishing(false);
      };

      xhr.onerror = () => {
        alert('Network error while saving post.');
        setIsPublishing(false);
      };

      xhr.open(editingBlog ? 'PUT' : 'POST', '/api/blogs');
      xhr.send(formData);
    } catch (err) {
      console.error('Error saving blog:', err);
      setIsPublishing(false);
    }
  };

  const toggleBlogVisibility = async (blog: BlogPost) => {
    const currentVisibility = blog.isVisible ?? blog.is_visible ?? true;
    const nextVisibility = !currentVisibility;

    try {
      const response = await fetch('/api/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: blog.id,
          isVisible: nextVisibility,
          is_visible: nextVisibility,
        }),
      });

      if (response.ok) {
        setBlogs((prev) =>
          prev.map((b) =>
            b.id === blog.id
              ? { ...b, isVisible: nextVisibility, is_visible: nextVisibility }
              : b
          )
        );
        showNotification(
          nextVisibility ? 'Content made visible to public.' : 'Content hidden from public view.'
        );
      } else {
        const err = await response.json();
        alert(`Failed to update visibility: ${err.error || err.message || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY delete this entry from the database?')) return;

    try {
      const response = await fetch(`/api/blogs?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setBlogs((prev) => prev.filter((item) => item.id !== id));
        showNotification('Item deleted from database.');
      } else {
        alert('Failed to delete record from database.');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  // ==========================================
  // LIVE STREAM HANDLERS
  // ==========================================
  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingStream(true);

    try {
      const scheduledAtISO = streamScheduledAt
        ? new Date(streamScheduledAt).toISOString()
        : null;

      const res = await fetch('/api/streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: streamTitle,
          description: streamDescription,
          meeting_url: streamMeetingUrl,
          scheduled_at: scheduledAtISO,
          status: 'upcoming',
        }),
      });

      if (res.ok) {
        const { stream } = await res.json();
        setStreams((prev) => [stream, ...prev]);
        showNotification('Live Session room created successfully!');
        setIsStreamModalOpen(false);

        setStreamTitle('');
        setStreamDescription('');
        setStreamMeetingUrl('');
        setStreamScheduledAt('');
      } else {
        showNotification('Failed to create live session.');
      }
    } catch (err) {
      console.error('Error creating stream:', err);
      showNotification('Error creating live session.');
    } finally {
      setIsCreatingStream(false);
    }
  };

  const handleUpdateStreamStatus = async (id: string, newStatus: 'upcoming' | 'live' | 'ended') => {
    try {
      const res = await fetch('/api/streams', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setStreams((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        showNotification(`Broadcast status changed to ${newStatus.toUpperCase()}`);
      } else {
        showNotification('Failed to update status.');
      }
    } catch (err) {
      console.error('Error updating stream status:', err);
      showNotification('Error updating broadcast status.');
    }
  };

  const handleDeleteStream = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live session?')) return;

    try {
      const res = await fetch(`/api/streams?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStreams((prev) => prev.filter((s) => s.id !== id));
        showNotification('Live session deleted.');
      } else {
        showNotification('Failed to delete live session.');
      }
    } catch (err) {
      console.error('Error deleting stream:', err);
    }
  };

  // ==========================================
  // BOOKING HANDLERS
  // ==========================================
  const handleUpdateBookingStatus = async (id: string, newStatus: 'confirmed' | 'declined') => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        showNotification(`Booking status updated to ${newStatus}`);
      } else {
        const err = await res.json();
        showNotification(`Failed to update booking: ${err.error || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showNotification('Error updating booking status.');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking request?')) return;

    try {
      const res = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        showNotification('Booking deleted successfully.');
      } else {
        showNotification('Failed to delete booking.');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      showNotification('Error deleting booking.');
    }
  };

  // ==========================================
  // RESOURCE HANDLERS
  // ==========================================
  const openNewResourceModal = () => {
    setEditingResource(null);
    setResourceTitle('');
    setResourceCategory('Practice Templates');
    setSelectedFile(null);
    setResourceIsVisible(true);
    setIsResourceModalOpen(true);
  };

  const openEditResourceModal = (resource: ResourceFile) => {
    setEditingResource(resource);
    setResourceTitle(resource.title);
    setResourceCategory(resource.category);
    setResourceIsVisible(resource.isVisible);
    setIsResourceModalOpen(true);
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource && !selectedFile) return alert('Please select a file to upload.');

    setIsUploading(true);
    setResourceUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      formData.append('title', resourceTitle);
      formData.append('category', resourceCategory);
      formData.append('isVisible', String(resourceIsVisible));

      if (editingResource) {
        formData.append('id', editingResource.id);
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setResourceUploadProgress(percent);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          showNotification(editingResource ? 'Toolkit updated in database!' : 'Toolkit saved to database!');
          setIsResourceModalOpen(false);
          await fetchAllData();
        } else {
          alert('Resource upload failed.');
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        alert('Error uploading file to database server.');
        setIsUploading(false);
      };

      xhr.open(editingResource ? 'PUT' : 'POST', '/api/resources');
      xhr.send(formData);
    } catch (err) {
      console.error('Error saving resource:', err);
      setIsUploading(false);
    }
  };

  const toggleResourceVisibility = async (resource: ResourceFile) => {
    try {
      const response = await fetch('/api/resources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: resource.id, isVisible: !resource.isVisible }),
      });

      if (response.ok) {
        setResources((prev) =>
          prev.map((r) => (r.id === resource.id ? { ...r, isVisible: !r.isVisible } : r))
        );
        showNotification(resource.isVisible ? 'Toolkit hidden from public site.' : 'Toolkit made visible.');
      } else {
        alert('Failed to update visibility status.');
      }
    } catch (error) {
      console.error('Error updating resource visibility:', error);
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to PERMANENTLY remove this file from the database?')) return;

    try {
      const response = await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setResources((prev) => prev.filter((item) => item.id !== id));
        showNotification('Toolkit file removed from database.');
      } else {
        alert('Failed to delete file record.');
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  // ==========================================
  // COMMENTS HANDLERS
  // ==========================================
  const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        showNotification('Comment deleted successfully.');
      } else {
        alert('Failed to delete comment.');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-100 font-sans">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          Verifying Admin Permissions...
        </p>
      </div>
    );
  }

  return (
    <section className="bg-slate-900 min-h-screen py-8 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toast Notification */}
        {statusMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-amber-400 text-slate-950 font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span>✨</span>
            <p className="text-xs sm:text-sm">{statusMessage}</p>
          </div>
        )}

        {/* Portal Header */}
        <header className="bg-slate-950/90 backdrop-blur-md p-6 rounded-2xl border border-amber-500/20 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center shrink-0">
              <img 
                src="/logo1.png" 
                alt="Nathanael Maradza Logo" 
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-amber-400 text-xs font-mono font-bold uppercase tracking-widest">
                  Control Center
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                System Admin Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-slate-800/80 md:border-none pt-4 md:pt-0">
            <button
              onClick={fetchAllData}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>🔄</span> Sync Database
            </button>

            <button
              onClick={handleLogoutClick}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex border-b border-slate-800 gap-2 pb-2 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'home', label: '🏠 Home Page Editor' },
            { id: 'publications', label: `📚 Publications (${publications.length})` },
            { id: 'chats', label: `💬 Live Support (${chatUsers.length})` },
            { id: 'blogs', label: `📝 Blogs & Videos (${blogs.length})` },
            { id: 'resources', label: `📁 Toolkits (${resources.length})` },
            { id: 'bookings', label: `📅 Bookings (${bookings.length})` },
            { id: 'comments', label: `💭 Comments (${comments.length})` },
            { id: 'streams', label: `🎥 Live Sessions (${streams.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-400/10'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* TAB 0: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-mono uppercase">Publications</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{publications.length}</p>
                </div>
                <span className="text-2xl bg-slate-900 p-3 rounded-xl border border-slate-800">📚</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-mono uppercase">Registered Users</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{totalRegisteredUsers}</p>
                </div>
                <span className="text-2xl bg-slate-900 p-3 rounded-xl border border-slate-800">💬</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-mono uppercase">Total Blogs</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{blogs.length}</p>
                </div>
                <span className="text-2xl bg-slate-900 p-3 rounded-xl border border-slate-800">📝</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-mono uppercase">Toolkits / Files</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{resources.length}</p>
                </div>
                <span className="text-2xl bg-slate-900 p-3 rounded-xl border border-slate-800">📁</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-mono uppercase">Bookings</p>
                  <p className="text-3xl font-bold text-amber-400 mt-1">{bookings.length}</p>
                </div>
                <span className="text-2xl bg-slate-900 p-3 rounded-xl border border-slate-800">📅</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-base font-bold font-serif text-white">Quick System Actions</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openNewPubModal}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  + Add New Academic Publication
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  💬 Open Live Chat Center
                </button>
                <button
                  onClick={openNewBlogModal}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  + Add New Article / Video
                </button>
                <button
                  onClick={openNewResourceModal}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  + Upload New Toolkit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: HOME PAGE EDITOR */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* HERO CONTENT SETTINGS */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-base font-bold font-serif text-amber-400">Hero Section Text & Branding</h2>
                  <p className="text-xs text-slate-400">Edit titles, quotes, and header banners on the public Home page.</p>
                </div>
              </div>

              <form onSubmit={handleSaveHero} className="space-y-4">
  <div className="grid md:grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Badge Banner Text</label>
      <input
        type="text"
        name="badgeText"
        value={heroData?.badgeText || ''}
        onChange={(e) => setHeroData({ ...heroData, badgeText: e.target.value })}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      />
    </div>

    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Author / Main Name</label>
      <input
        type="text"
        name="authorName"
        value={heroData?.authorName || ''}
        onChange={(e) => setHeroData({ ...heroData, authorName: e.target.value })}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      />
    </div>
  </div>

  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-slate-300">Tagline Titles</label>
    <input
      type="text"
      name="tagline"
      value={heroData?.tagline || ''}
      onChange={(e) => setHeroData({ ...heroData, tagline: e.target.value })}
      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
    />
  </div>

  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-slate-300">Main Mission Quote</label>
    <textarea
      rows={2}
      name="quote"
      value={heroData?.quote || ''}
      onChange={(e) => setHeroData({ ...heroData, quote: e.target.value })}
      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
    />
  </div>

  <div className="grid md:grid-cols-3 gap-4">
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Right Card Title</label>
      <input
        type="text"
        name="cardTitle"
        value={heroData?.cardTitle || ''}
        onChange={(e) => setHeroData({ ...heroData, cardTitle: e.target.value })}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      />
    </div>

    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Right Card Subtitle</label>
      <input
        type="text"
        name="cardSubtitle"
        value={heroData?.cardSubtitle || ''}
        onChange={(e) => setHeroData({ ...heroData, cardSubtitle: e.target.value })}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      />
    </div>

    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Right Card Description</label>
      <input
        type="text"
        name="cardDescription"
        value={heroData?.cardDescription || ''}
        onChange={(e) => setHeroData({ ...heroData, cardDescription: e.target.value })}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      />
    </div>
  </div>

  <div className="flex justify-end pt-2">
    <button
      type="submit"
      disabled={isSavingHero}
      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer shadow-md"
    >
      {isSavingHero ? 'Saving Hero...' : 'Save Hero Text'}
    </button>
  </div>
</form>
            </div>

            {/* CARDS & PILLARS EDITOR */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Home Page Cards & Focus Areas</p>
                  <p className="text-xs text-slate-400">Manage titles, images, videos, stories, and layout items.</p>
                </div>
                <button
                  onClick={() => openHomeCardModal()}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
                >
                  + Add New Card
                </button>
              </div>

              {homeCards.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  No Home page cards found. Click "+ Add New Card" to showcase pillars or stories.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {homeCards.map((card) => (
                    <div
                      key={card.id}
                      className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl">{card.icon || '📖'}</span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              card.is_visible !== false
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                          >
                            {card.is_visible !== false ? '● Live' : '○ Hidden'}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white">{card.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-2">{card.desc}</p>

                        {card.media_type && card.media_type !== 'none' && (
                          <div className="text-[11px] font-mono text-amber-400 bg-amber-400/10 p-2 rounded border border-amber-400/20">
                            Media Mode: {card.media_type.toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => openHomeCardModal(card)}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteHomeCard(card.id)}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl border border-rose-500/30 transition cursor-pointer"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PUBLICATIONS MANAGEMENT */}
        {activeTab === 'publications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">Publications & Academic Library</p>
                <p className="text-xs text-slate-400">Manage Academic Papers, Books, Lecture Notes, and Media Resources.</p>
              </div>
              <button
                onClick={openNewPubModal}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
              >
                + Upload Publication
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading publications...</div>
            ) : publications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                No publications found in database. Click "Upload Publication" to add papers, journals, or lecture guides.
              </div>
            ) : (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80">
                {publications.map((pub) => (
                  <div key={pub.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{pub.title}</span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-semibold">
                          {pub.category}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            pub.is_visible
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {pub.is_visible ? '● Live on Site' : '○ Hidden from Site'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 font-mono">
                        Author: {pub.author || 'Nathanael Maradza'} {pub.journal_or_publisher ? `• ${pub.journal_or_publisher}` : ''} {pub.publication_date ? `(${pub.publication_date})` : ''}
                      </p>

                      {pub.abstract_summary && (
                        <p className="text-xs text-slate-300 line-clamp-2 max-w-3xl bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
                          {pub.abstract_summary}
                        </p>
                      )}

                      <div className="flex items-center gap-4 pt-1">
                        {pub.file_url && (
                          <a href={pub.file_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono">
                            📄 View Attached File
                          </a>
                        )}
                        {pub.external_link && (
                          <a href={pub.external_link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono">
                            🔗 Publisher Link
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => togglePubVisibility(pub)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition cursor-pointer ${
                          pub.is_visible
                            ? 'bg-slate-900 text-amber-400 border-amber-400/30 hover:bg-slate-800'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {pub.is_visible ? 'Hide' : 'Make Live'}
                      </button>

                      <button
                        onClick={() => openEditPubModal(pub)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDeletePub(pub.id)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl border border-rose-500/30 transition cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LIVE CHATS & DIRECT MESSAGING */}
        {activeTab === 'chats' && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[580px]">
            {/* LEFT SIDEBAR: USER LIST */}
            <div className="border-r border-slate-800 flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase font-mono text-amber-400">
                  Logged-In Users ({chatUsers.length})
                </h3>
                <button
                  onClick={fetchAllData}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Refresh
                </button>
              </div>

              <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[500px] flex-1">
                {chatUsers.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No logged-in users or chat sessions found.
                  </div>
                ) : (
                  chatUsers.map((user) => {
                    const isOnline = onlineUserIds.has(user.id);
                    const isSelected = selectedUser?.id === user.id;

                    return (
                      <button
                        key={user.id}
                        onClick={() => setSelectedUser(user)}
                        className={`w-full text-left p-3 flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-slate-800 border-l-4 border-amber-400' : 'hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                              {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                            </div>
                            <span
                              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
                                isOnline ? 'bg-emerald-500' : 'bg-slate-500'
                              }`}
                            />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white leading-tight">{user.name}</h4>
                            <span className="text-[11px] text-slate-400">
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: SELECTED CHAT THREAD */}
            <div className="md:col-span-2 flex flex-col justify-between bg-slate-950/40">
              {selectedUser ? (
                <>
                  <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedUser.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold ${
                        onlineUserIds.has(selectedUser.id)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {onlineUserIds.has(selectedUser.id) ? 'Online Now' : 'Offline'}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 overflow-y-auto max-h-[400px] flex-1">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-xs text-slate-500 py-12">
                        No messages exchanged yet with {selectedUser.name}.
                      </div>
                    ) : (
                      chatMessages.map((msg) => {
                        const isAdmin = msg.sender_type === 'admin';
                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${
                              isAdmin ? 'items-end' : 'items-start'
                            }`}
                          >
                            <div
                              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs ${
                                isAdmin
                                  ? 'bg-amber-400 text-slate-950 font-medium rounded-br-none'
                                  : 'bg-slate-900 text-slate-100 border border-slate-800 rounded-bl-none'
                              }`}
                            >
                              <p>{msg.content}</p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono mt-1 px-1">
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-slate-800 bg-slate-900/50 flex gap-2"
                  >
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Reply to ${selectedUser.name}...`}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={isSendingMessage || !newMessage.trim()}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer"
                    >
                      {isSendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-2">
                  <span className="text-4xl">💬</span>
                  <p className="text-sm font-bold text-slate-300">No Chat Selected</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Select a logged-in user from the left pane to view their chat history and send a direct reply.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: BLOGS & VIDEOS LIST */}
        {activeTab === 'blogs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400">
                Manage stored blogs/videos. Use <span className="text-amber-400 font-bold">Visibility</span> to hide/show items live.
              </p>
              <button
                onClick={openNewBlogModal}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
              >
                + Add Blog / Video Entry
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading database entries...</div>
            ) : blogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                No blog entries found in database.
              </div>
            ) : (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80">
                {blogs.map((blog) => (
                  <div key={blog.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{blog.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                          {blog.category}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                          {blog.type}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            blog.isVisible
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {blog.isVisible ? '● Live on Site' : '○ Hidden from Site'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">{blog.content}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Added: {blog.publishedAt}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => toggleBlogVisibility(blog)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition cursor-pointer ${
                          (blog.is_visible ?? blog.isVisible)
                            ? 'bg-slate-900 text-amber-400 border-amber-400/30 hover:bg-slate-800'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {(blog.is_visible ?? blog.isVisible) ? 'Hide' : 'Make Live'}
                      </button>

                      <button
                        onClick={() => openEditBlogModal(blog)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl border border-rose-500/30 transition cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: RESOURCE FILES LIST */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400">Manage database attached PDF practice toolkits and guides.</p>
              <button
                onClick={openNewResourceModal}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer shadow-md"
              >
                + Upload Toolkit File
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading resources from database...</div>
            ) : resources.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                No files uploaded to database.
              </div>
            ) : (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80">
                {resources.map((file) => (
                  <div key={file.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">{file.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400">
                          {file.category}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            file.isVisible
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {file.isVisible ? '● Visible for Download' : '○ Download Restricted'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        File: {file.fileName} ({file.fileSize}) • Uploaded: {file.uploadedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      <button
                        onClick={() => toggleResourceVisibility(file)}
                        className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition cursor-pointer ${
                          file.isVisible
                            ? 'bg-slate-900 text-amber-400 border-amber-400/30 hover:bg-slate-800'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {file.isVisible ? 'Restrict' : 'Allow'}
                      </button>

                      <button
                        onClick={() => openEditResourceModal(file)}
                        className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 transition cursor-pointer"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDeleteResource(file.id)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl border border-rose-500/30 transition cursor-pointer"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-amber-400">
                  Consultation & Speaking Requests
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Review, accept, or decline event and speaking requests submitted by visitors.
                </p>
              </div>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
                Total: {bookings.length}
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm bg-slate-900/50 rounded-xl border border-slate-800">
                No booking requests received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 transition hover:border-slate-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-100">{booking.name}</h3>
                          {booking.organization && (
                            <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              {booking.organization}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          <a href={`mailto:${booking.email}`} className="hover:underline text-slate-300">
                            {booking.email}
                          </a>
                        </p>
                      </div>

                      <div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                            booking.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : booking.status === 'declined'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block">Event Type</span>
                        <span className="text-slate-200 font-medium">{booking.event_type || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Proposed Date</span>
                        <span className="text-slate-200 font-medium">{booking.event_date || 'TBD'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Location / Venue</span>
                        <span className="text-slate-200 font-medium">{booking.location || 'N/A'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-400 block mb-1">
                        Event Details & Notes:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
                        {booking.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Submitted:{' '}
                        {booking.created_at
                          ? new Date(booking.created_at).toLocaleDateString()
                          : 'Recent'}
                      </span>

                      <div className="flex items-center gap-2">
                        {booking.status !== 'confirmed' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
                          >
                            Accept
                          </button>
                        )}

                        {booking.status !== 'declined' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking.id, 'declined')}
                            className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            Decline
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: LIVE TALK & CALL MANAGER */}
        {activeTab === 'streams' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-amber-400">
                  Live Talk & Call Manager
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Schedule upcoming broadcasts, launch live rooms, and manage real-time event rooms.
                </p>
              </div>

              <button
                onClick={() => setIsStreamModalOpen(true)}
                className="bg-amber-400 text-slate-950 px-4 py-2 rounded-lg font-bold text-xs hover:bg-amber-500 transition shadow self-start sm:self-auto cursor-pointer"
              >
                + Create Live Room
              </button>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading live sessions...</div>
            ) : streams.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm bg-slate-900/50 rounded-xl border border-slate-800">
                No live sessions configured. Click "Create Live Room" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {streams.map((stream) => (
                  <div
                    key={stream.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4 transition hover:border-slate-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-slate-100">{stream.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{stream.description}</p>
                      </div>

                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider w-fit ${
                          stream.status === 'live'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            : stream.status === 'upcoming'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {stream.status === 'live' ? '🔴 Live Now' : stream.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Meeting / Stream URL</span>
                        <a
                          href={stream.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline truncate block"
                        >
                          {stream.meeting_url}
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-500 block">Scheduled Time</span>
                        <span className="text-slate-300 font-medium">
                          {stream.scheduled_at
                            ? new Date(stream.scheduled_at).toLocaleString()
                            : 'Instant Room'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Host: {stream.host_name || 'Nathanael Maradza'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveCallUrl(stream.meeting_url)}
                          className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1 cursor-pointer"
                        >
                          🎥 Join Room
                        </button>

                        {stream.status === 'upcoming' && (
                          <button
                            onClick={() => handleUpdateStreamStatus(stream.id, 'live')}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow"
                          >
                            Start Broadcast
                          </button>
                        )}

                        {stream.status === 'live' && (
                          <button
                            onClick={() => handleUpdateStreamStatus(stream.id, 'ended')}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                          >
                            End Stream
                          </button>
                        )}

                        {stream.status === 'ended' && (
                          <button
                            onClick={() => handleUpdateStreamStatus(stream.id, 'upcoming')}
                            className="px-3 py-1.5 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-600/30 transition cursor-pointer"
                          >
                            Reopen Room
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteStream(stream.id)}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: COMMENTS MANAGEMENT */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400">
                Review user comments across all published articles and media entries.
              </p>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                No user comments posted yet.
              </div>
            ) : (
              <div className="bg-slate-950 rounded-2xl border border-slate-800 divide-y divide-slate-800/80">
                {comments.map((comment) => {
                  const associatedBlog = blogs.find((b) => b.id === comment.blog_id);
                  return (
                    <div key={comment.id} className="p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="space-y-1.5 max-w-3xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-amber-400">
                            {comment.user_name || comment.user_email || 'Anonymous Guest'}
                          </span>
                          {comment.user_email && (
                            <span className="text-[11px] font-mono text-slate-500">
                              ({comment.user_email})
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            Target Post: {associatedBlog ? associatedBlog.title : comment.blog_id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                          "{comment.content}"
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Posted at: {new Date(comment.created_at).toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs px-3 py-1.5 rounded-xl border border-rose-500/30 transition cursor-pointer self-end md:self-start"
                      >
                        🗑️ Moderate / Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL POPUP: HOME CARD FORM */}
      {isHomeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-serif text-amber-400">
                {editingHomeCard ? 'Edit Home Card' : 'Add New Home Card'}
              </h3>
              <button
                onClick={() => setIsHomeModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

           <form onSubmit={handleSaveHomeCard} className="space-y-4">
  <div className="grid grid-cols-4 gap-4">
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Icon Emoji</label>
      <input
        type="text"
        name="icon"
        value={cardIcon}
        onChange={(e) => setCardIcon(e.target.value)}
        placeholder="📖"
        className="w-full text-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      />
    </div>

    <div className="col-span-3 space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Card Title *</label>
      <input
        type="text"
        name="title"
        value={cardTitle}
        onChange={(e) => setCardTitle(e.target.value)}
        required
        placeholder="e.g. Cross-Border Practice"
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      />
    </div>
  </div>

  <div className="space-y-1">
    <label className="text-xs font-bold uppercase text-slate-300">Description Summary *</label>
    <textarea
      rows={3}
      name="desc"
      value={cardDesc}
      onChange={(e) => setCardDesc(e.target.value)}
      required
      placeholder="Summarize this focus pillar or section..."
      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
    />
  </div>

  <div className="grid md:grid-cols-2 gap-4">
    <div className="space-y-1">
      <label className="text-xs font-bold uppercase text-slate-300">Media Attachment Type</label>
      <select
        name="media_type"
        value={cardMediaType}
        onChange={(e) => setCardMediaType(e.target.value as any)}
        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
      >
        <option value="none">No Media (Icon Only)</option>
        <option value="image">Image File</option>
        <option value="video">Video File</option>
      </select>
    </div>

    {cardMediaType !== 'none' && (
      <div className="space-y-1">
        <label className="text-xs font-bold uppercase text-slate-300">Upload Media File</label>
        <input
          type="file"
          name="file"
          accept={cardMediaType === 'image' ? 'image/*' : 'video/*'}
          onChange={(e) => setCardMediaFile(e.target.files?.[0] || null)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300"
        />
      </div>
    )}
  </div>

  <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
    <input
      type="checkbox"
      id="card-visibility"
      name="isVisible"
      checked={cardIsVisible}
      onChange={(e) => setCardIsVisible(e.target.checked)}
      className="rounded border-slate-800 text-amber-400 focus:ring-amber-400"
    />
    <label htmlFor="card-visibility" className="text-xs text-slate-300 font-semibold cursor-pointer">
      Display card publicly on Home page
    </label>
  </div>

  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
    <button
      type="button"
      onClick={() => setIsHomeModalOpen(false)}
      className="px-4 py-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={isSavingHomeCard}
      className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
    >
      {isSavingHomeCard ? 'Saving...' : editingHomeCard ? 'Update Card' : 'Add Card'}
    </button>
  </div>
</form>
          </div>
        </div>
      )}

      {/* MODAL POPUP 0: PUBLICATION FORM */}
      {isPubModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-serif text-amber-400">
                {editingPub ? 'Edit Academic Publication' : 'Upload Academic Publication'}
              </h3>
              <button
                onClick={() => setIsPubModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePubSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Title *</label>
                <input
                  type="text"
                  value={pubTitle}
                  onChange={(e) => setPubTitle(e.target.value)}
                  required
                  placeholder="e.g. Automated Tobacco Curing Infrastructure using IoT"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">Category *</label>
                  <select
                    value={pubCategory}
                    onChange={(e) => setPubCategory(e.target.value as PublicationItem['category'])}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Academic Papers & Journals">Academic Papers & Journals</option>
                    <option value="Books & Chapters">Books & Chapters</option>
                    <option value="Lecture Notes & Guides">Lecture Notes & Guides</option>
                    <option value="Video Lectures & Media">Video Lectures & Media</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">Author(s)</label>
                  <input
                    type="text"
                    value={pubAuthor}
                    onChange={(e) => setPubAuthor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">Journal / Publisher / Venue</label>
                  <input
                    type="text"
                    value={pubPublisher}
                    onChange={(e) => setPubPublisher(e.target.value)}
                    placeholder="e.g. IEEE / Cambridge University Press"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">Publication Date</label>
                  <input
                    type="date"
                    value={pubDate}
                    onChange={(e) => setPubDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Abstract / Description Summary</label>
                <textarea
                  rows={4}
                  value={pubAbstract}
                  onChange={(e) => setPubAbstract(e.target.value)}
                  placeholder="Provide brief context or abstract..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">External Publisher Link</label>
                  <input
                    type="url"
                    value={pubExternalLink}
                    onChange={(e) => setPubExternalLink(e.target.value)}
                    placeholder="https://doi.org/..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">
                    {editingPub ? 'Replace File Attachment (Optional)' : 'Upload PDF / Document File'}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setPubFile(e.target.files?.[0] || null)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="pub-visibility"
                  checked={pubIsVisible}
                  onChange={(e) => setPubIsVisible(e.target.checked)}
                  className="rounded border-slate-800 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="pub-visibility" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Make publication live on public site
                </label>
              </div>

              {isSavingPub && pubUploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Uploading...</span>
                    <span>{pubUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all" style={{ width: `${pubUploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPubModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPub}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
                >
                  {isSavingPub ? 'Saving to DB...' : editingPub ? 'Update Publication' : 'Save Publication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL POPUP 1: BLOG/VIDEO FORM */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-serif text-amber-400">
                {editingBlog ? 'Edit Database Blog / Video' : 'Publish New Blog / Video'}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBlogSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">Title</label>
                  <input
                    type="text"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-300">Category</label>
                  <select
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Research">Research</option>
                    <option value="Video Lecture">Video Lecture</option>
                    <option value="Reflections">Reflections</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Format</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBlogType('article')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      blogType === 'article' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Article
                  </button>
                  <button
                    type="button"
                    onClick={() => setBlogType('video')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      blogType === 'video' ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>

              {blogType === 'video' && (
                <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSource"
                        value="embed"
                        checked={videoSourceType === 'embed'}
                        onChange={() => setVideoSourceType('embed')}
                        className="text-amber-400 focus:ring-amber-400"
                      />
                      YouTube / Embed Link
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="videoSource"
                        value="file"
                        checked={videoSourceType === 'file'}
                        onChange={() => setVideoSourceType('file')}
                        className="text-amber-400 focus:ring-amber-400"
                      />
                      Upload MP4 File
                    </label>
                  </div>

                  {videoSourceType === 'embed' ? (
                    <input
                      type="url"
                      value={videoEmbedUrl}
                      onChange={(e) => setVideoEmbedUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  ) : (
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setLocalVideoFile(e.target.files?.[0] || null)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300"
                    />
                  )}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Content / Abstract</label>
                <textarea
                  rows={5}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Write body text or article content..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="blog-visibility"
                  checked={blogIsVisible}
                  onChange={(e) => setBlogIsVisible(e.target.checked)}
                  className="rounded border-slate-800 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="blog-visibility" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Make entry live on public site
                </label>
              </div>

              {isPublishing && blogUploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Saving...</span>
                    <span>{blogUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all" style={{ width: `${blogUploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
                >
                  {isPublishing ? 'Saving to DB...' : editingBlog ? 'Update Post' : 'Publish Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL POPUP 2: RESOURCE TOOLKIT FORM */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-serif text-amber-400">
                {editingResource ? 'Edit Practice Toolkit' : 'Upload Practice Toolkit'}
              </h3>
              <button
                onClick={() => setIsResourceModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResourceSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Toolkit Title *</label>
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  required
                  placeholder="e.g. Assessment Framework Template"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Category</label>
                <select
                  value={resourceCategory}
                  onChange={(e) => setResourceCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Practice Templates">Practice Templates</option>
                  <option value="Legal & Policy Guides">Legal & Policy Guides</option>
                  <option value="Research Papers">Research Papers</option>
                  <option value="Checklists">Checklists</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">
                  {editingResource ? 'Replace Attached File (Optional)' : 'Select PDF / Document File *'}
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300"
                />
              </div>

              <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="resource-visibility"
                  checked={resourceIsVisible}
                  onChange={(e) => setResourceIsVisible(e.target.checked)}
                  className="rounded border-slate-800 text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="resource-visibility" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Allow public download on website
                </label>
              </div>

              {isUploading && resourceUploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Uploading file...</span>
                    <span>{resourceUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all" style={{ width: `${resourceUploadProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
                >
                  {isUploading ? 'Uploading...' : editingResource ? 'Update Toolkit' : 'Upload Toolkit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL POPUP 3: CREATE LIVE STREAM */}
      {isStreamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-serif text-amber-400">Create Live Session Room</h3>
              <button
                onClick={() => setIsStreamModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStream} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Session Title *</label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  required
                  placeholder="e.g. SWAB Q&A Webinar"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Provide brief broadcast summary..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Meeting / Stream URL *</label>
                <input
                  type="url"
                  value={streamMeetingUrl}
                  onChange={(e) => setStreamMeetingUrl(e.target.value)}
                  required
                  placeholder="https://meet.jit.si/... or YouTube Stream URL"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-300">Scheduled Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={streamScheduledAt}
                  onChange={(e) => setStreamScheduledAt(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsStreamModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingStream}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
                >
                  {isCreatingStream ? 'Creating...' : 'Launch Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL POPUP 4: LOGOUT CONFIRMATION */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center text-xl mx-auto border border-rose-500/20">
              🚪
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sign Out of Control Center?</h3>
              <p className="text-xs text-slate-400 mt-1">
                You will need to re-authenticate to manage database content and live chats.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED LIVE CALL OVERLAY */}
      {activeCallUrl && (
        <LiveRoomModal
          roomUrl={activeCallUrl}
          onClose={() => setActiveCallUrl(null)}
        />
      )}
    </section>
  );
}
