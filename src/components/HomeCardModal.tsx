'use client';

import React, { useState, useEffect } from 'react';
import { HomePillarCard } from '@/src/types/home';

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
      setDesc(editingCard.desc || '');
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-slate-100">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold font-serif text-amber-400">
            {editingCard ? 'Edit Home Page Card' : 'Add New Home Page Card'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold uppercase text-slate-300">Card Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Community Health Initiatives"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-300">Icon / Emoji</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="📖, 🌐, 🎙️"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-300">Short Description *</label>
            <textarea
              rows={2}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief summary of this pillar or featured story..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-slate-300">Target Section / Page Link</label>
              <select
                value={linkPage}
                onChange={(e) => setLinkPage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
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
              <label className="text-xs font-bold uppercase text-slate-300">Media Display Mode</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as 'none' | 'image' | 'video')}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="none">Icon Only</option>
                <option value="image">Upload / Show Picture</option>
                <option value="video">Upload / Embed Video</option>
              </select>
            </div>
          </div>

          {mediaType !== 'none' && (
            <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-bold text-amber-400 uppercase">
                  Upload Media File ({mediaType === 'image' ? 'Image' : 'Video'})
                </label>
                <input
                  type="file"
                  accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-slate-400">
                  Or External Embed / URL ({mediaType === 'image' ? 'Image URL' : 'YouTube / MP4 URL'})
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-slate-300">Featured Narrative / Story Text (Optional)</label>
            <textarea
              rows={3}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Add extended story text or quote to be highlighted inside the card..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              id="card-visibility"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="rounded border-slate-800 text-amber-400 focus:ring-amber-400"
            />
            <label htmlFor="card-visibility" className="text-xs text-slate-300 font-semibold cursor-pointer">
              Make card visible on public Home Page
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition cursor-pointer"
            >
              {isSaving ? 'Saving...' : editingCard ? 'Update Card' : 'Save Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}