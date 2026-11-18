import React, { useMemo, useState } from 'react';
import {
  ArrowRight, BookOpen, Search, Microscope, Globe2, BriefcaseBusiness,
  Headphones, LibraryBig, Lightbulb, FileText, Users, Sparkles,
  ChevronRight, ExternalLink, GraduationCap, MessageCircle, ShieldCheck
} from 'lucide-react';

type KnowledgeHubProps = {
  setActivePage: (page: string) => void;
};

const knowledgeSections = [
  {
    id: 'practice-articles',
    number: '01',
    icon: BookOpen,
    eyebrow: 'Reflect • Question • Develop',
    title: 'Practice Articles & Perspectives',
    short: 'Ideas and experiences that encourage thoughtful, reflective social work.',
    description:
      'Professional reflection is central to effective social work practice. This section brings together articles, opinion pieces and reflective discussions exploring contemporary social work issues, professional development, workforce experiences and lessons from practice across different countries.',
    purpose:
      'Through shared perspectives, SWAB aims to promote critical thinking, learning and professional growth.',
    examples: ['Articles on contemporary social work issues', 'Opinion pieces and professional perspectives', 'Reflective discussions and lessons from practice', 'Workforce experiences from different countries'],
  },
  {
    id: 'research',
    number: '02',
    icon: Microscope,
    eyebrow: 'Evidence • Insight • Application',
    title: 'Research Reviews & Practice Insights',
    short: 'Making research meaningful and useful in everyday practice.',
    description:
      'Social work is strongest when informed by evidence. This section reviews and summarises relevant research, helping practitioners translate academic findings into meaningful and practical learning.',
    purpose:
      'Rather than focusing solely on research findings, SWAB explores what the evidence means for social work practice and how it can improve outcomes for children, families and communities.',
    examples: ['Accessible summaries of relevant research', 'Practice insights drawn from academic findings', 'Discussion of implications for frontline practice', 'Evidence-informed learning for better outcomes'],
  },
  {
    id: 'international-perspectives',
    number: '03',
    icon: Globe2,
    eyebrow: 'Compare • Connect • Learn',
    title: 'International Perspectives',
    short: 'Learning across countries, systems, cultures and communities.',
    description:
      'One of SWAB’s founding principles is that valuable learning exists across all social work systems. This section explores practice approaches, legislation, safeguarding frameworks and workforce experiences from different countries.',
    purpose:
      'By sharing international perspectives, SWAB encourages cross-border learning and a deeper understanding of international social work.',
    examples: ['Social work approaches across countries', 'Legislation and policy frameworks', 'Safeguarding systems and practice', 'Workforce experiences and cross-border learning'],
  },
  {
    id: 'resources',
    number: '04',
    icon: BriefcaseBusiness,
    eyebrow: 'Practical • Accessible • Useful',
    title: 'Toolkits & Practice Resources',
    short: 'Practical materials to support day-to-day practice and professional development.',
    description:
      'This section is designed to provide practical resources that social workers can use in their day-to-day practice and professional development.',
    purpose:
      'As the platform grows, resources may include interview preparation guides, transition resources, probation support materials, assessment-writing guidance, reflective practice tools and professional development resources designed to strengthen confidence and competence.',
    examples: ['Interview preparation guides', 'International transition resources', 'Probation support materials', 'Assessment-writing guidance', 'Reflective practice tools', 'Professional development resources'],
    developing: true,
  },
  {
    id: 'podcasts',
    number: '05',
    icon: Headphones,
    eyebrow: 'Listen • Discuss • Share',
    title: 'Podcasts, Webinars & Professional Conversations',
    short: 'Learning through the voices and experiences of the social work profession.',
    description:
      'Learning often happens through meaningful conversation. This section brings together podcasts, recorded webinars, interviews and professional discussions featuring social workers, managers, educators, researchers and individuals with lived experience.',
    purpose:
      'These conversations explore practice challenges, emerging issues and professional experiences from across the social work profession.',
    examples: ['Podcasts and recorded webinars', 'Interviews with social work professionals', 'Professional discussions and conversations', 'Perspectives from people with lived experience'],
  },
  {
    id: 'publications',
    number: '06',
    icon: LibraryBig,
    eyebrow: 'Read • Reference • Contribute',
    title: 'Publications',
    short: 'Original work and resources that contribute to professional learning.',
    description:
      'This section showcases books, reports, guides, conference materials and other significant publications produced by SWAB and its contributors.',
    purpose:
      'As the platform develops, it will become a home for original work that contributes to professional learning, knowledge exchange and practice improvement.',
    examples: ['Books and reports', 'Professional guides', 'Conference materials', 'Significant publications by SWAB and contributors'],
    developing: true,
  },
];

