'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/lib/useTranslations';

const EASE = [0.16, 1, 0.3, 1];

export default function ContactSection() {
  const t = useTranslations('contact');
  const [form, setForm] = useState({ type: 'sejour', name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const fieldAutoComplete = { name: 'name', email: 'email', message: 'off' };

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ type: 'sejour', name: '', email: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 6000);
    } catch {}
    finally { setSending(false); }
  }

  const typeOptions = [
    { value: 'sejour',     label: t('type_sejour') },
    { value: 'invest',     label: t('type_invest') },
    { value: 'partner',    label: t('type_partner') },
    { value: 'community',  label: t('type_community') },
    { value: 'press',      label: t('type_press') },
    { value: 'other',      label: t('type_other') },
  ];

  const fields = [
    { key: 'name',    label: t('name'),    type: 'text',  placeholder: t('name_placeholder') },
    { key: 'email',   label: t('email'),   type: 'email', placeholder: t('email_placeholder') },
    { key: 'message', label: t('message'), type: 'area',  placeholder: t('message_placeholder') },
  ];

  const ContactInfo = () => (
    <div className="space-y-4 pt-8 border-t border-[rgba(12,12,10,0.06)]">
      <a href="tel:+33637038677" className="flex items-center gap-4 group">
        <div className="w-px h-4 bg-[rgba(53,20,33,0.35)]" />
        <span className="font-serif text-[11px] md:text-[12px] uppercase tracking-[0.20em] text-[rgba(12,12,10,0.40)] group-hover:text-[#0C0C0A] transition-colors duration-400">
          +33 (0)6 37 03 86 77
        </span>
      </a>
      <a href="mailto:contact@myrasociety.com" className="flex items-center gap-4 group">
        <div className="w-px h-4 bg-[rgba(53,20,33,0.35)]" />
        <span className="font-serif text-[11px] md:text-[12px] uppercase tracking-[0.20em] text-[rgba(12,12,10,0.40)] group-hover:text-[#0C0C0A] transition-colors duration-400">
          contact@myrasociety.com
        </span>
      </a>
    </div>
  );

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-[#f6f6f3] pt-28 md:pt-40 pb-20 md:pb-32">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

          {/* GAUCHE */}
          <div className="md:col-span-4">
            <h2 id="contact-title" className="font-sans font-light leading-[1.05] tracking-[-0.02em] text-[#0C0C0A] mb-6 md:mb-8"
              style={{ fontSize: 'clamp(28px, 4vw, 56px)' }}>
              {t('title_line1')}<br /><em>{t('title_line2')}</em>
            </h2>
            <div className="hidden md:block">
              <ContactInfo />
            </div>
          </div>

          {/* DROITE */}
          <div className="md:col-span-7 md:col-start-6 md:border-l border-[rgba(12,12,10,0.05)] md:pl-16">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="sent" role="status" aria-live="polite"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                  <div className="text-center space-y-6">
                    <div className="w-8 h-px mx-auto bg-[rgba(53,20,33,0.35)]" />
                    <p className="font-sans text-[22px] md:text-[28px] italic text-[rgba(12,12,10,0.60)]">{t('success')}</p>
                    <p className="font-serif text-[10px] md:text-[11px] uppercase tracking-[0.40em] text-[rgba(53,20,33,0.50)]">{t('success_sub')}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }} className="space-y-8 md:space-y-10">

                  {/* Type de demande */}
                  <div className="space-y-2 md:space-y-3">
                    <label htmlFor="contact-type" className="block font-serif text-[10px] md:text-[11px] uppercase tracking-[0.50em] text-[rgba(12,12,10,0.30)]">{t('type_label')}</label>
                    <div className="relative">
                      <select id="contact-type" value={form.type} onChange={set('type')}
                        className="w-full bg-transparent border-b pb-3 font-sans text-[13px] md:text-[14px] uppercase tracking-[0.10em] text-[#0C0C0A] focus:outline-none transition-colors duration-500 appearance-none cursor-pointer border-[rgba(12,12,10,0.10)] focus:border-[rgba(53,20,33,0.40)]"
                        style={{ backgroundImage: 'none' }}>
                        {typeOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
                        className="absolute right-1 bottom-3 pointer-events-none text-[rgba(12,12,10,0.40)]">
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>

                  {fields.map(({ key, label, type, placeholder }) => (
                    <div key={key} className="space-y-2 md:space-y-3">
                      <label htmlFor={`contact-${key}`} className="block font-serif text-[10px] md:text-[11px] uppercase tracking-[0.50em] text-[rgba(12,12,10,0.30)]">{label}</label>
                      <div className="relative">
                        {type === 'area' ? (
                          <textarea id={`contact-${key}`} required rows={4} value={form[key]} onChange={set(key)}
                            autoComplete={fieldAutoComplete[key]}
                            placeholder={placeholder}
                            className="w-full bg-transparent border-b pb-3 font-sans text-[13px] md:text-[14px] text-[#0C0C0A] placeholder:text-[rgba(12,12,10,0.18)] focus:outline-none transition-colors duration-500 resize-none border-[rgba(12,12,10,0.10)] focus:border-[rgba(53,20,33,0.40)]" />
                        ) : (
                          <input id={`contact-${key}`} type={type} required value={form[key]} onChange={set(key)}
                            autoComplete={fieldAutoComplete[key]}
                            placeholder={placeholder}
                            className="w-full bg-transparent border-b pb-3 font-sans text-[13px] md:text-[14px] text-[#0C0C0A] placeholder:text-[rgba(12,12,10,0.18)] focus:outline-none transition-colors duration-500 border-[rgba(12,12,10,0.10)] focus:border-[rgba(53,20,33,0.40)]" />
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="md:hidden">
                    <ContactInfo />
                  </div>

                  <button type="submit" disabled={sending}
                    className="font-serif text-[9px] md:text-[11px] tracking-[0.55em] uppercase px-8 md:px-10 py-4 transition-all duration-500 disabled:opacity-40 outline-none bg-[#0C0C0A] hover:bg-[#351421] text-[#f6f6f3]">
                    {sending ? t('sending') : t('send')}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}