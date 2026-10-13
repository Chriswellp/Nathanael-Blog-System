import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import { createClient } from '@/lib/supabase/client';
import Home from './components/Home';
import AboutSection from './components/AboutSection';
import SwabHubSection from './components/SwabHubSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import PublicationsSection from '@/components/PublicationsSection';
const supabase = createClient();

export default function App() {
  const [activePage, setActivePage] = useState('home')

  return (
    <div className="min-h-screen flex flex-col font-sans bg-swab-bgLight">
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      <main className="flex-1">
        {activePage === 'home' && <Home setActivePage={setActivePage} />}
        {activePage === 'about' && (
          <div className="max-w-7xl mx-auto p-12 text-center text-swab-navy font-serif text-2xl">
            About Section Module
          </div>
        )}
        {activePage === 'swab' && (
          <div className="max-w-7xl mx-auto p-12 text-center text-swab-navy font-serif text-2xl">
            SWAB Hub & System Comparison Engine
          </div>
        )}
        {activePage === 'blog' && (
          <div className="max-w-7xl mx-auto p-12 text-center text-swab-navy font-serif text-2xl">
            Searchable Blog & Article Feed
          </div>
        )}
        {activePage === 'contact' && (
          <div className="max-w-7xl mx-auto p-12 text-center text-swab-navy font-serif text-2xl">
            Contact & Booking Forms
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-swab-navy text-white border-t border-swab-gold/30 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-400 space-y-2">
          <p>© {new Date().getFullYear()} Nathanael Maradza. All rights reserved.</p>
          <p className="text-swab-gold font-medium">Social Work Across Borders (SWAB)</p>
        </div>
      </footer>
    </div>
  )
}