import React, { useEffect } from 'react';
import {
  ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, ClipboardCheck,
  Compass, GraduationCap, Globe2, HeartHandshake, MessageCircle, ShieldCheck,
  Sparkles, Users, UserRoundCheck
} from 'lucide-react';

type Props = {
  setActivePage: (page: string) => void;
  activeSection?: string;
};

const focus = [
  [BookOpen, 'Professional Reflection', 'Reflecting on practice experiences, professional challenges and lessons learned to strengthen social work knowledge, confidence and effectiveness.'],
  [Globe2, 'International Social Work Practice', 'Exploring social work systems, legislation, policy, safeguarding frameworks and professional practice across different countries and cultures.'],
  [GraduationCap, 'Learning & Career Development', 'Supporting social workers through professional development, career progression, relocation preparation, training and lifelong learning opportunities.'],
  [MessageCircle, 'Voices from Practice', 'Sharing the experiences, insights and perspectives of social workers, leaders, educators, researchers and people with lived experience.'],
  [ClipboardCheck, 'Research & Best Practice', 'Promoting evidence-informed social work through research, innovation, critical thinking and the sharing of best practice.'],
  [ShieldCheck, 'Children, Families & Safeguarding', 'Championing strengths-based, child-centred and family-focused approaches that improve safety, wellbeing and long-term outcomes.']
] as const;

const pathways = [
  {
    id: 'relocation', no: '01', icon: Globe2,
    title: 'International Social Workers Aspiring to Relocate',
    subtitle: 'Preparing for International Practice',
    intro: 'For many social workers, relocating internationally represents an important professional and personal milestone. However, securing employment is only one part of the process. Understanding professional requirements, social work systems, legislative frameworks and employer expectations is equally important.',
    detail: 'SWAB supports internationally educated social workers who are exploring opportunities in England, Ireland, Australia, New Zealand and other destinations by providing practical guidance, professional preparation and informed support. Our services include CV reviews, application support, interview preparation, mock interviews and professional readiness sessions designed to help practitioners approach the relocation process with confidence and realistic expectations.\n\nOur aim is to ensure that social workers are not simply successful in obtaining employment, but are also well prepared to transition into their chosen social work systems and thrive professionally.'
  },
  {
    id: 'transition', no: '02', icon: Compass,
    title: 'The Transition Programme',
    subtitle: 'Supporting Successful Transitions into Practice',
    intro: "The Transition Programme is SWAB's flagship professional development pathway designed specifically for internationally educated social workers preparing to enter a new social work system.",
    detail: 'Experience has shown that even highly skilled and experienced practitioners can find transitioning into a new country challenging. Differences in legislation, safeguarding frameworks, assessment approaches, recording expectations, workplace culture and professional accountability can significantly impact confidence during the early stages of employment.\n\nThe programme provides structured learning and practical support covering key areas including statutory social work practice, safeguarding responsibilities, professional recording, analytical assessment writing, multi-agency working, court awareness, reflective practice and adapting to professional expectations within the destination country.\n\nBy supporting practitioners before and during transition, we aim to strengthen confidence, improve readiness and contribute to successful integration into practice.',
    featured: true
  },
  {
    id: 'probation', no: '03', icon: UserRoundCheck,
    title: 'Probation & Practice Support',
    subtitle: 'Supporting Practitioners to Thrive',
    intro: 'Many social workers relocating internationally arrive with substantial practice experience but find themselves navigating unfamiliar systems, procedures and organisational cultures. In some instances, these challenges may impact confidence, performance and progression through probation periods.',
    detail: 'SWAB provides targeted support for practitioners who may be struggling to settle into practice, develop confidence in their decision-making or adapt to new professional expectations. Through reflective discussions, practice-focused coaching, assessment and analysis workshops, recording support and professional mentoring, we help practitioners identify strengths, overcome challenges and build resilience.\n\nOur goal is to support social workers not only to successfully complete probation, but to develop into confident and effective practitioners within their new environments.'
  },
  {
    id: 'employers', no: '04', icon: BriefcaseBusiness,
    title: 'Induction Programmes for Employers',
    subtitle: 'Supporting Organisations Recruiting International Social Workers',
    intro: 'SWAB offers tailored induction and transition programmes for Local Authorities, Trusts and organisations recruiting internationally educated social workers.',
    detail: 'Recruiting experienced practitioners from overseas is only the first step. Successful integration requires structured support that helps individuals understand local legislation, safeguarding responsibilities, organisational culture and professional expectations from the outset.\n\nOur induction programmes are designed to complement existing employer processes while providing practical, social-work-specific learning that promotes confidence, retention and long-term workforce stability.'
  },

  {
    id: 'training', no: '06', icon: GraduationCap,
    title: 'Professional Development & Training',
    subtitle: 'Developing Excellence in Practice',
    intro: 'Continuous learning remains central to effective social work practice. SWAB delivers professional development opportunities for individual practitioners, teams and organisations seeking to strengthen professional knowledge, confidence and practice excellence.',
    detail: 'Training may focus on child protection, safeguarding, assessment and analysis, direct work with children and families, professional writing, reflective practice, leadership development, cultural competence and international social work practice. Programmes can be delivered online, in person or through bespoke organisational packages designed to meet specific workforce development needs.\n\nOur training is informed by practice experience, evidence-informed approaches and a commitment to promoting high-quality social work practice.'
  },
  {
    id: 'ten-day', no: '07', icon: ClipboardCheck,
    title: '10-Day Transition & Induction Programme',
    subtitle: 'Preparing International Social Workers for Practice',
    intro: "SWAB's 10-Day Transition & Induction Programme has been developed to support newly recruited international social workers before they begin carrying full caseload responsibilities.",
    detail: 'Delivered by experienced social workers, managers and Practice Educators, the programme provides intensive preparation covering key aspects of statutory social work practice. Areas explored include legislative frameworks, children\'s services structures, assessment and recording standards, direct work with children and families, safeguarding responsibilities, professional standards, court work, reflective practice and effective multi-agency working.\n\nThe programme is suitable for Local Authorities, recruitment partners and organisations seeking to invest in the successful integration and development of internationally educated social workers.'
  },
  {
    id: 'mentoring', no: '08', icon: HeartHandshake,
    title: 'Practice Education, Mentoring & Workforce Support',
    subtitle: 'Learning from Experienced Practitioners',
    intro: 'Professional growth is strengthened through guidance, reflection and access to experienced colleagues.',
    detail: 'As SWAB develops, we aim to work alongside Practice Educators, Senior Practitioners, Team Managers, Advanced Practitioners, Researchers and Independent Consultants who bring valuable expertise from diverse social work settings.\n\nThrough mentoring, coaching and professional support, SWAB seeks to create learning opportunities that help practitioners build confidence, strengthen critical thinking and develop sustainable careers within the profession.'
  },
  {
    id: 'speaking', no: '09', icon: MessageCircle,
    title: 'Speaking Engagements, Conferences & University Lectures',
    subtitle: 'Professional Speaking and Knowledge Exchange',
    intro: 'SWAB welcomes opportunities to contribute to conferences, professional forums, university programmes, webinars, podcasts and panel discussions that promote learning and professional dialogue.',
    detail: 'Areas of interest include international social work, workforce development, safeguarding, professional identity, social work practice across borders, transition into international practice and developing effective practitioners in increasingly diverse and globalised social work environments.\n\nThrough speaking engagements and professional collaboration, SWAB aims to contribute to conversations that strengthen practice, encourage critical reflection and promote better outcomes for children and families.'
  }
];

