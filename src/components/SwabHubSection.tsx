import React from 'react';
import {
  ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, ClipboardCheck,
  Compass, GraduationCap, Globe2, HeartHandshake, MessageCircle, ShieldCheck,
  Sparkles, Users, UserRoundCheck, Wallet
} from 'lucide-react';

type Props = { setActivePage: (page: string) => void };

const pathways = [
  {
    id: 'relocation', no: '01', icon: Globe2, label: 'Before you move',
    title: 'International Social Workers Aspiring to Relocate',
    subtitle: 'Preparing for international practice',
    intro: 'Relocating internationally is a major professional and personal step. Securing a role is only one part of the journey: understanding professional requirements, social work systems, legislation and employer expectations is equally important.',
    points: ['CV reviews and application guidance', 'Interview preparation and mock interviews', 'Professional readiness sessions', 'Guidance on destination-country systems and expectations', 'Practical information to support informed decisions'],
    audience: 'Internationally educated social workers exploring opportunities in England, Ireland, Australia, New Zealand and other destinations.'
  },
  {
    id: 'transition', no: '02', icon: Compass, label: 'Before and after arrival',
    title: 'The SWAB Transition Programme',
    subtitle: 'Supporting successful transitions into practice',
    intro: 'The SWAB Transition Programme is a structured professional development pathway for internationally educated social workers preparing to enter a different social work system. Experienced practitioners may need targeted support to understand unfamiliar legislation, safeguarding frameworks, assessment approaches, recording expectations and workplace cultures.',
    points: ['Destination-country legislation, policy and professional standards', 'Statutory practice and safeguarding responsibilities', 'Assessment, analysis and professional recording', 'Direct work with children and families', 'Multi-agency working and court awareness', 'Cultural orientation, reflective practice and professional wellbeing', 'Confidence-building and opportunities to connect with experienced practitioners'],
    audience: 'Social workers preparing to relocate, newly arrived practitioners and professionals adapting to a new statutory or organisational environment.',
    featured: true
  },
  {
    id: 'probation', no: '03', icon: UserRoundCheck, label: 'When you start in a new role',
    title: 'Probation & Practice Support',
    subtitle: 'Supporting practitioners to thrive',
    intro: 'Many internationally mobile social workers bring substantial experience but can find themselves navigating unfamiliar procedures, systems and organisational cultures. These challenges can affect confidence, decision-making and progression through probation.',
    points: ['Reflective discussions and practice-focused coaching', 'Assessment and analysis workshops', 'Support with professional recording and written work', 'Mentoring around new practice expectations', 'Strengths-based support to build confidence and resilience'],
    audience: 'Practitioners who want support to settle into a new role, strengthen practice confidence or work through challenges during probation.'
  },
  {
    id: 'employers', no: '04', icon: BriefcaseBusiness, label: 'For organisations',
    title: 'Induction Programmes for Employers',
    subtitle: 'Supporting organisations recruiting internationally',
    intro: 'Recruiting experienced practitioners from overseas is only the first step. Successful integration requires structured support to help colleagues understand local legislation, safeguarding responsibilities, organisational culture and professional expectations from the outset.',
    points: ['Tailored social-work-specific induction and transition learning', 'Support that complements existing employer induction processes', 'Preparation for local legislation and safeguarding responsibilities', 'Practice expectations, recording and assessment standards', 'A focus on confidence, integration, retention and workforce stability'],
    audience: 'Local authorities, trusts, recruitment partners and organisations employing internationally educated social workers.'
  },
  {
    id: 'training', no: '05', icon: GraduationCap, label: 'Throughout your career',
    title: 'Professional Development & Training',
    subtitle: 'Developing excellence in practice',
    intro: 'Continuous learning is central to effective social work. SWAB provides professional development opportunities for individuals, teams and organisations seeking to strengthen professional knowledge, confidence and practice excellence.',
    points: ['Child protection and safeguarding', 'Assessment, analysis and direct work with children and families', 'Professional writing and recording', 'Reflective practice and cultural competence', 'Leadership development and international social work practice', 'Online, in-person and bespoke organisational learning options'],
    audience: 'Individual practitioners, teams and organisations seeking relevant, practice-informed learning.'
  },
  {
    id: 'mentoring', no: '06', icon: HeartHandshake, label: 'Learning with others',
    title: 'Practice Education, Mentoring & Workforce Support',
    subtitle: 'Learning from experienced practitioners',
    intro: 'Professional growth is strengthened through guidance, reflection and access to experienced colleagues. SWAB aims to work alongside Practice Educators, Senior Practitioners, Team Managers, Advanced Practitioners, researchers and independent consultants from diverse social work settings.',
    points: ['Professional mentoring and coaching', 'Reflective learning and critical thinking', 'Guidance from experienced practitioners and educators', 'Support for confidence and professional development', 'Connections that encourage sustainable careers in social work'],
    audience: 'Practitioners seeking guidance, as well as experienced professionals and specialists interested in contributing to shared learning.'
  }
];

