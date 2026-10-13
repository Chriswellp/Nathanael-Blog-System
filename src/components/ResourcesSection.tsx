'use client';

import React, { useState, useEffect } from 'react';

interface ResourcesSectionProps {
  _setActivePage?: (page: string) => void;
}

interface ResourceItem {
  id: string | number;
  title: string;
  category: string;
  file_type?: string;
  file_size?: string;
  description?: string;
  file_url: string;
  is_visible?: boolean;
  created_at?: string;
}

export default function ResourcesSection({ _setActivePage }: ResourcesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = [
    'All',
    'Safeguarding Frameworks',
    'Practice Templates',
    'Policy Cheat-Sheets',
    'Academic Toolkits',
  ];

  // Fetch real database records from Supabase
  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch('/api/resources');
        const data = await res.json();

        // Updated check: Handle array directly or fallback object key safely
        if (res.ok) {
          const resourceList = Array.isArray(data) ? data : data.resources || [];
          // Filter out hidden items for public view if is_visible is false
          const visibleResources = resourceList.filter((r: ResourceItem) => r.is_visible !== false);
          setResources(visibleResources);
        } else {
          console.error('Failed to fetch resources:', data.error || data);
        }
      } catch (err) {
        console.error('Network error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  const filteredResources = resources.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-slate-100 py-12 sm:py-16 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-amber-600 text-xs font-bold tracking-wider uppercase font-sans">
            Practitioner Tools & Downloadable Assets
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-1 mb-3">
            Resource Hub
          </h1>
          <div className="w-20 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Access practice toolkits, legal comparative matrices, assessment templates, and safeguarding policy guides authored by Nathanael Maradza.
          </p>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search resources by title, topic, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
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

        {/* Resource Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-semibold text-sm">
              Loading resources...
            </div>
          ) : filteredResources.length > 0 ? (
            filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px] uppercase">
                      {item.file_type || 'FILE'} • {item.file_size || 'N/A'}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold font-serif text-slate-900 leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <a
                    href={item.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="bg-slate-950 text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    Download {(item.file_type || 'File').toUpperCase()} ↓
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
              No downloadable resources found matching your search term.
            </div>
          )}
        </div>

        {/* Request Callout */}
        <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-xl border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-amber-400">
              Need a Customized Assessment Template?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm">
              Nathanael regularly develops tailored safeguarding protocols and agency toolkits upon request.
            </p>
          </div>
          <a
            href="https://wa.me/447352143182"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition whitespace-nowrap shadow"
          >
            💬 Request Custom Toolkit
          </a>
        </div>

      </div>
    </section>
  );
}