const sectionMap: Record<string, string> = {
  'relocation-support': 'relocation-details',
  relocation: 'relocation-details',
  'transition-programme': 'transition-details',
  transition: 'transition-details',
  'probation-support': 'probation-details',
  probation: 'probation-details',
  'employer-induction': 'employers-details',
  employers: 'employers-details',
  'professional-development': 'training-details',
  training: 'training-details',
  mentoring: 'mentoring-details',
  'practice-education': 'mentoring-details',
  'speaking-engagements': 'speaking-details',
  speaking: 'speaking-details',
  '10-day-programme': 'ten-day-details'
};

export default function SwabHubSection({ setActivePage, activeSection }: Props) {
  const contact = () => {
    setActivePage('contact');
    if (typeof window !== 'undefined') {
      window.location.hash = 'contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const jump = (id: string) => {
    if (typeof document !== 'undefined') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const targetId = sectionMap[activeSection ?? ''];
    if (!targetId) return;
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [activeSection]);

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-800">
      <section className="relative isolate overflow-hidden bg-[#10243a] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-48 -left-32 h-[28rem] w-[28rem] rounded-full bg-sky-500/15 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-10 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.2em] text-amber-200">
              <Sparkles className="h-3.5 w-3.5" /> Social Work Across Borders
            </div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              SWAB Hub
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">Developing knowledgeable, confident and effective social work practitioners across borders.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => jump('support-pathways')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4e00]">Explore support pathways <ArrowRight className="h-4 w-4" /></button>
              <button onClick={contact} className="rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10">Talk to SWAB</button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/25 to-sky-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white p-6 text-center shadow-2xl sm:p-8">
              <img src="/logo2.png" alt="Social Work Across Borders (SWAB) logo" className="mx-auto h-36 w-full max-w-[260px] object-contain sm:h-44" />
              <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#e85d04]" />
              <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#e85d04]">Learn • Share • Collaborate • Transform</p>
              <h2 className="mx-auto mt-4 max-w-md text-2xl font-extrabold leading-tight text-[#10243a] sm:text-3xl">Developing knowledgeable, confident and effective social work practitioners across borders.</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">An international platform committed to professional development, international workforce support, knowledge exchange and practice excellence.</p>
              <div className="mt-7 grid grid-cols-2 gap-3 text-left">
                {[
                  ['01', 'Professional Development'],
                  ['02', 'International Workforce Support'],
                  ['03', 'Knowledge Exchange'],
                  ['04', 'Practice Excellence'],
                ].map(([number, label]) => (
                  <div key={number} className="rounded-xl border border-slate-200 bg-[#f5f7fa] p-4">
                    <span className="text-[10px] font-extrabold tracking-[.18em] text-[#e85d04]">{number}</span>
                    <p className="mt-2 text-xs font-bold leading-5 text-[#10243a] sm:text-sm">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Focus Areas</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-4xl">Focus Areas</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {focus.map(([Icon, title, text]) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-amber-300"><Icon className="h-6 w-6" /></span>
              <h3 className="mt-5 text-lg font-extrabold text-[#10243a]">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="support-pathways" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Our Support Pathways</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">Our Support Pathways</h2>
            <p className="mt-4 text-lg font-semibold leading-8 text-[#10243a]">Developing knowledgeable, confident and effective social work practitioners across borders</p>
            <p className="mt-5 text-base leading-8 text-slate-600">Social Work Across Borders (SWAB) provides professional learning, transition support and career development services for social workers at different stages of their international journey. Our focus is on supporting practitioners to develop the knowledge, skills and confidence required to navigate different social work systems while promoting positive outcomes for children, families and communities.</p>
            <p className="mt-5 text-sm leading-7 text-slate-600">While SWAB is committed to making professional support accessible, we also recognise the importance of sustainability and quality. Some of our programmes and services attract a modest fee which contributes towards training resources, platform development and compensating experienced practitioners, managers, educators and specialists who generously contribute their time, expertise and mentorship. We believe international social workers should have access to ethical, transparent and affordable support, particularly at a time when many are paying excessive fees simply to secure employment opportunities abroad.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pathways.map(({ id, no, icon: Icon, title, subtitle, intro, featured }) => (
              <article key={id} className={`group flex h-full flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-7 ${featured ? 'border-[#e85d04]/50 bg-[#fffaf6] ring-1 ring-[#e85d04]/15' : 'border-slate-200 bg-[#fbfcfe] hover:border-orange-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-amber-300"><Icon className="h-6 w-6" /></span>
                  <span className="text-xs font-extrabold tracking-[.18em] text-[#e85d04]">{no}</span>
                </div>
                <h3 className="mt-6 text-xl font-extrabold leading-snug text-[#10243a]">{title}</h3>
                <p className="mt-2 text-sm font-bold text-[#e85d04]">{subtitle}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{intro}</p>
                <button onClick={() => jump(`${id}-details`)} className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-extrabold text-[#e85d04] transition group-hover:gap-3">Read more <ArrowRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fa] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-5 px-5 sm:px-8 lg:px-10">
          <div className="mb-10 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Pathway Details</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">Explore Our Support</h2>
          </div>
          {pathways.map(({ id, no, icon: Icon, title, subtitle, intro, detail }) => (
            <article id={`${id}-details`} key={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10243a] text-amber-300"><Icon className="h-6 w-6" /></span>
                <div className="flex-1"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#e85d04]">Pathway {no}</p><h3 className="mt-1 text-xl font-extrabold text-[#10243a] sm:text-2xl">{title}</h3><p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p></div>
              </div>
              <div className="space-y-4 p-6 sm:p-7">
                <p className="text-sm font-semibold leading-7 text-[#10243a]">{intro}</p>
                {detail.split('\n\n').map((paragraph, index) => <p key={index} className="text-sm leading-7 text-slate-600">{paragraph}</p>)}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eef2f6] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] bg-[#10243a] px-6 py-12 text-center text-white shadow-xl sm:px-12 sm:py-14">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">Connect with SWAB</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Speaking Engagements, Conferences & University Lectures</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200">Professional Speaking and Knowledge Exchange</p>
          <button onClick={contact} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#e85d04] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#cf4e00]">Contact SWAB <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </main>
  );
}
