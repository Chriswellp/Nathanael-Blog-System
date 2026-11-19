import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { PDFDocument, StandardFonts, rgb } from 'npm:pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

function clean(value: unknown, max = 4000): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function flatten(value: unknown, prefix = ''): Array<[string, string]> {
  if (value === null || value === undefined || value === '') return [];
  if (Array.isArray(value)) return [[prefix, value.map(String).join(', ')]];
  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, val]) => flatten(val, prefix ? `${prefix} / ${key}` : key));
  }
  return [[prefix, String(value)]];
}

async function createRegistrationPdf(payload: Record<string, unknown>) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageSize: [number, number] = [595.28, 841.89];
  let page = pdf.addPage(pageSize);
  let y = 790;
  const left = 48;
  const width = 499;
  const navy = rgb(0.04, 0.09, 0.17);
  const amber = rgb(0.93, 0.66, 0.17);
  const addPage = () => { page = pdf.addPage(pageSize); y = 790; };
  const drawText = (text: string, font = regular, size = 9, color = navy, indent = 0) => {
    const words = text.replace(/[\r\n]+/g, ' ').split(/\s+/);
    let line = '';
    const maxWidth = width - indent;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        if (y < 55) addPage();
        page.drawText(line, { x: left + indent, y, size, font, color }); y -= size + 4; line = word;
      } else line = test;
    }
    if (line) { if (y < 55) addPage(); page.drawText(line, { x: left + indent, y, size, font, color }); y -= size + 5; }
  };
  page.drawRectangle({ x: 0, y: 0, width: pageSize[0], height: pageSize[1], color: rgb(1, 1, 1) });
  page.drawRectangle({ x: 0, y: 805, width: pageSize[0], height: 37, color: navy });
  page.drawText('SOCIAL WORK ACROSS BORDERS (SWAB)', { x: left, y: 818, size: 12, font: bold, color: rgb(1, 1, 1) });
  y = 775;
  drawText('REGISTRATION & SUPPORT REQUEST', bold, 15, navy);
  drawText(`Submitted: ${new Date().toISOString()}`, regular, 8, rgb(0.35, 0.4, 0.47));
  y -= 8;
  for (const [section, data] of Object.entries(payload)) {
    if (section === 'website') continue;
    if (y < 85) addPage();
    page.drawRectangle({ x: left, y: y - 3, width, height: 19, color: rgb(0.96, 0.96, 0.95) });
    page.drawText(section.replace(/([A-Z])/g, ' $1').toUpperCase(), { x: left + 7, y: y + 2, size: 9, font: bold, color: navy });
    y -= 28;
    for (const [key, val] of flatten(data)) {
      drawText(`${key.replace(/([A-Z])/g, ' $1')}: ${val}`, regular, 8.5, navy, 6);
    }
    y -= 7;
  }
  const pages = pdf.getPages();
  pages.forEach((p, index) => {
    p.drawLine({ start: { x: left, y: 35 }, end: { x: left + width, y: 35 }, thickness: 0.5, color: amber });
    p.drawText(`SWAB confidential registration • Page ${index + 1} of ${pages.length}`, { x: left, y: 22, size: 7, font: regular, color: rgb(0.4, 0.43, 0.48) });
  });
  return await pdf.save();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const payload = await req.json();
    if (clean(payload?.website)) return json({ saved: true, emailSent: true }); // honeypot
    const personal = payload?.personalDetails ?? {};
    const firstName = clean(personal.firstName, 100);
    const surname = clean(personal.surname, 100);
    const email = clean(personal.email, 254).toLowerCase();
    if (!firstName || !surname || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Please provide your first name, surname and a valid email address.' }, 400);
    }
    if (payload?.consent?.communications !== true || payload?.consent?.privacy !== true) {
      return json({ error: 'Please confirm both consent statements before submitting.' }, 400);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    const toEmail = Deno.env.get('CONTACT_TO_EMAIL') || 'infor@socialworkeracrossborders.co.uk';
    const fromEmail = Deno.env.get('CONTACT_FROM_EMAIL') || 'SWAB Website <website@socialworkeracrossborders.co.uk>';
    if (!supabaseUrl || !serviceKey || !resendKey) throw new Error('The registration service is not fully configured.');

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: inserted, error: insertError } = await admin.from('swab_registrations').insert({
      first_name: firstName,
      surname,
      email,
      whatsapp_number: clean(personal.whatsappNumber, 60),
      registration_data: payload,
      email_status: 'pending',
    }).select('id').single();
    if (insertError) throw insertError;

    let emailSent = false;
    let emailError: string | null = null;
    try {
      const pdfBytes = await createRegistrationPdf(payload);
      let binary = '';
      for (let i = 0; i < pdfBytes.length; i++) binary += String.fromCharCode(pdfBytes[i]);
      const pdfBase64 = btoa(binary);
      const fullName = `${firstName} ${surname}`;
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `New SWAB Support Registration — ${fullName}`,
          text: `A new SWAB registration has been submitted.\n\nName: ${fullName}\nEmail: ${email}\nRegistration ID: ${inserted.id}\n\nThe completed registration is attached as a PDF.`,
          attachments: [{ filename: `SWAB-Registration-${inserted.id}.pdf`, content: pdfBase64 }],
        }),
      });
      if (!response.ok) throw new Error(`Resend returned ${response.status}: ${(await response.text()).slice(0, 500)}`);
      emailSent = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : 'Email delivery failed';
      console.error('SWAB registration email failed:', emailError);
    }

    await admin.from('swab_registrations').update({ email_status: emailSent ? 'sent' : 'failed', email_error: emailError }).eq('id', inserted.id);
    return json({ saved: true, emailSent, registrationId: inserted.id });
  } catch (err) {
    console.error('SWAB registration function error:', err);
    return json({ error: 'We could not process the registration. Please try again.' }, 500);
  }
});
