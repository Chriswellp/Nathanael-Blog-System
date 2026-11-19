'use client';

import React, { useEffect } from 'react';

interface AboutSectionProps {
  setActivePage: (page: string) => void;
  activeSection?: string;
}

const workAreas = [
  {
    title: 'International Social Worker Support',
    description:
      'Supporting social workers who are considering, preparing for or undertaking international relocation.',
  },
  {
    title: 'Professional Development',
    description:
      'Providing learning opportunities that enhance knowledge, skills and confidence across different areas of social work practice.',
  },
  {
    title: 'Interview Preparation and Career Support',
    description:
      'CV reviews, application guidance, interview preparation, mock interviews and professional mentoring.',
  },
  {
    title: 'Knowledge Exchange',
    description:
      'Creating opportunities for social workers to learn from one another through discussions, webinars, blogs, podcasts and professional networking.',
  },
  {
    title: 'Research and Learning',
    description:
      'Exploring social work practice, policy and systems across different countries to promote learning and innovation.',
  },
];

const transitionSupport = [
  'Introduction to destination-country legislation',
  'Practice expectations and professional standards',
  'Understanding safeguarding frameworks',
  'Assessment and recording skills',
  'Direct work approaches',
  'Cultural orientation',
  'Professional resilience and wellbeing',
  'Confidence-building and reflective practice',
  'Networking opportunities with experienced practitioners and leaders',
];

const relocationChallenges = [
  'New legislation and policy frameworks',
  'Different practice standards and expectations',
  'New organisational cultures',
  'Diverse communities and service user needs',
  'Different safeguarding systems',
  'New professional terminology and recording requirements',
  'Cultural and social adjustments for individuals and families',
];

const longTermAmbitions = [
  'International social worker support',
  'Professional development and training',
  'Research and knowledge exchange',
  'Comparative social work learning',
  'Podcasts and professional conversations',
  'Publications and thought leadership',
  'Consultancy and workforce development',
  'Global social work partnerships',
];

