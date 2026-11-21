'use client';

import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabaseClient';

type SubmissionStatus = 'success' | 'partial' | null;
type RegistrationStatus = 'success' | 'partial' | null;

const inputClass = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/20';
const labelClass = 'mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-600';

const supportOptions = [
  'SWAB Transition Programme', 'Professional Mentoring (One-to-One)', 'Career Development Support',
  'Professional Registration Guidance', 'CV Review & Enhancement', 'Application Support- A look into Personal Statement',
  'Interview Preparation', 'Mock Interview', 'International Relocation Preparation', 'Probation Support',
  'Reflective Practice Coaching', 'Assessment writing & Analysis Support', 'Leadership Development',
  'Professional Development Training', 'Wellbeing & Resilience Support', 'Employer / Local Authority Enquiry',
  'Speaking Engagement / Conference Invitation', 'University Lecture / Academic Engagement',
  'Research Collaboration', 'CLA Process',
  'Court Work Process', 'Other',
];
const destinationOptions = ['England', 'Wales', 'Scotland', 'Northern Ireland', 'Republic of Ireland', 'Australia', 'New Zealand', 'Canada', 'United States', 'Other'];

function Field({ label, name, required = false, type = 'text', placeholder = '', children }: {
  label: string; name: string; required?: boolean; type?: string; placeholder?: string; children?: React.ReactNode;
}) {
  return <div><label className={labelClass} htmlFor={`registration-${name}`}>{label}{required ? ' *' : ''}</label>{children || <input id={`registration-${name}`} name={name} type={type} required={required} placeholder={placeholder} className={inputClass} />}</div>;
}