const focus = [
  [BookOpen, 'Professional reflection', 'Reflecting on practice experiences, professional challenges and lessons learned to strengthen knowledge, confidence and effectiveness.'],
  [Globe2, 'International social work practice', 'Exploring social work systems, legislation, policy, safeguarding frameworks and practice across countries and cultures.'],
  [GraduationCap, 'Learning & career development', 'Supporting career progression, relocation preparation, training and lifelong professional learning.'],
  [MessageCircle, 'Voices from practice', 'Sharing insights from social workers, leaders, educators, researchers and people with lived experience.'],
  [ClipboardCheck, 'Research & best practice', 'Promoting evidence-informed practice through research, innovation, critical thinking and shared learning.'],
  [ShieldCheck, 'Children, families & safeguarding', 'Championing strengths-based, child-centred and family-focused approaches that improve safety, wellbeing and outcomes.']
] as const;

const programmeTopics = [
  'Legislation, policy and statutory frameworks',
  'Children’s services structures and local practice',
  'Safeguarding responsibilities and child protection',
  'Assessment, analysis and recording standards',
  'Direct work with children and families',
  'Professional standards and accountability',
  'Court work and multi-agency collaboration',
  'Reflective practice and professional wellbeing'
];

export default function SwabHubSection({ setActivePage }: Props) {
  const contact = () => {
    setActivePage('contact');
    if (typeof window !== 'undefined') {
      window.location.hash = 'contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const jump = (id: string) => {
    if (typeof document !== 'undefined') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
              <Sparkles className="h-3.5 w-3.5" /> Professional support & development
            </div>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.2em] text-amber-300">Social Work Across Borders</p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              The SWAB Hub<span className="mt-2 block text-amber-300">Support to grow. Confidence to thrive.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200">Developing knowledgeable, confident and effective social work practitioners across borders.</p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              SWAB provides professional learning, transition support and career development for social workers at different stages of their international journey. We help practitioners build the knowledge, skills and confidence to navigate different social work systems and contribute to positive outcomes for children, families and communities.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => jump('support-pathways')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4e00]">Explore support pathways <ArrowRight className="h-4 w-4" /></button>
              <button onClick={contact} className="rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10">Talk to SWAB</button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/25 to-sky-400/10 blur-2xl" />
            <div className="relative rounded-[1.75rem] border border-white/15 bg-white p-6 text-center shadow-2xl sm:p-8">
              <img src="/logo2.png" alt="Social Work Across Borders logo" className="mx-auto h-36 w-36 object-contain sm:h-44 sm:w-44" />
              <div className="mx-auto my-5 h-1 w-16 rounded-full bg-[#e85d04]" />
              <p className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[#e85d04]">Our shared commitment</p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[#10243a] sm:text-3xl">Different systems.<span className="block text-[#e85d04]">Shared purpose.</span></h2>
              <p className="mx-auto mt-4 max-w-xs text-sm leading-6 text-slate-600">Connecting professional knowledge, practical experience and people across borders.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">What the Hub is for</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-4xl">Professional support at every stage of your journey.</h2>
            <div className="mt-6 h-1 w-16 rounded-full bg-[#e85d04]" />
          </div>
          <div className="space-y-4 text-base leading-8 text-slate-600">
            <p>Social workers moving between countries and practice environments can encounter unfamiliar legislation, professional standards, safeguarding systems, organisational cultures, service-user needs, terminology and recording requirements. Even highly experienced practitioners may need time and support to adjust.</p>
            <p>SWAB brings together practical guidance, structured learning, mentoring and workforce support. The aim is not simply to help practitioners secure opportunities, but to help them prepare well, integrate successfully and continue to develop in their new environments.</p>
            <p className="font-semibold text-[#10243a]">Our work is grounded in the belief that supporting social workers strengthens the quality of practice and, ultimately, outcomes for children, families and communities.</p>
          </div>
        </div>
        <div className="mt-14">
          <div className="mb-7 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Our focus areas</p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[#10243a] sm:text-3xl">The foundations of the SWAB Hub</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {focus.map(([Icon, title, text]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-amber-300"><Icon className="h-6 w-6" /></span>
                <h4 className="mt-5 text-lg font-extrabold text-[#10243a]">{title}</h4>
                <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="support-pathways" className="scroll-mt-24 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Our services</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">Our support pathways</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">Choose the support that best reflects where you are in your professional journey or the needs of your organisation.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pathways.map(({ id, no, icon: Icon, label, title, subtitle, intro, points, featured }) => (
              <article key={id} className={`group flex h-full flex-col rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:p-7 ${featured ? 'border-[#e85d04]/50 bg-[#fffaf6] ring-1 ring-[#e85d04]/15' : 'border-slate-200 bg-[#fbfcfe] hover:border-orange-200'}`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-amber-300"><Icon className="h-6 w-6" /></span>
                  <span className="text-xs font-extrabold tracking-[.18em] text-[#e85d04]">{no}</span>
                </div>
                <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">{label}</p>
                <h3 className="mt-2 text-xl font-extrabold leading-snug text-[#10243a]">{title}</h3>
                <p className="mt-2 text-sm font-bold text-[#e85d04]">{subtitle}</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{intro}</p>
                <div className="mt-5 border-t border-slate-200 pt-4">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#10243a]">How we can help</p>
                  <ul className="space-y-2.5">{points.slice(0, 4).map(point => <li key={point} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#e85d04]" />{point}</li>)}</ul>
                </div>
                <button onClick={() => jump(`${id}-details`)} className="mt-auto inline-flex w-fit items-center gap-2 pt-6 text-sm font-extrabold text-[#e85d04] transition group-hover:gap-3">View pathway details <ArrowRight className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f7fa] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl space-y-5 px-5 sm:px-8 lg:px-10">
          <div className="mb-10 text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Pathway details</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">Practical support, shaped around real needs.</h2>
          </div>
          {pathways.map(({ id, no, icon: Icon, title, subtitle, intro, points, audience }) => (
            <article id={`${id}-details`} key={id} className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#10243a] text-amber-300"><Icon className="h-6 w-6" /></span>
                <div className="flex-1"><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-[#e85d04]">Pathway {no}</p><h3 className="mt-1 text-xl font-extrabold text-[#10243a] sm:text-2xl">{title}</h3><p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p></div>
              </div>
              <div className="grid gap-7 p-6 sm:p-7 lg:grid-cols-[1.1fr_.9fr]">
                <div><p className="text-sm leading-7 text-slate-600">{intro}</p><div className="mt-5 rounded-xl bg-[#f5f7fa] p-4"><p className="text-xs font-extrabold uppercase tracking-wider text-[#10243a]">Who this is for</p><p className="mt-2 text-sm leading-6 text-slate-600">{audience}</p></div></div>
                <div><p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-[#10243a]">Support may include</p><ul className="space-y-3">{points.map(point => <li key={point} className="flex items-start gap-2.5 text-sm leading-6 text-slate-600"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#e85d04]" />{point}</li>)}</ul></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#10243a] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-amber-200"><ClipboardCheck className="h-4 w-4" /> Employer and practitioner pathway</div>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">10-Day Transition & Induction Programme</h2>
            <p className="mt-5 text-base leading-8 text-slate-200">Developed to support newly recruited international social workers before they begin carrying full caseload responsibilities, this intensive programme provides preparation across key aspects of statutory social work practice.</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">Delivered by experienced social workers, managers and Practice Educators, the programme is designed for local authorities, recruitment partners and organisations investing in the successful integration and development of internationally educated practitioners.</p>
            <button onClick={contact} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#e85d04] px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#cf4e00]">Enquire about the programme <ArrowRight className="h-4 w-4" /></button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.06] p-6 sm:p-8">
            <h3 className="text-lg font-extrabold text-amber-300">Core learning areas</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">The programme explores practical knowledge and skills needed to enter a new practice environment.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{programmeTopics.map((topic, i) => <div key={topic} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.05] p-4"><span className="text-xs font-extrabold text-amber-300">0{i + 1}</span><span className="text-sm leading-6 text-slate-100">{topic}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e85d04]"><Users className="h-6 w-6" /></span>
            <h2 className="mt-5 text-2xl font-extrabold text-[#10243a]">Learning together, across borders</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">SWAB’s approach values shared experience and collaboration. We aim to connect practitioners with experienced social workers, managers, Practice Educators, researchers and specialists who can contribute knowledge and support from different practice settings.</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">Support is shaped around the needs of practitioners and organisations, with an emphasis on practical learning, professional reflection and sustainable development.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-[#e85d04]"><Wallet className="h-6 w-6" /></span>
            <h2 className="mt-5 text-2xl font-extrabold text-[#10243a]">Accessible, ethical and transparent support</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">SWAB is committed to making professional support accessible while recognising the importance of sustainability and quality. Some programmes and services may attract a modest fee to contribute to learning resources, platform development and the time and expertise of practitioners, educators and specialists.</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">Any applicable fees and what is included should be explained clearly before a person or organisation commits. Our aim is to promote ethical, transparent and affordable support.</p>
          </article>
        </div>
      </section>

      <section className="bg-[#eef2f6] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl rounded-[1.75rem] bg-[#10243a] px-6 py-12 text-center text-white shadow-xl sm:px-12 sm:py-14">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">Connect with SWAB</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Wherever you are in your professional journey, there is a pathway to help you move forward.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-200">Whether you are preparing to relocate, adjusting to a new practice system, navigating probation, seeking development or planning workforce support for your organisation, start a conversation with SWAB.</p>
          <button onClick={contact} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#e85d04] px-7 py-4 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#cf4e00]">Contact SWAB <ArrowRight className="h-4 w-4" /></button>
        </div>
      </section>
    </main>
  );
}
