import React, { useState } from 'react';
import { 
  BookOpen, 
  Globe, 
  Users, 
  MessageSquare, 
  Search, 
  HeartHandshake, 
  Lightbulb, 
  Share2, 
  Heart, 
  TrendingUp, 
  Mail,
  ChevronDown,
  Briefcase,
  HelpCircle,
  Compass,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function SwabHubSection({ 
  setActivePage 
}: { 
  setActivePage: (page: string) => void; 
}) {
  // State for controlling active accordion dropdowns
  const [openDropdown, setOpenDropdown] = useState<string | null>('consultancy');

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const focusAreas = [
    {
      title: 'REFLECTIONS & BLOGS',
      description: 'Penning down practice and professional reflections',
      icon: BookOpen,
    },
    {
      title: 'COMPARING SYSTEMS',
      description: 'Comparisons of legislation, policy and practice across different countries',
      icon: Globe,
    },
    {
      title: 'LEARNING & EXCHANGE',
      description: 'Learning from different countries, cultures and approaches',
      icon: Users,
    },
    {
      title: 'TALKS & CONVERSATIONS',
      description: 'Discussions with social workers, researchers and experts',
      icon: MessageSquare,
    },
    {
      title: 'RESEARCH & KNOWLEDGE',
      description: 'Research, evidence, insights and innovative practice',
      icon: Search,
    },
    {
      title: 'CHILDREN, FAMILIES & SAFEGUARDING',
      description: 'Putting children, young people and families at the heart',
      icon: HeartHandshake,
    },
  ];

  const coreValues = [
    { title: 'COLLABORATE', icon: Users },
    { title: 'LEARN', icon: Lightbulb },
    { title: 'SHARE', icon: Share2 },
    { title: 'INSPIRE', icon: Heart },
    { title: 'TRANSFORM', icon: TrendingUp },
  ];

  const comparisonData = [
    {
      topic: 'Safeguarding & Child Protection Framework',
      uk: 'Statutory framework driven by Working Together to Safeguard Children and Children Acts (1989/2004). Local Authority-led multi-agency safeguarding hubs (MASH).',
      africa: 'Community-centric child protection structures blended with national statutory acts. Focus on extended family networks and community child protection committees.',
    },
    {
      topic: 'Legislative Mandate & Early Intervention',
      uk: 'Threshold-based assessment models (Child in Need vs. Child Protection Plan). High reliance on formal statutory interventions.',
      africa: 'Prevention and family support anchored in traditional structures, non-governmental organizations (NGOs), and localized social support systems.',
    },
    {
      topic: 'Cross-Border Collaboration',
      uk: 'International casework managed via ICACU and Hague Convention protocols.',
      africa: 'Regional protocols managed via African Charter on the Rights and Welfare of the Child (ACRWC) and cross-border bilateral agreements.',
    },
  ];

  const dropdownSections = [
    {
      id: 'consultancy',
      title: 'Consultancy Services',
      subtitle: 'Expert cross-border advisory, training, and strategic safeguarding evaluations',
      icon: Briefcase,
      content: (
        <div className="space-y-6 pt-2">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            We deliver tailored, expert consultancy to statutory agencies, non-governmental organizations (NGOs), educational institutions, and international bodies seeking to bridge social work practice across borders.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-[#f7f4ed] p-4 sm:p-5 rounded-xl border border-[#cca352]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#0b1b36] font-bold text-xs sm:text-sm font-serif">
                <CheckCircle2 className="w-4 h-4 text-[#cca352] shrink-0" />
                Cross-Border Safeguarding & Casework Advising
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Specialized guidance on complex international child welfare cases, family reunification, and multi-agency legal coordination.
              </p>
            </div>

            <div className="bg-[#f7f4ed] p-4 sm:p-5 rounded-xl border border-[#cca352]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#0b1b36] font-bold text-xs sm:text-sm font-serif">
                <CheckCircle2 className="w-4 h-4 text-[#cca352] shrink-0" />
                System Policy Alignment & Comparative Audits
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Auditing organizational frameworks against international statutes, the UNCRC, and regional child welfare conventions.
              </p>
            </div>

            <div className="bg-[#f7f4ed] p-4 sm:p-5 rounded-xl border border-[#cca352]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#0b1b36] font-bold text-xs sm:text-sm font-serif">
                <CheckCircle2 className="w-4 h-4 text-[#cca352] shrink-0" />
                Workforce Training & Capacity Building
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Delivering workshops on culturally responsive practice, trauma-informed care across diverse migrant backgrounds, and anti-oppressive social work.
              </p>
            </div>

            <div className="bg-[#f7f4ed] p-4 sm:p-5 rounded-xl border border-[#cca352]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#0b1b36] font-bold text-xs sm:text-sm font-serif">
                <CheckCircle2 className="w-4 h-4 text-[#cca352] shrink-0" />
                Keynote Address & Panel Moderation
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Thought leadership presentations for global academic conferences, governmental symposia, and social work practice forums.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'why_we_help',
      title: 'Why We Help',
      subtitle: 'Driven by systemic equity, global learning, and child-centered protection',
      icon: HelpCircle,
      content: (
        <div className="space-y-4 pt-2">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            Children, young people, and vulnerable families do not live in isolated silos—migration, displacement, and cultural exchange require social work systems that can communicate effectively across borders.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-1.5">
              <span className="text-[#cca352] font-bold text-lg font-serif">01.</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0b1b36]">Closing Systems Gaps</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Preventing children from slipping through procedural cracks when moving between international legal jurisdictions.
              </p>
            </div>

            <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-1.5">
              <span className="text-[#cca352] font-bold text-lg font-serif">02.</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0b1b36]">Shared Intelligence</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Leveraging grassroots community wisdom from African systems together with Western statutory rigor to improve practice.
              </p>
            </div>

            <div className="border border-slate-200 p-4 rounded-xl bg-slate-50 space-y-1.5">
              <span className="text-[#cca352] font-bold text-lg font-serif">03.</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#0b1b36]">Culturally Grounded Care</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Ensuring assessments respect kinship networks, diaspora experiences, and indigenous community protective factors.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'how_we_do_it',
      title: 'How We Do It',
      subtitle: 'A structured, 4-step collaborative exchange methodology',
      icon: Compass,
      content: (
        <div className="space-y-4 pt-2">
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
            We operationalize our mission through a rigorous, transparent methodology designed to deliver actionable insights and sustainable reform.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#0b1b36] text-white p-4 rounded-xl space-y-2 border-t-4 border-[#cca352]">
              <span className="text-xs font-bold text-[#cca352] tracking-widest uppercase">Step 1</span>
              <h5 className="font-bold text-sm font-serif">Assess & Map</h5>
              <p className="text-slate-300 text-xs leading-snug">
                Conducting comparative baseline reviews of legislative statutes, local policies, and practical thresholds.
              </p>
            </div>

            <div className="bg-[#0b1b36] text-white p-4 rounded-xl space-y-2 border-t-4 border-[#cca352]">
              <span className="text-xs font-bold text-[#cca352] tracking-widest uppercase">Step 2</span>
              <h5 className="font-bold text-sm font-serif">Bridge & Convene</h5>
              <p className="text-slate-300 text-xs leading-snug">
                Facilitating multi-agency exchanges, expert panels, and direct dialogue between international practitioners.
              </p>
            </div>

            <div className="bg-[#0b1b36] text-white p-4 rounded-xl space-y-2 border-t-4 border-[#cca352]">
              <span className="text-xs font-bold text-[#cca352] tracking-widest uppercase">Step 3</span>
              <h5 className="font-bold text-sm font-serif">Implement & Adapt</h5>
              <p className="text-slate-300 text-xs leading-snug">
                Co-designing contextually adapted toolkits, training programs, and safeguarding policy guides.
              </p>
            </div>

            <div className="bg-[#0b1b36] text-white p-4 rounded-xl space-y-2 border-t-4 border-[#cca352]">
              <span className="text-xs font-bold text-[#cca352] tracking-widest uppercase">Step 4</span>
              <h5 className="font-bold text-sm font-serif">Evaluate Impact</h5>
              <p className="text-slate-300 text-xs leading-snug">
                Measuring outcomes to ensure improved child protection standards and long-term practice sustainability.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-[#f7f4ed] text-slate-900 py-12 sm:py-16 selection:bg-[#cca352] selection:text-[#0b1b36] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* ================= POSTER HEADER ================= */}
        <div className="relative text-center max-w-4xl mx-auto space-y-4 pt-4">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            {/* Logo Section */}
            <div className="inline-block relative">
              <img 
                src="/logo2.png" 
                alt="Social Work Across Borders Logo" 
                className="w-36 h-36 max-w-none object-cover transform scale-125 mx-auto pointer-events-none" 
              />
              <div className="w-24 h-1 bg-[#cca352] mx-auto my-3 rounded-full" />
              <div className="flex items-center justify-center text-[#0b1b36]">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#0b1b36] tracking-wider uppercase">
              Social Work <span className="text-[#cca352]">Across Borders</span>
            </h2>

            {/* Tagline / Subtitle */}
            <p className="text-xs sm:text-sm font-bold text-slate-700 tracking-widest uppercase leading-relaxed border-y border-[#cca352]/40 py-2">
              Connecting Practice, Research and Lived Experience Across Borders.
            </p>

            {/* Section Pill Divider */}
            <div className="pt-2">
              <span className="inline-block bg-[#0b1b36] text-[#cca352] font-bold text-xs sm:text-sm px-8 py-2 rounded-full tracking-widest uppercase shadow-md border border-[#cca352]/30">
                Our Focus Areas
              </span>
            </div>
          </div>
        </div>

        {/* ================= FOCUS AREAS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
          {focusAreas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-[#0b1b36] text-[#cca352] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xs text-[#0b1b36] tracking-wider uppercase mb-2 min-h-[32px] flex items-center justify-center">
                  {area.title}
                </h3>
                <div className="w-8 h-0.5 bg-[#cca352] mb-3" />
                <p className="text-[11px] text-slate-600 leading-snug font-sans">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ================= CLASSIC DROPDOWNS SECTION ================= */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0b1b36] uppercase tracking-wider">
              Strategic Framework & Solutions
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Click each dropdown to explore how we deliver value across international social work systems.
            </p>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            {dropdownSections.map((sec) => {
              const Icon = sec.icon;
              const isOpen = openDropdown === sec.id;

              return (
                <div 
                  key={sec.id}
                  className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleDropdown(sec.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        isOpen ? 'bg-[#0b1b36] text-[#cca352]' : 'bg-slate-100 text-[#0b1b36]'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-[#0b1b36] tracking-wide">
                          {sec.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-sans mt-0.5">
                          {sec.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#cca352] border-[#cca352] text-[#0b1b36]' : 'border-slate-300 text-slate-600'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 border-t border-slate-100 animate-in fade-in duration-200">
                      {sec.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= MIDDLE BANNER ================= */}
        <div className="bg-[#0b1b36] rounded-2xl p-6 sm:p-8 border-2 border-[#cca352] text-white flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-full border-2 border-[#cca352] flex items-center justify-center shrink-0 bg-[#071326] shadow-inner">
            <Globe className="w-10 h-10 text-[#cca352]" />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#cca352] tracking-wider uppercase">
              Different Countries. Shared Purpose.
            </h3>
            <p className="text-base sm:text-lg font-serif italic text-slate-200">
              Better outcomes for children and families.
            </p>
          </div>
        </div>

        {/* ================= VALUES BAR ================= */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 items-center text-center">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div key={idx} className="flex flex-col items-center justify-center p-2 group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#0b1b36] group-hover:text-[#cca352] text-[#0b1b36] flex items-center justify-center transition-colors mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#0b1b36] tracking-wider uppercase">
                    {val.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= COMPARATIVE MATRIX ================= */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden">
          <div className="bg-[#0b1b36] text-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-[#cca352]">
            <div>
              <h2 className="text-xl font-bold font-serif text-[#cca352]">
                System Comparative Matrix
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Juxtaposition of legal statutes, risk thresholds, and field practice models.
              </p>
            </div>
            <span className="bg-[#071326] text-[#cca352] text-xs font-semibold px-3 py-1.5 rounded-md border border-[#cca352]/40">
              Africa ↔ United Kingdom
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {comparisonData.map((item, idx) => (
              <div key={idx} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0 space-y-3">
                <h3 className="font-serif font-bold text-[#0b1b36] text-base sm:text-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#cca352]" />
                  {item.topic}
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-xs sm:text-sm pt-1">
                  <div className="bg-[#f8f9fa] p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block font-bold text-[#0b1b36] text-xs uppercase tracking-wider mb-2">
                      🇬🇧 United Kingdom Framework
                    </span>
                    <p className="text-slate-600 leading-relaxed">{item.uk}</p>
                  </div>
                  <div className="bg-[#f8f9fa] p-4 rounded-xl border border-slate-200 shadow-sm">
                    <span className="block font-bold text-[#0b1b36] text-xs uppercase tracking-wider mb-2">
                      🌍 African Systems Framework
                    </span>
                    <p className="text-slate-600 leading-relaxed">{item.africa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CONTACT BANNER ================= */}
        <div className="bg-[#0b1b36] text-white p-6 sm:p-8 rounded-2xl border-2 border-[#cca352] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#cca352] text-[#0b1b36] flex items-center justify-center shrink-0 shadow-lg">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#cca352] tracking-wide uppercase">
                Interested in the conversations?
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm mt-0.5">
                Contact us on <span className="font-bold text-white">+447352143182</span>
              </p>
              <p className="text-xs italic text-[#cca352] mt-1 font-serif">
                Let's chat! 👍
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('contact')}
            className="bg-[#cca352] hover:bg-[#d9b260] text-[#0b1b36] font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Contact Us
          </button>
        </div>

      </div>
    </section>
  );
}