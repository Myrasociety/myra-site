import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    await resend.emails.send({
from: 'MYRA Society <contact@myrasociety.com>',
      to:      'jeremy@myrasociety.com',
      replyTo: email,
      subject: `Nouveau message de ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
          <h2 style="font-size: 18px; font-weight: 300; margin-bottom: 32px; letter-spacing: 0.1em; text-transform: uppercase;">
            Nouveau message — MYRA Society
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888; width: 100px;">Nom</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; color: #0C0C0A;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; color: #0C0C0A;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888; vertical-align: top; padding-top: 16px;">Message</td>
              <td style="padding: 12px 0; font-size: 14px; color: #0C0C0A; line-height: 1.8; padding-top: 16px;">${message.replace(/\n/g, '<br/>')}</td>
            </tr>
          </table>
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #eee; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #ccc;">
            MYRA Society — Marlenheim, Alsace
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Contact]', err);
    return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 });
  }
}