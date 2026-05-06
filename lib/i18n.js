import fr from '../messages/fr.json';
import en from '../messages/en.json';
import de from '../messages/de.json';

const messages = { fr, en, de };

export function getTranslations(locale, namespace) {
  const msgs = messages[locale] || messages.fr;
  const ns = msgs[namespace] || {};
  return (key) => ns[key] || key;
}

export const locales = ['fr', 'en', 'de'];
export const defaultLocale = 'fr';