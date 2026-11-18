
'use client';

import React, { useEffect } from 'react';

interface AboutSectionProps {
  setActivePage: (page: string) => void;
  activeSection?: string;
}

const values = [
  {
    title: 'Learn',
    description:
      'We believe professional growth is a lifelong journey. Every social worker should have opportunities to develop knowledge, skills and confidence throughout their career.',
    icon: '📚',
  },
  {
    title: 'Share',
    description:
      'We encourage the sharing of knowledge, experiences and ideas to strengthen professional practice and support collective learning.',
    icon: '🤝',
  },
  {
    title: 'Collaborate',
    description:
      'We recognise that meaningful change happens when practitioners, organisations and communities work together across borders.',
    icon: '🌍',
  },
  {
    title: 'Transform',
    description:
      'We believe learning should lead to action, innovation and positive change for children, families and communities.',
    icon: '✨',
  },
];

const workAreas = [
  {
    title: 'International Social Worker Support',
    description:
      'Supporting social workers considering, preparing for or undertaking international relocation through practical guidance and professional preparation.',
  },
  {
    title: 'Professional Development',
    description:
      'Providing learning opportunities that strengthen professional knowledge, skills, confidence and effectiveness across different areas of social work.',
  },
  {
    title: 'Career and Interview Support',
    description:
      'Offering CV reviews, application guidance, interview preparation, mock interviews and professional mentoring.',
  },
  {
    title: 'Knowledge Exchange',
    description:
      'Creating opportunities for social workers to learn from one another through discussions, webinars, articles, podcasts and professional networking.',
  },
  {
    title: 'Research and Learning',
    description:
      'Exploring social work practice, policy and systems across countries to promote evidence-informed learning and innovation.',
  },
];

