import { NextResponse } from 'next/server';

export async function POST(req) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 500 });
  }

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email manquant' }, { status: 400 });
    }

    await resend.contacts.create({
      email,
      unsubscribed: false,
    });

    await resend.contacts.segments.add({
      email,
      segmentId: process.env.RESEND_SEGMENT_ID,
    });

    await resend.emails.send({
      from:    'MYRA Society <contact@myrasociety.com>',
      to:      email,
      subject: 'Bienvenue à la maison.',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 60px 40px; background: #F2EEE8;">
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5em; color: #2B1022; margin-bottom: 48px;">MYRA Society</p>
          <h1 style="font-size: 28px; font-weight: 300; letter-spacing: -0.02em; color: #0C0C0A; margin-bottom: 24px;">
            Bienvenue à la maison.
          </h1>
          <p style="font-size: 13px; line-height: 2.2; color: rgba(12,12,10,0.50); font-weight: 300; margin-bottom: 40px;">
            Vous faites maintenant partie des proches de MYRA Society. Saisons, rituels et invitations privées — vous serez les premiers informés.
          </p>
          <div style="width: 32px; height: 1px; background: #2B1022; opacity: 0.4; margin-bottom: 40px;"></div>
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.4em; color: rgba(12,12,10,0.25);">
            Marlenheim, Alsace
          </p>
        </div>
      `,
    });

    await resend.emails.send({
      from:    'MYRA Society <contact@myrasociety.com>',
      to:      'jeremy@myrasociety.com',
      subject: `Nouvel abonné newsletter — ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px; background: #F2EEE8;">
          <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5em; color: #2B1022; margin-bottom: 32px;">MYRA Society — Newsletter</p>
          <p style="font-size: 14px; color: #0C0C0A; font-weight: 300; line-height: 2;">
            Nouvel abonné : <strong>${email}</strong>
          </p>
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(12,12,10,0.08); font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; color: rgba(12,12,10,0.25);">
            Segment — Newsletter MYRA · Resend
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Subscribe]', err);
    return NextResponse.json({ error: 'Erreur inscription' }, { status: 500 });
  }
}