function CheckGrid({ name, options }: { name: string; options: string[] }) {
  return <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{options.map((option) => <label key={option} className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 transition hover:border-amber-400"><input type="checkbox" name={name} value={option} className="mt-0.5 h-4 w-4 accent-amber-500" /><span>{option}</span></label>)}</div>;
}

export default function ContactSection() {
  // Existing contact-message state and submission route are intentionally kept separate.
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [registrationSubmitting, setRegistrationSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>(null);
  const [registrationError, setRegistrationError] = useState('');

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/social-work-across-borders-swab/?viewAsMember=true', icon: '💼', color: 'hover:bg-blue-600 hover:border-blue-600' },
    { name: 'Facebook', url: 'https://facebook.com', icon: '👥', color: 'hover:bg-indigo-600 hover:border-indigo-600' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '📸', color: 'hover:bg-pink-600 hover:border-pink-600' },
    { name: 'TikTok', url: 'https://tiktok.com', icon: '🎬', color: 'hover:bg-slate-900 hover:border-slate-900 hover:text-white' },
    { name: 'X (Twitter)', url: 'https://twitter.com', icon: '🗲', color: 'hover:bg-sky-500 hover:border-sky-500' },
    { name: 'WhatsApp', url: 'https://wa.me/447352143182', icon: '💬', color: 'hover:bg-emerald-600 hover:border-emerald-600' },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true); setErrorMessage(''); setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      inquiryType: String(formData.get('inquiryType') || ''),
      message: String(formData.get('message') || '').trim(),
      website: String(formData.get('website') || ''),
    };
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', { body: payload });
      if (error) { console.error('Contact submission error:', error); throw new Error('We could not submit your enquiry. Please try again or contact us through WhatsApp.'); }
      if (data?.saved && data?.emailSent) { setStatus('success'); form.reset(); }
      else if (data?.saved && !data?.emailSent) { setStatus('partial'); form.reset(); }
      else throw new Error(data?.error || 'Your enquiry could not be submitted. Please try again.');
    } catch (error) {
      console.error('Contact form error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally { setSubmitting(false); }
  };

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (registrationSubmitting) return;
    setRegistrationSubmitting(true); setRegistrationError(''); setRegistrationStatus(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const values = (name: string) => fd.getAll(name).map((v) => String(v)).filter(Boolean);
    const payload = {
      personalDetails: {
        firstName: String(fd.get('firstName') || '').trim(), surname: String(fd.get('surname') || '').trim(),
        email: String(fd.get('email') || '').trim(), whatsappNumber: String(fd.get('whatsappNumber') || '').trim(),
        countryOfResidence: String(fd.get('countryOfResidence') || '').trim(), countryOfOrigin: String(fd.get('countryOfOrigin') || '').trim(),
        gender: String(fd.get('gender') || ''), maritalStatus: String(fd.get('maritalStatus') || ''), additionalNeeds: String(fd.get('additionalNeeds') || '').trim(),
      },
      professionalInformation: {
        highestQualification: String(fd.get('highestQualification') || '').trim(), currentEmployer: String(fd.get('currentEmployer') || '').trim(),
        currentJobTitle: String(fd.get('currentJobTitle') || '').trim(), yearsExperience: String(fd.get('yearsExperience') || ''),
        professionalProfile: String(fd.get('professionalProfile') || '').trim(),
      },
      professionalRegistration: {
        registered: String(fd.get('registered') || ''), regulatoryBody: String(fd.get('regulatoryBody') || '').trim(),
        registrationNumber: String(fd.get('registrationNumber') || '').trim(), registrationStatus: String(fd.get('registrationStatus') || '').trim(),
        comments: String(fd.get('registrationComments') || '').trim(),
      },
      internationalCareer: { destinations: values('destinations'), plans: String(fd.get('relocationPlans') || '').trim() },
      supportRequired: values('supportRequired'),
      serviceRequirements: { sessions: String(fd.get('sessions') || '') },
      additionalInformation: String(fd.get('additionalInformation') || '').trim(),
      consent: { communications: fd.get('consentCommunications') === 'on', privacy: fd.get('consentPrivacy') === 'on' },
      website: String(fd.get('registrationWebsite') || ''),
    };
    try {
      const { data, error } = await supabase.functions.invoke('submit-swab-registration', { body: payload });
      if (error) { console.error('SWAB registration error:', error); throw new Error('We could not submit your registration. Please try again or contact SWAB by email.'); }
      if (data?.saved && data?.emailSent) { setRegistrationStatus('success'); form.reset(); }
      else if (data?.saved && !data?.emailSent) { setRegistrationStatus('partial'); form.reset(); }
      else throw new Error(data?.error || 'Your registration could not be saved. Please try again.');
    } catch (error) {
      console.error('SWAB registration error:', error);
      setRegistrationError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally { setRegistrationSubmitting(false); }
  };

  return (
    <section className="bg-slate-100 py-14 text-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8 sm:space-y-14">
        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-600">Contact Us</span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Get in Touch</h1>
          <div className="mx-auto h-1.5 w-20 rounded-full bg-amber-400" />
          <p className="text-sm leading-7 text-slate-600 sm:text-base">Whether you are an aspiring international social worker, an experienced practitioner seeking support, a Local Authority recruiting internationally, a university seeking a guest lecturer, or an organisation interested in collaboration, SWAB welcomes opportunities to connect, learn and work together.</p>
          <p className="text-sm leading-7 text-slate-600 sm:text-base">Our services support social workers at different stages of their professional journey, from relocation preparation and transition into practice through to professional development, workforce development and knowledge exchange.</p>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-3">
          <aside className="order-2 space-y-6 lg:order-1">
            <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950 p-6 text-white shadow-xl sm:p-8">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl" />
              <h2 className="relative border-b border-slate-800 pb-4 font-serif text-xl font-bold text-amber-400">Contact Information</h2>
              <div className="relative mt-6 space-y-6 text-sm">
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">WhatsApp Direct</p><p className="mt-1 text-slate-300">Questions about relocation, registration, training, probation support, professional development or the SWAB Transition Programme?</p><a className="mt-2 inline-block font-semibold text-amber-400 hover:underline" href="https://wa.me/447352143182" target="_blank" rel="noopener noreferrer">+44 7352 143182</a><a className="mt-2 block font-bold text-emerald-400 hover:underline" href="https://wa.me/447352143182" target="_blank" rel="noopener noreferrer">Chat with SWAB on WhatsApp ↗</a></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</p><a className="mt-1 inline-block break-all font-semibold text-amber-400 hover:underline" href="mailto:info@socialworkacrossborders.co.uk">info@socialworkacrossborders.co.uk</a><p className="mt-3 text-xs text-slate-400">For general enquiries, programmes, training, employer and Local Authority enquiries, university lectures, speaking engagements, research collaborations and partnerships.</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Primary Focus</p><p className="mt-1 font-medium leading-6 text-slate-100">International Social Worker Development, Professional Learning and Practice Excellence</p></div>
                <div><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Global Reach</p><p className="mt-1 leading-6 text-slate-300">Supporting social workers, educators, employers and organisations across the United Kingdom and internationally through learning, professional development and knowledge exchange.</p></div>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-900">Connect With SWAB</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Follow SWAB for professional insights, research updates, learning resources, practice discussions and international social work perspectives.</p>
              <div className="mt-5 grid grid-cols-3 gap-2">{socialLinks.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className={`group flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-700 transition hover:scale-[1.02] hover:text-white ${s.color}`}><span className="mb-1 text-lg">{s.icon}</span><span className="text-[10px] font-semibold">{s.name}</span></a>)}</div>
              <p className="mt-3 text-[10px] text-slate-400">YouTube and podcast platforms — future channels.</p>
            </div>
          </aside>

          <div className="order-1 space-y-6 lg:col-span-2 lg:order-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-9">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600">We would love to hear from you</p><h2 className="mt-1 font-serif text-2xl font-bold text-slate-950">Send a Message</h2></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">General enquiries</span></div>
              {status === 'success' ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center text-emerald-900"><h3 className="font-serif text-xl font-bold">Message Successfully Sent</h3><p className="mt-2 text-sm leading-6">Thank you for contacting Social Work Across Borders. Your enquiry has been securely recorded and an email notification has been sent to our team. We will review your message and respond as soon as possible.</p><button type="button" onClick={() => setStatus(null)} className="mt-4 text-sm font-bold underline">Send another message</button></div> : status === 'partial' ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-950"><h3 className="font-serif text-xl font-bold">Your Enquiry Has Been Saved</h3><p className="mt-2 text-sm leading-6">Your message has been securely recorded, but our email notification service could not send the notification. Your enquiry has not been lost. You can also contact us directly by email or WhatsApp.</p><button type="button" onClick={() => setStatus(null)} className="mt-4 text-sm font-bold underline">Send another message</button></div> : <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" /></div>
                <div className="grid gap-4 sm:grid-cols-2"><div><label className={labelClass} htmlFor="contact-full-name">Full Name *</label><input id="contact-full-name" name="fullName" required maxLength={120} autoComplete="name" placeholder="Your full name" className={inputClass} /></div><div><label className={labelClass} htmlFor="contact-email">Email Address *</label><input id="contact-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" className={inputClass} /></div></div>
                <div><label className={labelClass} htmlFor="contact-inquiry-type">Enquiry Type *</label><select id="contact-inquiry-type" name="inquiryType" required defaultValue="General Enquiries" className={inputClass}><option>General Enquiries</option><option>SWAB Transition Programme</option><option>Professional Development Training</option><option>Employer & Local Authority Enquiries</option><option>University Lectures</option><option>Speaking Engagements</option><option>Research Collaborations</option><option>Partnerships</option></select></div>
                <div><label className={labelClass} htmlFor="contact-message">Message *</label><textarea id="contact-message" name="message" rows={5} required maxLength={5000} placeholder="Please tell us how we can help..." className={`${inputClass} resize-y`} /></div>
                {errorMessage && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>}
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-amber-400 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{submitting ? 'Sending Message...' : 'Send Message'}</button>
                <p className="text-[11px] text-slate-500">Your details will only be used to respond to your enquiry.</p>
              </form>}
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 p-6 shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="max-w-xl"><span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Registration & Support Request</span><h2 className="mt-2 font-serif text-2xl font-bold text-slate-950">Register to Access SWAB Support, Training & Professional Development Services</h2><p className="mt-3 text-sm leading-6 text-slate-600">Tell us about your professional background, career aspirations and support needs. We will use the information to help identify suitable learning, mentoring, training and development pathways.</p></div><button type="button" onClick={() => { setRegistrationOpen(true); setRegistrationStatus(null); setRegistrationError(''); }} className="shrink-0 rounded-xl bg-slate-950 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-slate-800">Start Registration <span aria-hidden="true">→</span></button></div>
              <p className="mt-5 border-t border-amber-200 pt-4 text-xs leading-5 text-slate-500">Your information is treated confidentially and handled in accordance with applicable data protection requirements. Registration is a support enquiry and does not create a website login account.</p>
            </div>
          </div>
        </div>
      </div>

     {registrationOpen && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true" aria-labelledby="registration-title">
        <div className="flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-slate-50 shadow-2xl sm:rounded-3xl">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-8"><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">SWAB • Registration & Support Request</p><h2 id="registration-title" className="mt-1 font-serif text-xl font-bold sm:text-2xl">Professional Support Registration</h2><p className="mt-1 text-xs text-slate-300">Complete the sections relevant to your circumstances. Required fields are marked *.</p></div><button type="button" aria-label="Close registration" onClick={() => setRegistrationOpen(false)} className="rounded-full border border-slate-700 px-3 py-1.5 text-xl leading-none text-slate-300 hover:bg-slate-800">×</button></div>
          <div className="overflow-y-auto px-5 py-6 sm:px-8">
            {registrationStatus === 'success' ? <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"><div className="text-3xl">✓</div><h3 className="mt-3 font-serif text-2xl font-bold text-emerald-950">Registration Submitted</h3><p className="mt-3 text-sm leading-6 text-emerald-800">Thank you. Your registration has been saved and the PDF copy has been emailed to the SWAB team.</p><button type="button" onClick={() => { setRegistrationOpen(false); setRegistrationStatus(null); }} className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">Close</button></div> : registrationStatus === 'partial' ? <div className="mx-auto max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center"><h3 className="font-serif text-2xl font-bold text-amber-950">Registration Saved</h3><p className="mt-3 text-sm leading-6 text-amber-900">Your registration is safely stored, but the email/PDF notification could not be sent. The SWAB team can still access your submission.</p><button type="button" onClick={() => { setRegistrationOpen(false); setRegistrationStatus(null); }} className="mt-6 rounded-xl bg-slate-950 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white">Close</button></div> : <form onSubmit={handleRegistration} className="space-y-8">
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="registration-website">Leave this field empty</label><input id="registration-website" name="registrationWebsite" tabIndex={-1} autoComplete="off" /></div>
              <section className="space-y-4"><div><h3 className="font-serif text-lg font-bold text-slate-950">01. Personal Details</h3><p className="text-xs text-slate-500">Your contact and background details.</p></div><div className="grid gap-4 sm:grid-cols-2"><Field label="First Name" name="firstName" required /><Field label="Surname" name="surname" required /><Field label="Email Address" name="email" type="email" required /><Field label="WhatsApp Number" name="whatsappNumber" placeholder="Include country code" /><Field label="Country of Residence" name="countryOfResidence" required /><Field label="Country of Origin" name="countryOfOrigin" /><Field label="Gender" name="gender"><select id="registration-gender" name="gender" className={inputClass} defaultValue=""><option value="">Select an option</option><option>Male</option><option>Female</option><option>Prefer Not To Say</option><option>Other</option></select></Field><Field label="Marital Status" name="maritalStatus"><select id="registration-maritalStatus" name="maritalStatus" className={inputClass} defaultValue=""><option value="">Select an option</option>{['Single','Married','Divorced','Separated','Widowed','Prefer Not To Say'].map(x => <option key={x}>{x}</option>)}</select></Field><div className="sm:col-span-2"><Field label="Disability / Additional Needs" name="additionalNeeds" placeholder="Share any access or additional support needs (optional)" /></div></div></section>
              <section className="space-y-4 border-t border-slate-200 pt-7"><div><h3 className="font-serif text-lg font-bold text-slate-950">02. Professional Information</h3></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Highest Qualification" name="highestQualification" required /><Field label="Current Employer" name="currentEmployer" /><Field label="Current Job Title / Role" name="currentJobTitle" /><Field label="Years of Social Work Experience" name="yearsExperience"><select id="registration-yearsExperience" name="yearsExperience" className={inputClass} defaultValue=""><option value="">Select experience</option><option>Less than 1 year</option><option>1–3 years</option><option>4–7 years</option><option>8–10 years</option><option>More than 10 years</option></select></Field><div className="sm:col-span-2"><label className={labelClass} htmlFor="registration-professionalProfile">Brief Professional Profile</label><textarea id="registration-professionalProfile" name="professionalProfile" rows={3} className={inputClass} placeholder="Briefly describe your social work background and experience." /></div></div></section>
              <section className="space-y-4 border-t border-slate-200 pt-7"><div><h3 className="font-serif text-lg font-bold text-slate-950">03. Professional Registration</h3><p className="text-sm text-slate-600">Are you registered with a professional regulatory body?</p></div><div className="flex flex-wrap gap-4">{['Yes','No','Registration in Progress'].map(x => <label key={x} className="flex items-center gap-2 text-sm text-slate-700"><input type="radio" name="registered" value={x} className="h-4 w-4 accent-amber-500" />{x}</label>)}</div><div className="grid gap-4 sm:grid-cols-2"><Field label="Regulatory Body" name="regulatoryBody" placeholder="e.g. Social Work England, CORU" /><Field label="Registration Number" name="registrationNumber" /><Field label="Registration Status" name="registrationStatus" placeholder="Current / pending / other" /><Field label="Additional Comments" name="registrationComments" /></div><p className="text-xs leading-5 text-slate-500">Examples: Social Work England; CORU (Ireland); Social Care Wales; Scottish Social Services Council; SACSSP (South Africa); New Zealand Social Workers Registration Board; Australian Association of Social Workers; Council of Social Workers, Zimbabwe; other relevant professional bodies.</p></section>
              <section className="space-y-4 border-t border-slate-200 pt-7"><div><h3 className="font-serif text-lg font-bold text-slate-950">04. International Career Aspirations</h3><p className="text-sm text-slate-600">Which country are you interested in practising in? Select all that apply.</p></div><CheckGrid name="destinations" options={destinationOptions} /><div><label className={labelClass} htmlFor="registration-relocationPlans">Tell us about your relocation plans, career aspirations or areas of interest</label><textarea id="registration-relocationPlans" name="relocationPlans" rows={4} className={inputClass} /></div></section>
              <section className="space-y-4 border-t border-slate-200 pt-7"><div><h3 className="font-serif text-lg font-bold text-slate-950">05. Support Required</h3><p className="text-sm text-slate-600">What type of support are you interested in? Select all that apply.</p></div><CheckGrid name="supportRequired" options={supportOptions} /></section>
              <section className="space-y-4 border-t border-slate-200 pt-7"><div><h3 className="font-serif text-lg font-bold text-slate-950">06. Service Requirements</h3><p className="text-sm text-slate-600">How many support sessions are you looking for?</p></div><div className="grid gap-2 sm:grid-cols-2">{['One Session','2–4 Sessions','5–10 Sessions','Ongoing Support','Not Sure Yet'].map(x => <label key={x} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 text-sm"><input type="radio" name="sessions" value={x} className="h-4 w-4 accent-amber-500" />{x}</label>)}</div></section>
              <section className="space-y-4 border-t border-slate-200 pt-7"><div><h3 className="font-serif text-lg font-bold text-slate-950">07. Additional Information</h3><p className="text-sm leading-6 text-slate-600">Please provide any further information that may help us understand your circumstances and support needs. Examples may include upcoming interviews, relocation plans, probation concerns, training requirements, professional challenges, career goals and areas where support is required.</p></div><textarea name="additionalInformation" rows={5} className={inputClass} placeholder="Additional information..." /></section>
              <section className="space-y-4 border-t border-slate-200 pt-7"><h3 className="font-serif text-lg font-bold text-slate-950">08. Consent</h3><label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"><input type="checkbox" name="consentCommunications" required className="mt-1 h-4 w-4 accent-amber-500" /><span>I consent to SWAB contacting me regarding relevant professional development opportunities, learning events, mentoring services, support programmes and future communications. *</span></label><label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700"><input type="checkbox" name="consentPrivacy" required className="mt-1 h-4 w-4 accent-amber-500" /><span>I understand that my information will be processed in accordance with SWAB's Privacy Policy and applicable Data Protection legislation. *</span></label></section>
              {registrationError && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{registrationError}</div>}
              <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center"><p className="max-w-xl text-xs leading-5 text-slate-500">On submission, your registration is saved to the SWAB database and a PDF copy is sent to the SWAB team by email.</p><button type="submit" disabled={registrationSubmitting} className="rounded-xl bg-amber-400 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60">{registrationSubmitting ? 'Submitting Registration...' : 'Submit Registration'}</button></div>
            </form>}
          </div>
        </div>
      </div>}
    </section>
  );
}
