'use client';

import React from 'react';

interface HomeProps {
  setActivePage: (page: string) => void;
  initialHero?: any;
  initialCards?: any[];
}

const supportPathways = [
  {
    number: '01',
    icon: '🌍',
    title: 'International Social Workers Aspiring to Relocate',
    description:
      'Practical guidance for social workers exploring opportunities in England, Ireland, Australia, New Zealand, Canada and other destinations. Support can include CV reviews, application guidance, interview preparation, mock interviews and professional readiness sessions.',
    tag: 'Relocation preparation',
    page: 'swab',
  },
  {
    number: '02',
    icon: '🧭',
    title: 'The SWAB Transition Programme',
    description:
      'A structured development pathway to help internationally educated social workers prepare for and adapt to a new social work system, including legislation, safeguarding, assessment, recording, direct work, cultural orientation and reflective practice.',
    tag: 'Structured transition',
    page: 'swab',
  },
  {
    number: '03',
    icon: '🤝',
    title: 'Probation & Practice Support',
    description:
      'Practice-focused support for professionals adapting to unfamiliar procedures, organisational expectations and workplace cultures through reflective discussion, coaching, assessment and recording support, and mentoring.',
    tag: 'Practice confidence',
    page: 'swab',
  },
  {
    number: '04',
    icon: '🏢',
    title: 'Employer Induction Programmes',
    description:
      'Tailored induction and transition support for local authorities, trusts and organisations recruiting internationally educated social workers, helping strengthen integration, confidence, retention and workforce stability.',
    tag: 'Workforce support',
    page: 'swab',
  },
  {
    number: '05',
    icon: '🎓',
    title: 'Professional Development & Training',
    description:
      'Learning opportunities designed to strengthen professional confidence, assessment skills, safeguarding practice, reflective practice and leadership development.',
    tag: 'Lifelong learning',
    page: 'swab',
  },
  {
    number: '06',
    icon: '🧑‍🏫',
    title: 'Practice Education & Mentoring',
    description:
      'Connections with experienced social workers, managers, educators and mentors who can encourage professional growth, reflection and development.',
    tag: 'Mentoring',
    page: 'swab',
  },
];

const focusAreas = [
  {
    icon: '💭',
    title: 'Professional Reflection',
    description:
      'Critical reflection on practice experiences, professional challenges and lessons learned to strengthen knowledge, confidence and effectiveness.',
  },
  {
    icon: '🌐',
    title: 'International Social Work Practice',
    description:
      'Exploring social work systems, legislation, policy, safeguarding frameworks and professional practice across countries and cultures.',
  },
  {
    icon: '📈',
    title: 'Learning & Career Development',
    description:
      'Supporting practitioners to strengthen professional confidence, competence and leadership throughout their careers.',
  },
  {
    icon: '🎙️',
    title: 'Voices from Practice',
    description:
      'Sharing the experiences and insights of social workers, leaders, educators, researchers and people with lived experience.',
  },
  {
    icon: '🔎',
    title: 'Research & Best Practice',
    description:
      'Promoting evidence-informed practice through research reviews, innovation, critical thinking and practical learning.',
  },
  {
    icon: '🛡️',
    title: 'Children, Families & Safeguarding',
    description:
      'Keeping the safety, wellbeing and long-term outcomes of children, families and communities at the centre of social work.',
  },
];

const values = [
  {
    word: 'Learn',
    description:
      'Professional growth is a lifelong journey. Every social worker should have opportunities to develop knowledge, skills and confidence.',
  },
  {
    word: 'Share',
    description:
      'Sharing knowledge, experiences and ideas strengthens practice and supports collective learning.',
  },
  {
    word: 'Collaborate',
    description:
      'Meaningful change happens when practitioners, organisations and communities work together.',
  },
  {
    word: 'Transform',
    description:
      'Learning should lead to action, innovation and positive change for children, families and communities.',
  },
];