export default function AboutSection({
  setActivePage,
  activeSection,
}: AboutSectionProps) {
  useEffect(() => {
    const sectionMap: Record<string, string> = {
      about: 'about',
      story: 'our-story',
      'our-story': 'our-story',
      'why-we-exist': 'why-we-exist',
      'what-we-do': 'what-we-do',
      'transition-programme': 'transition-programme',
      'the-transition-programme': 'transition-programme',
      vision: 'our-vision',
      'our-vision': 'our-vision',
      mission: 'our-mission',
      'our-mission': 'our-mission',
      ambition: 'long-term-ambition',
      'long-term-ambition': 'long-term-ambition',
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
      className="border-t border-slate-200 bg-slate-50 text-slate-800"
    >
      {/* ABOUT HERO */}
      <div className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full border-[35px] border-amber-400" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border-[35px] border-amber-400" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-5 inline-block text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
            Social Work Across Borders (SWAB)
          </span>

          <h1 className="mx-auto max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Social Work Across Borders (SWAB)
          </h1>

          <div className="mx-auto my-7 h-1 w-24 bg-amber-400" />

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Empowering social workers through knowledge, preparation and support to thrive across borders and improve outcomes for children and families.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => scrollToSection('our-story')}
              className="rounded-lg bg-amber-400 px-7 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-500"
            >
              Our Story
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="rounded-lg border border-slate-500 px-7 py-3 text-sm font-semibold text-white transition hover:border-amber-400 hover:text-amber-400"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        {/* OUR STORY */}
        <section
          id="our-story"
          className="scroll-mt-28 grid items-start gap-10 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Our Story
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Story
            </h2>
            <div className="mb-6 mt-5 h-1 w-16 bg-amber-400" />
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9 lg:col-span-3">
            <p className="leading-relaxed text-slate-700">
              Social Work Across Borders (SWAB) was established from a commitment to supporting social workers who aspire to pursue international career opportunities while making informed, confident and successful transitions into new countries and social work systems.
            </p>
            <p className="leading-relaxed text-slate-700">
              The idea for SWAB emerged from observing the experiences of many internationally educated social workers seeking to relocate to countries such as the United Kingdom, Ireland, Australia and New Zealand. While opportunities for international practice continue to grow, many social workers often face challenges navigating complex recruitment processes, understanding regulatory requirements, adapting to new professional standards and accessing reliable information about life and practice in their destination country.
            </p>
            <p className="leading-relaxed text-slate-700">
              Many professionals invest considerable personal, emotional and financial resources into their relocation journeys. Yet access to transparent information, peer support and professional guidance is often limited.
            </p>
            <p className="leading-relaxed text-slate-700">
              Recognising this need, SWAB's founder and team leader, Nathanael Maradza, established an informal WhatsApp support group that created a safe space for social workers to share knowledge, experiences, opportunities and practical advice. What began as a small peer-support network has steadily grown into a thriving international community of more than 700+ social workers from diverse professional, cultural and geographical backgrounds, with some already settled in their destination countries.
            </p>
            <p className="leading-relaxed text-slate-700">
              The group's purpose was simple: to provide free and accessible information about professional registration, relocation processes, employment opportunities, settlement experiences and social work practice in different countries. Through open dialogue, mentoring and peer learning, social workers were able to support one another while building confidence and professional networks.
            </p>
            <p className="leading-relaxed text-slate-700">
              Following his own successful relocation and establishment within UK social work practice, Nathanael became increasingly motivated to develop a more structured platform capable of supporting International Social Workers through every stage of their international journey. This vision led to the creation of Social Work Across Borders.
            </p>
            <p className="leading-relaxed text-slate-700">
              Today, SWAB exists to connect social workers across countries, cultures and systems, creating opportunities for professional learning, knowledge exchange, research, collaboration and mutual support.
            </p>
          </div>
        </section>

        {/* WHY WE EXIST */}
        <section
          id="why-we-exist"
          className="scroll-mt-28 grid items-start gap-10 lg:grid-cols-2"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Why We Exist
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Why We Exist
            </h2>
            <div className="mb-6 mt-5 h-1 w-16 bg-amber-400" />
            <p className="leading-relaxed text-slate-700">
              At SWAB, we believe that social workers should be empowered with accurate information, professional guidance and meaningful support when considering international career opportunities.
            </p>
            <p className="mt-5 leading-relaxed text-slate-700">
              Relocating to a new country is far more than securing a job. It involves adapting to:
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950 p-7 text-white shadow-xl sm:p-9">
            <ul className="space-y-4">
              {relocationChallenges.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 font-bold text-amber-400">✓</span>
                  <span className="text-sm leading-relaxed text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-6 lg:col-span-2">
            <p className="font-semibold leading-relaxed text-slate-900">
              Without adequate preparation and support, these challenges can impact confidence, professional performance and overall wellbeing.
            </p>
            <p className="mt-3 font-bold text-slate-900">SWAB was established to help bridge this gap.</p>
          </div>
        </section>

        {/* WHAT WE DO */}
        <section id="what-we-do" className="scroll-mt-28">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              What We Do
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              What We Do
            </h2>
            <div className="mx-auto mb-6 mt-5 h-1 w-16 bg-amber-400" />
            <p className="leading-relaxed text-slate-600">
              SWAB provides support, learning opportunities and resources for social workers at different stages of their professional journey.
            </p>
            <p className="mt-4 font-semibold text-slate-800">Our work includes:</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workAreas.map((area, index) => (
              <article
                key={area.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-amber-400 hover:shadow-md"
              >
                <span className="text-sm font-bold text-amber-500">0{index + 1}</span>
                <h3 className="mb-3 mt-3 font-serif text-lg font-bold text-slate-900">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{area.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* THE TRANSITION PROGRAMME */}
        <section
          id="transition-programme"
          className="scroll-mt-28 rounded-2xl bg-slate-950 p-7 text-white sm:p-10 lg:p-12"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            The Transition Programme
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
            The Transition Programme
          </h2>
          <div className="mb-7 mt-5 h-1 w-16 bg-amber-400" />

          <div className="space-y-5 leading-relaxed text-slate-300">
            <p>
              One of the recurring themes identified through our network has been the challenges experienced by international social workers during their first year in a new country.
            </p>
            <p>
              Many arrive with significant experience and expertise from their home countries. However, experience has shown that even highly skilled practitioners may struggle when transitioning into unfamiliar systems, legislation, organisational expectations and cultural environments.
            </p>
            <p>In England, for example, social workers may encounter:</p>
          </div>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              'Different child protection frameworks',
              'New legislative requirements',
              'Distinct assessment models',
              'Different recording expectations',
              'Multi-agency working arrangements',
              'Court processes',
              'Professional standards and regulatory expectations',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <span className="font-bold text-amber-400">✓</span>
                <span className="text-sm leading-relaxed text-slate-200">{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 leading-relaxed text-slate-300">
            At the same time, individuals and families are often adapting to a new community, education system, healthcare system and culture.
          </p>
          <p className="mt-5 leading-relaxed text-slate-300">
            To address these challenges, SWAB is developing <em>The Transition Programme.</em>
          </p>

          <p className="mt-5 font-semibold text-white">This tailored programme will support international social workers before and after relocation by providing:</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {transitionSupport.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="font-bold text-amber-400">✓</span>
                <span className="text-sm leading-relaxed text-slate-300">{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-7 leading-relaxed text-slate-200">
            Our ambition is for The Transition Programme to become a trusted support pathway that helps internationally educated social workers successfully transition into practice, thrive in their new environments and realise their full professional potential.
          </p>
        </section>

        {/* VISION */}
        <section
          id="our-vision"
          className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Our Vision
          </span>
          <h2 className="mb-6 mt-4 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Our Vision
          </h2>
          <div className="mx-auto mb-7 h-1 w-16 bg-amber-400" />
          <p className="mx-auto max-w-4xl text-lg leading-relaxed text-slate-700">
            <em>To connect social work practice, research and lived experience across borders, creating a global community where social workers learn, collaborate and grow together to improve outcomes for children, families and communities.</em>
          </p>
        </section>

        {/* MISSION */}
        <section
          id="our-mission"
          className="scroll-mt-28 mx-auto max-w-4xl py-4 text-center"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Our Mission
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
            Our Mission
          </h2>
          <div className="mx-auto mb-7 mt-5 h-1 w-16 bg-amber-400" />
          <p className="text-lg leading-relaxed text-slate-700">
            <em>To empower social workers through knowledge sharing, professional development, international collaboration, research and tailored support that strengthens practice, promotes professional confidence and facilitates successful transitions across different social work systems.</em>
          </p>
        </section>

        {/* LONG-TERM AMBITION */}
        <section
          id="long-term-ambition"
          className="scroll-mt-28 rounded-2xl border border-amber-200 bg-amber-50 p-7 sm:p-10"
        >
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                Our Long-Term Ambition
              </span>
              <h2 className="mb-5 mt-3 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                Our Long-Term Ambition
              </h2>
            </div>
            <p className="mb-6 leading-relaxed text-slate-700">
              SWAB aims to become a leading international platform for:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {longTermAmbitions.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="font-bold text-amber-700">✓</span>
                  <span className="leading-relaxed text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 font-semibold leading-relaxed text-slate-900">
              We believe that while social work systems may differ across countries, our shared commitment to supporting children, families and communities unites us all.
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