const principles = [
  {
    icon: Lightbulb,
    title: 'Knowledge made accessible',
    text: 'Bringing together research, practice wisdom and professional learning in ways that are relevant to social workers across different systems, cultures and communities.',
  },
  {
    icon: Users,
    title: 'Learning from one another',
    text: 'Valuing professional reflection, shared experience, lived experience and the perspectives of practitioners, educators, researchers and leaders.',
  },
  {
    icon: ShieldCheck,
    title: 'Practice with purpose',
    text: 'Strengthening confidence, competence and professional effectiveness, with children, families and communities at the centre.',
  },
];

export default function KnowledgeHubSection({ setActivePage }: KnowledgeHubProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return knowledgeSections;
    return knowledgeSections.filter((section) =>
      [section.title, section.short, section.description, ...section.examples]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [searchTerm]);

  const openSection = (id: string) => {
    setActivePage(id);
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-800">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#10243a] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-36 -top-40 h-[32rem] w-[32rem] rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" /> Learning • Research • Shared practice
            </div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-amber-300">
              Social Work Across Borders
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              The Knowledge Hub
              <span className="mt-2 block text-amber-300">Knowledge that supports practice.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">
              Developing knowledgeable, confident and effective social work practitioners across borders.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              The SWAB Knowledge Hub brings together research, practice wisdom, professional learning resources and international perspectives to support social workers throughout their careers. Our aim is to make knowledge accessible, practical and relevant to social workers working across different systems, cultures and communities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => document.getElementById('knowledge-collections')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4e00]"
              >
                Explore the collections <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => openSection('publications')}
                className="rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse publications
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/25 to-sky-400/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/15 bg-white p-6 text-center shadow-2xl sm:p-8">
              <img src="/logo2.png" alt="Social Work Across Borders logo" className="mx-auto h-36 w-36 object-contain sm:h-44 sm:w-44" />
              <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#e85d04]" />
              <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#e85d04]">Knowledge • Practice • Progress</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#10243a] sm:text-3xl">
                Learn from evidence.
                <span className="block text-[#e85d04]">Grow through exchange.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-600">
                Research, reflection and lived experience — brought together to strengthen practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">About the Knowledge Hub</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-4xl">
              Bringing knowledge and practice together.
            </h2>
            <div className="mt-6 h-1 w-16 rounded-full bg-[#e85d04]" />
          </div>
          <div className="space-y-4 text-base leading-8 text-slate-600">
            <p>
              Social work practice is strengthened when professional experience, research, reflection and learning inform one another. Social workers work across different systems, cultures and communities, and access to relevant knowledge can help practitioners make sense of new challenges and develop their practice.
            </p>
            <p>
              The SWAB Knowledge Hub is designed to bring these sources of knowledge together in one accessible space. It supports learning throughout a social worker’s career and encourages the exchange of ideas, experiences and perspectives across borders.
            </p>
            <p className="font-semibold text-[#10243a]">
              By combining research, practice wisdom, professional reflection and lived experience, the Knowledge Hub aims to strengthen confidence, competence and professional effectiveness.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-amber-300">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-[#10243a]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section id="knowledge-collections" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Explore the Knowledge Hub</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
              Six collections. One shared purpose.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Explore professional perspectives, research, international learning, practical resources, conversations and publications.
            </p>
          </div>

          <div className="mx-auto mb-8 max-w-xl">
            <label htmlFor="knowledge-search" className="sr-only">Search Knowledge Hub collections</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                id="knowledge-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Find a collection or resource type..."
                className="w-full rounded-xl border border-slate-200 bg-[#f8fafc] py-4 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#e85d04] focus:ring-4 focus:ring-orange-100"
              />
            </div>
            {searchTerm && <p className="mt-2 text-center text-xs text-slate-500">{filteredSections.length} of 6 collections match your search.</p>}
          </div>

          {filteredSections.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredSections.map(({ id, number, icon: Icon, eyebrow, title, short, examples, developing }) => (
                <article key={id} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-[#fbfcfe] p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-amber-300">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-xs font-extrabold tracking-[.18em] text-[#e85d04]">{number}</span>
                  </div>
                  <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">{eyebrow}</p>
                  <h3 className="mt-2 text-xl font-extrabold leading-snug text-[#10243a]">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{short}</p>
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#10243a]">Explore this collection</p>
                    <ul className="space-y-2">
                      {examples.slice(0, 4).map((example) => (
                        <li key={example} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e85d04]" />{example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {developing && (
                    <p className="mt-4 inline-flex w-fit rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-800">
                      Developing collection
                    </p>
                  )}
                  <button onClick={() => openSection(id)} className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-extrabold text-[#e85d04] transition group-hover:gap-3">
                    Explore details <ArrowRight className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-[#f8fafc] px-6 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-slate-400" />
              <p className="mt-3 font-bold text-[#10243a]">No matching collections</p>
              <p className="mt-1 text-sm text-slate-500">Try another search term.</p>
              <button onClick={() => setSearchTerm('')} className="mt-4 text-sm font-bold text-[#e85d04]">Clear search</button>
            </div>
          )}
        </div>
      </section>

      {/* COLLECTION DETAILS */}
      <section className="bg-[#f5f7fa] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Inside the collections</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
              Knowledge for different stages of practice.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Each collection has a distinct role in supporting professional learning, knowledge exchange and practice improvement.
            </p>
          </div>

          <div className="space-y-5">
            {knowledgeSections.map(({ id, number, icon: Icon, title, eyebrow, description, purpose, examples, developing }) => (
              <article id={id} key={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:p-7">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10243a] text-amber-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#e85d04]">Collection {number} · {eyebrow}</p>
                    <h3 className="mt-1 text-xl font-extrabold text-[#10243a] sm:text-2xl">{title}</h3>
                  </div>
                  {developing && <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold text-amber-800">Developing collection</span>}
                </div>
                <div className="grid gap-7 p-6 sm:p-7 lg:grid-cols-[1.1fr_.9fr]">
                  <div>
                    <p className="text-sm leading-7 text-slate-600">{description}</p>
                    <div className="mt-5 rounded-xl bg-[#f5f7fa] p-4">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-[#10243a]">Our aim</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{purpose}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#10243a]">What you may find here</p>
                    <ul className="space-y-3">
                      {examples.map((example) => (
                        <li key={example} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600">
                          <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#e85d04]" />{example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="bg-[#10243a] px-5 py-16 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] border border-white/10 bg-white/[.05] px-6 py-12 text-center sm:px-12 sm:py-14">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">Social Work Across Borders</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Knowledge grows when it is shared.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200">
            The SWAB Knowledge Hub brings research, practice wisdom, professional reflection and lived experience into conversation — supporting social workers to learn, develop and improve practice across borders.
          </p>
          <button
            onClick={() => setActivePage('contact')}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#e85d04] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#cf4e00]"
          >
            Connect with SWAB <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-6 text-slate-400">
          Empowering social workers through knowledge, preparation and support to thrive across borders and improve outcomes for children, families and communities.
        </p>
      </section>
    </main>
  );
}