export default function Home({ setActivePage, initialHero }: HomeProps) {
  const logo = initialHero?.logoUrl || '/logo2.png';

  const navigate = (page: string) => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-slate-800">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#10243a] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-orange-500/30 blur-3xl" />
          <div className="absolute -bottom-56 -left-32 h-[34rem] w-[34rem] rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-16 sm:px-8 sm:pb-28 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pt-20">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              An international social work platform
            </div>
            <p className="mb-4 text-sm font-extrabold uppercase tracking-[.2em] text-amber-300">
              Social Work Across Borders (SWAB)
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Empowering social workers to
              <span className="block text-amber-300">thrive across borders.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Through knowledge, preparation and support, we help social workers
              navigate professional change, grow in confidence and contribute to
              better outcomes for children and families.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              SWAB is an international platform committed to developing
              knowledgeable, confident and effective practitioners through
              professional development, international workforce support,
              knowledge exchange and practice excellence.
              <p>
                Whether you are an aspiring social worker, an experienced 
                practitioner seeking international opportunities, a newly
                relocated professional navigating a new system, or an 
                organisation investing in workforce development, SWAB 
                provides structured pathways that support learning, 
                growth and success.
                
              </p>
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate('swab')}
                className="rounded-xl bg-[#e85d04] px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#cf4e00]"
              >
                Explore SWAB support <span aria-hidden="true">→</span>
              </button>
              <button
                onClick={() => navigate('about')}
                className="rounded-xl border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Discover our purpose
              </button>
            </div>
            <div className="mt-9 border-t border-white/15 pt-5 text-sm font-semibold tracking-wide text-slate-300">
              Learn <span className="px-2 text-amber-300">•</span> Share
              <span className="px-2 text-amber-300">•</span> Collaborate
              <span className="px-2 text-amber-300">•</span> Transform
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-amber-300/30 to-sky-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-white p-5 shadow-[0_30px_90px_rgba(0,0,0,.35)] sm:p-7">
              <div className="flex min-h-[390px] flex-col items-center justify-center rounded-[1.3rem] bg-[#f5f7fa] px-5 py-8 text-center">
                <img
                  src={logo}
                  alt="Social Work Across Borders logo"
                  className="mb-6 h-32 w-32 select-none object-contain sm:h-40 sm:w-40"
                  onContextMenu={(event) => event.preventDefault()}
                />
                <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#e85d04]">
                  Our shared purpose
                </p>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-3xl">
                  Different contexts.
                  <span className="block text-[#e85d04]">Shared commitment.</span>
                </h2>
                <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
                  Connecting practice, research and lived experience to
                  strengthen social work and create positive change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO / WHY WE EXIST */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr_.65fr] lg:px-10 lg:py-24">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Why SWAB exists</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-4xl">
            Social workers should not navigate change alone.
          </h2>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#e85d04]" />
        </div>
        <div className="space-y-5 text-base leading-8 text-slate-600">
          <p>
            Nathanael Maradza is a qualified social worker, speaker and 
            founder of Social Work Across Borders (SWAB). He graduated 
            with a Bachelor of Science Honours Degree in Social Work from 
            Bindura University of Science Education, Zimbabwe, in 2022 
            before successfully relocating and establishing a career in 
            social work practice within the United Kingdom.
          </p>
          <p>
            Prior to relocating to the UK, Nathanael developed a strong 
            foundation in child protection, safeguarding, community 
            development and family support through a range of roles across 
            Zimbabwe's rural and underserved communities. He worked with 
            the National AIDS Council Zimbabwe in Shamva District, 
            supporting populations facing heightened vulnerability, 
            including mine workers, commercial sex workers, children and 
            young people living with HIV, and families affected by poverty, 
            domestic abuse and social exclusion. During this time, he was 
            involved in implementing community-based prevention and behaviour 
            change programmes, including the SASA! Together model, while 
            supporting responses to complex domestic violence situations and 
            their impact on children and families.
          </p>
          <p>
            Nathanael also worked alongside the Department of Social Development, 
            the government department responsible for child protection and family 
            safeguarding in Rushinga District, Zimbabwe. This role exposed him to 
            some of the most complex safeguarding concerns affecting rural 
            communities, including child marriage, sexual exploitation, neglect, 
            abuse and broader child protection risks. Working closely with children, 
            families, community leaders and statutory partners strengthened his 
            understanding of safeguarding within resource-constrained environments 
            and reinforced his commitment to social justice and children's rights.
          </p>
          <p>
           His experience was further enriched through his work with World Vision 
           Zimbabwe under the Child Protection and Advocacy Team, supporting programmes 
           across the rural districts of Mbire and Muzarabani. Here he contributed to 
           child protection initiatives, community mobilisation, advocacy work and 
           efforts aimed at strengthening protective environments for vulnerable children 
           and families.
          </p>
          <p>
            These experiences shaped Nathanael's professional values and understanding of 
            the realities facing children, families and communities across different 
            contexts. They also provided the foundation for his later work within the 
            United Kingdom and contributed significantly to his interest in international 
            social work, workforce development and professional transitions.
          </p>
          <p>
            Throughout his professional journey, Nathanael identified significant support 
            gaps affecting newly qualified social workers, internationally educated 
            practitioners and professionals transitioning into unfamiliar practice 
            environments. While many possess strong academic foundations and valuable 
            practical experience, the transition into new systems, legislation, 
            organisational cultures and professional expectations can be overwhelming 
            without structured support.
          </p>
          <p>
            Having experienced international relocation and professional transition himself, 
            Nathanael became increasingly passionate about creating a structured platform 
            that would support social workers navigating similar journeys. Drawing from both 
            his personal and professional experiences, he established Social Work Across 
            Borders (SWAB) to provide professional guidance, mentoring, learning opportunities, 
            workforce support and international networks designed to help practitioners thrive 
            throughout their careers.
          </p>
          <p className="font-semibold text-[#e85d04]">
           His vision is simple:

          </p>
          <p className="font-semibold text-[#10243a]">
            Every social worker deserves access to the knowledge, support and opportunities needed 
            to develop confidence, strengthen practice and improve outcomes for children, families 
            and communities.
          </p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-[.24em] text-[#e85d04]">
                 Meet Our Team Lead
                </p>
        <figure className="mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <img
            src="/swab-team-lead.png"
            alt="A representative portrait associated with Social Work Across Borders"
            className="aspect-[3/4] w-full rounded-xl object-cover object-top"
            onContextMenu={(event) => event.preventDefault()}
          />
          <figcaption className="px-3 py-3 text-center text-xs font-semibold tracking-wide text-slate-500">
            Nathanael Maradza
          </figcaption>
           <figcaption className="px-3 py-3 text-center text-xs font-semibold tracking-wide text-slate-500">
            Founder & Team Leader | Social Work Across Borders (SWAB)
          </figcaption>
        </figure>
      </section>

      {/* WHAT WE DO */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">How we support the profession</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">Who we are</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
             Supporting Social Workers Across Borders
             <p>
              Social Work Across Borders was established to create opportunities for social workers, 
              educators, researchers and organisations to learn from one another across different 
              countries, cultures and social work systems.
             </p>
             <p>
              We believe that some of the most valuable learning takes place when practitioners share 
              experiences, challenge assumptions and engage in meaningful professional conversations. 
              Through learning, collaboration and knowledge exchange, SWAB seeks to strengthen practice 
              and support positive outcomes for children, families and communities.
             </p>
             <p>
              Whether you are exploring international opportunities, preparing for relocation, navigating 
              probation, developing leadership skills or seeking professional growth, SWAB provides a 
              supportive environment where learning and development can flourish.
             </p>
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ['🌍', 'International support', 'Guidance for social workers considering, preparing for or undertaking international relocation.'],
              ['🎓', 'Professional development', 'Learning opportunities that enhance knowledge, skills and confidence across social work practice.'],
              ['🧭', 'Career & interview support', 'CV reviews, application guidance, interview preparation, mock interviews and professional mentoring.'],
              ['💬', 'Knowledge exchange', 'Discussions, webinars, blogs, podcasts and professional networking that encourage shared learning.'],
            ].map(([icon, title, description]) => (
              <article key={title} className="rounded-2xl border border-slate-200 bg-[#fbfcfe] p-6 transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl">{icon}</span>
                <h3 className="mt-5 text-lg font-extrabold text-[#10243a]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SUPPORT PATHWAYS */}
      <section className="bg-[#f5f7fa] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Our support pathways</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">
                Support for every stage of the journey.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Professional learning, mentoring, transition support and
                workforce development for social workers and organisations.
              </p>
            </div>
            <button onClick={() => navigate('swab')} className="w-fit rounded-xl bg-[#10243a] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1d3b5b]">
              Explore all pathways →
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {supportPathways.map((item) => (
              <article key={item.number} className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10243a] text-2xl">{item.icon}</span>
                  <span className="text-xs font-extrabold tracking-[.16em] text-[#e85d04]">{item.number}</span>
                </div>
                <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">{item.tag}</p>
                <h3 className="mt-2 text-xl font-extrabold leading-snug text-[#10243a]">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.description}</p>
                <button onClick={() => navigate(item.page)} className="mt-6 w-fit text-sm font-extrabold text-[#e85d04] transition group-hover:translate-x-1">
                  Find out more <span aria-hidden="true">→</span>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSITION PROGRAMME FEATURE */}
      <section className="bg-[#10243a] py-20 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_.85fr] lg:px-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">A key SWAB pathway</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              The Transition Programme
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200">
              A tailored programme being developed to support internationally
              educated social workers before and after relocation. It is
              designed to help practitioners understand destination-country
              legislation, professional standards, safeguarding frameworks,
              assessment and recording, cultural context, reflective practice
              and professional wellbeing.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Our ambition is to create a trusted pathway that helps social
              workers transition into new environments, build confidence and
              realise their professional potential.
            </p>
            <button onClick={() => navigate('swab')} className="mt-8 rounded-xl bg-[#e85d04] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#cf4e00]">
              Discover the programme →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Legislation & policy',
              'Safeguarding frameworks',
              'Assessment & recording',
              'Direct work approaches',
              'Cultural orientation',
              'Reflective practice',
              'Professional resilience',
              'Practitioner networks',
            ].map((label, index) => (
              <div key={label} className="flex min-h-24 items-center gap-3 rounded-xl border border-white/10 bg-white/[.06] p-4">
                <span className="text-xs font-extrabold text-amber-300">0{index + 1}</span>
                <span className="text-sm font-semibold leading-5 text-slate-100">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOCUS AREAS */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Our focus areas</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">Driving learning, development and practice excellence.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {focusAreas.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-orange-200 hover:shadow-lg">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="mt-4 text-lg font-extrabold text-[#10243a]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* KNOWLEDGE HUB */}
      <section className="bg-[#eef2f6] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">SWAB Knowledge Hub</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-4xl">
              Knowledge that supports practice.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              The Knowledge Hub brings together professional articles,
              research reviews, international perspectives, podcasts,
              webinars, toolkits and practice resources. It combines research,
              practice wisdom, professional reflection and lived experience
              to strengthen confidence, competence and professional
              effectiveness.
            </p>
            <button onClick={() => navigate('publications')} className="mt-7 rounded-xl bg-[#10243a] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#1d3b5b]">
              Visit the Knowledge Hub →
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ['📚', 'Practice articles & perspectives'],
              ['🔬', 'Research reviews & practice insights'],
              ['🌍', 'International perspectives'],
              ['🧰', 'Toolkits & practice resources'],
              ['🎧', 'Podcasts, webinars & conversations'],
              ['📝', 'Publications'],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-bold text-[#10243a]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPEAKING & COLLABORATION */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Speaking, training & collaboration</p>
              <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#10243a] sm:text-4xl">
                Bringing learning beyond borders.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                SWAB contributes to conferences, universities, workforce
                development programmes, webinars, podcasts and professional
                learning events that promote social work excellence and
                international knowledge exchange.
              </p>
              <button onClick={() => navigate('speaking')} className="mt-7 rounded-xl bg-[#e85d04] px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#cf4e00]">
                Explore speaking & training →
              </button>
            </div>
            <div className="rounded-2xl bg-[#10243a] p-7 text-white sm:p-9">
              <h3 className="text-xl font-extrabold">We welcome collaboration with</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Universities & educational institutions',
                  'Local authorities & children’s services',
                  'Charities & NGOs',
                  'Recruitment organisations',
                  'Research groups',
                  'Professional associations',
                  'Social workers worldwide',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[.06] p-4">
                    <span className="mt-0.5 text-amber-300">✓</span>
                    <span className="text-sm leading-6 text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY SWAB / VALUES */}
      <section className="bg-[#f5f7fa] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[.2em] text-[#e85d04]">Our values</p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#10243a] sm:text-4xl">Learn. Share. Collaborate. Transform.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">These values guide everything we do.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
              <article key={item.word} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="text-xs font-extrabold tracking-[.18em] text-[#e85d04]">0{index + 1}</span>
                <h3 className="mt-3 text-2xl font-extrabold text-[#10243a]">{item.word}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN COMMUNITY */}
      <section className="bg-[#10243a] px-5 py-20 text-white sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[.2em] text-amber-300">Join the SWAB community</p>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Wherever you are in your journey, SWAB is here to support you.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-200">
            Whether you are exploring international opportunities, preparing
            for relocation, navigating probation, seeking professional
            development or mentoring, interested in research and knowledge
            exchange, or looking for speaking and collaboration opportunities,
            SWAB welcomes you.
          </p>
          <p className="mt-6 text-sm font-semibold text-slate-300">
            Developing knowledgeable, confident and effective social work
            practitioners across borders.
          </p>
          <button onClick={() => navigate('contact')} className="mt-8 rounded-xl bg-[#e85d04] px-8 py-4 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4e00]">
            Register with SWAB →
          </button>
        </div>
      </section>
    </main>
  );
}