export default function AboutSection({
  setActivePage,
  activeSection,
}: AboutSectionProps) {
  // Maps Navbar submenu names to the actual section IDs on this page.
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      about: 'about',
      story: 'our-story',
      'our-story': 'our-story',
      'who-we-are': 'who-we-are',
      'who-we-are-swab': 'who-we-are',
      'why-we-exist': 'why-we-exist',
      'what-we-do': 'what-we-do',
      vision: 'our-vision',
      'our-vision': 'our-vision',
      mission: 'our-mission',
      'our-mission': 'our-mission',
      values: 'our-values',
      'our-values': 'our-values',
      'vision-mission-values': 'our-values',
    };

    const targetId = sectionMap[activeSection ?? ''];

    if (!targetId || targetId === 'about') return;

    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      id="about"
      className="bg-slate-50 text-slate-800 border-t border-slate-200"
    >
      {/* HERO */}
      <div className="relative overflow-hidden bg-slate-950 text-white py-20 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full border-[35px] border-amber-400" />
          <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full border-[35px] border-amber-400" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-amber-400 text-xs font-bold tracking-[0.25em] uppercase mb-5">
            About Social Work Across Borders
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight max-w-4xl mx-auto">
            Connecting Social Work
            <span className="block text-amber-400 mt-2">
              Across Borders
            </span>
          </h1>

          <div className="w-24 h-1 bg-amber-400 mx-auto my-7" />

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
            Empowering social workers through knowledge, preparation and
            support to thrive across borders and improve outcomes for children
            and families.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-9">
            <button
              onClick={() => scrollToSection('our-story')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-7 py-3 rounded-lg font-bold text-sm transition"
            >
              Discover Our Story
            </button>

            <button
              onClick={() => setActivePage('contact')}
              className="border border-slate-500 hover:border-amber-400 hover:text-amber-400 text-white px-7 py-3 rounded-lg font-semibold text-sm transition"
            >
              Get in Touch
            </button>
          </div>

          <p className="text-amber-400 text-sm font-semibold tracking-widest mt-10">
            LEARN <span className="text-slate-500">•</span> SHARE{' '}
            <span className="text-slate-500">•</span> COLLABORATE{' '}
            <span className="text-slate-500">•</span> TRANSFORM
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* OUR STORY */}
        <section
          id="our-story"
          className="scroll-mt-28 grid lg:grid-cols-5 gap-10 items-start"
        >
          <div className="lg:col-span-2">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
              Where It All Began
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
              Our Story
            </h2>

            <div className="w-16 h-1 bg-amber-400 mt-5 mb-6" />

            <p className="text-slate-600 leading-relaxed">
              From a small peer-support network to an international
              professional community, SWAB was created to make international
              social work journeys more informed, supported and successful.
            </p>
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-9 space-y-5">
            <p className="text-slate-700 leading-relaxed">
              Social Work Across Borders (SWAB) was established from a
              commitment to supporting social workers who aspire to pursue
              international career opportunities while making informed,
              confident and successful transitions into new countries and
              social work systems.
            </p>

            <p className="text-slate-700 leading-relaxed">
              The idea emerged from observing the experiences of
              internationally educated social workers seeking opportunities
              in countries such as the United Kingdom, Ireland, Australia and
              New Zealand. Although international opportunities continue to
              grow, many professionals face challenges navigating recruitment
              processes, regulatory requirements, professional standards and
              unfamiliar practice environments.
            </p>

            <p className="text-slate-700 leading-relaxed">
              Recognising this need, SWAB's founder and team leader,
              Nathanael Maradza, established an informal WhatsApp support
              group. It created a safe space for social workers to share
              knowledge, opportunities, experiences and practical advice.
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg">
              <p className="text-slate-900 font-semibold leading-relaxed">
                What began as a small peer-support network has grown into an
                international community of more than 700 social workers from
                diverse professional, cultural and geographical backgrounds.
              </p>
            </div>

            <p className="text-slate-700 leading-relaxed">
              The original purpose was simple: to make information about
              professional registration, relocation, employment opportunities,
              settlement and social work practice accessible. Through open
              dialogue, mentoring and peer learning, members began supporting
              one another and building valuable professional networks.
            </p>

            <p className="text-slate-700 leading-relaxed">
              Today, SWAB is developing into a structured international
              platform connecting social workers across countries, cultures
              and systems through professional learning, research,
              collaboration and mutual support.
            </p>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section
          id="who-we-are"
          className="scroll-mt-28 bg-white rounded-2xl border border-slate-200 shadow-sm p-7 sm:p-10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
              Our Identity
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
              Who We Are
            </h2>

            <div className="w-16 h-1 bg-amber-400 mx-auto mt-5 mb-7" />

            <p className="text-slate-700 text-base sm:text-lg leading-relaxed">
              Social Work Across Borders is an international platform
              established to create opportunities for social workers,
              educators, researchers and organisations to learn from one
              another across different countries, cultures and social work
              systems.
            </p>

            <p className="text-slate-600 leading-relaxed mt-5">
              We believe some of the most valuable learning takes place when
              practitioners share experiences, challenge assumptions and
              engage in meaningful professional conversations.
            </p>

            <p className="text-slate-600 leading-relaxed mt-5">
              Whether you are exploring international opportunities, preparing
              for relocation, navigating probation, developing leadership
              skills or seeking professional growth, SWAB provides a supportive
              environment where learning and development can flourish.
            </p>
          </div>
        </section>

        {/* WHY WE EXIST */}
        <section
          id="why-we-exist"
          className="scroll-mt-28 grid lg:grid-cols-2 gap-10 items-center"
        >
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
              The Need We Address
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
              Why We Exist
            </h2>

            <div className="w-16 h-1 bg-amber-400 mt-5 mb-6" />

            <h3 className="text-xl font-bold text-slate-900 font-serif mb-4">
              Social Workers Should Not Navigate Change Alone.
            </h3>

            <p className="text-slate-600 leading-relaxed mb-5">
              Relocating to a new country involves far more than securing
              employment. Practitioners must understand unfamiliar legislation,
              professional expectations, safeguarding systems and workplace
              cultures.
            </p>

            <p className="text-slate-600 leading-relaxed">
              Without appropriate preparation, guidance and professional
              support, these challenges can affect confidence, performance,
              career progression and overall wellbeing. SWAB exists to help
              bridge this gap.
            </p>
          </div>

          <div className="bg-slate-950 text-white rounded-2xl p-7 sm:p-9 shadow-xl">
            <h3 className="text-xl font-bold font-serif text-amber-400 mb-6">
              Challenges International Social Workers May Face
            </h3>

            <ul className="space-y-4">
              {[
                'New legislation and policy frameworks',
                'Different practice standards and expectations',
                'Unfamiliar organisational cultures',
                'Different safeguarding systems',
                'New professional terminology and recording requirements',
                'Different approaches to assessment and intervention',
                'Cultural and social adjustments for individuals and families',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold mt-0.5">✓</span>
                  <span className="text-slate-300 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section id="what-we-do" className="scroll-mt-28">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
              Our Contribution
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
              What We Do
            </h2>

            <div className="w-16 h-1 bg-amber-400 mx-auto mt-5 mb-6" />

            <p className="text-slate-600 leading-relaxed">
              SWAB provides professional support, learning opportunities and
              resources for social workers at different stages of their
              professional journey.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {workAreas.map((area, index) => (
              <article
                key={area.title}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-400 transition"
              >
                <span className="text-amber-500 font-bold text-sm">
                  0{index + 1}
                </span>

                <h3 className="text-lg font-bold font-serif text-slate-900 mt-3 mb-3">
                  {area.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed">
                  {area.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* VISION */}
        <section
          id="our-vision"
          className="scroll-mt-28 bg-slate-950 text-white rounded-2xl p-8 sm:p-12 text-center"
        >
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
            Where We Are Going
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold font-serif mt-4 mb-6">
            Our Vision
          </h2>

          <div className="w-16 h-1 bg-amber-400 mx-auto mb-7" />

          <p className="text-slate-200 text-lg sm:text-xl leading-relaxed max-w-4xl mx-auto">
            To connect social work practice, research and lived experience
            across borders, creating a global community where social workers
            learn, collaborate and grow together to improve outcomes for
            children, families and communities.
          </p>
        </section>

        {/* MISSION */}
        <section
          id="our-mission"
          className="scroll-mt-28 max-w-4xl mx-auto text-center py-4"
        >
          <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
            What Drives Our Work
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
            Our Mission
          </h2>

          <div className="w-16 h-1 bg-amber-400 mx-auto mt-5 mb-7" />

          <p className="text-slate-700 text-lg leading-relaxed">
            To empower social workers through knowledge sharing, professional
            development, international collaboration, research and tailored
            support that strengthens practice, promotes professional
            confidence and facilitates successful transitions across different
            social work systems.
          </p>
        </section>

        {/* VALUES */}
        <section
          id="our-values"
          className="scroll-mt-28 bg-white rounded-2xl border border-slate-200 shadow-sm p-7 sm:p-10"
        >
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest">
              What Guides Us
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-slate-900 mt-3">
              Our Values
            </h2>

            <div className="w-16 h-1 bg-amber-400 mx-auto mt-5 mb-6" />

            <p className="text-slate-600 leading-relaxed">
              Learn, Share, Collaborate and Transform are more than words.
              They guide how we connect, support and empower the social work
              community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => (
              <article
                key={value.title}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center hover:border-amber-400 hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{value.icon}</div>

                <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">
                  {value.title}
                </h3>

                <div className="w-10 h-1 bg-amber-400 mx-auto mb-4" />

                <p className="text-slate-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* LONG-TERM AMBITION */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-7 sm:p-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-amber-700 text-xs font-bold uppercase tracking-widest">
              Looking Ahead
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-3 mb-5">
              Our Long-Term Ambition
            </h2>

            <p className="text-slate-700 leading-relaxed mb-7">
              SWAB aims to become a leading international platform for
              international social worker support, professional development,
              research, knowledge exchange, comparative social work learning,
              publications, consultancy and global partnerships.
            </p>

            <p className="text-slate-900 font-semibold leading-relaxed">
              Although social work systems may differ across countries, our
              shared commitment to supporting children, families and
              communities unites us all.
            </p>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="text-center py-8">
          <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">
            Be Part of the SWAB Community
          </h2>

          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed mb-7">
            Wherever you are in your professional journey, SWAB welcomes
            opportunities to learn, share, collaborate and grow together.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActivePage('contact')}
              className="bg-slate-950 hover:bg-slate-800 text-white px-7 py-3 rounded-lg font-bold text-sm transition"
            >
              Contact SWAB
            </button>

            <button
              onClick={() => setActivePage('swab')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-7 py-3 rounded-lg font-bold text-sm transition"
            >
              Explore Our Support Pathways
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
