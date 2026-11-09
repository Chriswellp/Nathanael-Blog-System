'use client';

import React, { useState, useEffect } from 'react';

export interface HomePillarCard {
  id?: string;
  title: string;
  desc?: string;
  description?: string;
  icon?: string;
  link_page?: string;
  link_anchor?: string;
  is_visible?: boolean;
  media_type?: 'none' | 'image' | 'video';
  media_url?: string;
  story_text?: string;
  [key: string]: any;
}

interface HomeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Partial<HomePillarCard>, mediaFile?: File | null) => Promise<void>;
  editingCard?: HomePillarCard | null;
  isSaving: boolean;
}

export default function HomeCardModal({
  isOpen,
  onClose,
  onSave,
  editingCard,
  isSaving,
}: HomeCardModalProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('📖');
  const [linkPage, setLinkPage] = useState('blog');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [mediaUrl, setMediaUrl] = useState('');
  const [storyText, setStoryText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (editingCard) {
      setTitle(editingCard.title || '');
      setDesc(editingCard.desc || editingCard.description || '');
      setIcon(editingCard.icon || '📖');
      setLinkPage(editingCard.link_page || 'blog');
      setMediaType(editingCard.media_type || 'none');
      setMediaUrl(editingCard.media_url || '');
      setStoryText(editingCard.story_text || '');
      setIsVisible(editingCard.is_visible ?? true);
      setMediaFile(null);
    } else {
      setTitle('');
      setDesc('');
      setIcon('📖');
      setLinkPage('blog');
      setMediaType('none');
      setMediaUrl('');
      setStoryText('');
      setIsVisible(true);
      setMediaFile(null);
    }
  }, [editingCard, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(
      {
        id: editingCard?.id,
        title,
        desc,
        icon,
        link_page: linkPage,
        media_type: mediaType,
        media_url: mediaUrl,
        story_text: storyText,
        is_visible: isVisible,
      },
      mediaFile
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#10243a]/75 p-3 backdrop-blur-sm sm:p-6">
      <div className="max-h-[92vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 text-slate-800 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e85d04]">SWAB website editor</p>
            <h3 className="text-xl font-extrabold tracking-tight text-[#10243a]">
            {editingCard ? 'Edit Home Page Card' : 'Add New Home Page Card'}
            </h3>
          </div>
          <button onClick={onClose} aria-label="Close card editor" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Card Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Community Health Initiatives"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Icon / Emoji</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="📖, 🌐, 🎙️"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Short Description *</label>
            <textarea
              rows={2}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief summary of this pillar or featured story..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Target Section / Page Link</label>
              <select
                value={linkPage}
                onChange={(e) => setLinkPage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
              >
                <option value="blog">Reflections & Blog</option>
                <option value="swab">Comparing Systems (SWAB)</option>
                <option value="speaking">Talks & Conversations</option>
                <option value="publications">Research & Publications</option>
                <option value="resources">Children & Families Toolkit</option>
                <option value="contact">Contact & Booking</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Media Display Mode</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as 'none' | 'image' | 'video')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
              >
                <option value="none">Icon Only</option>
                <option value="image">Upload / Show Picture</option>
                <option value="video">Upload / Embed Video</option>
              </select>
            </div>
          </div>

          {mediaType !== 'none' && (
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#e85d04]">
                  Upload Media File ({mediaType === 'image' ? 'Image' : 'Video'})
                </label>
                <input
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Or External Embed / URL ({mediaType === 'image' ? 'Image URL' : 'YouTube / MP4 URL'})
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Featured Narrative / Story Text (Optional)</label>
            <textarea
              rows={3}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Add extended story text or quote to be highlighted inside the card..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:border-[#e85d04] focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="card-visibility"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="rounded border-slate-300 text-[#e85d04] focus:ring-[#e85d04]"
            />
            <label htmlFor="card-visibility" className="text-xs text-slate-600 font-semibold cursor-pointer">
              Make card visible on public Home Page
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#e85d04] hover:bg-[#d94f00] text-white transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editingCard ? 'Update Card' : 'Save Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
