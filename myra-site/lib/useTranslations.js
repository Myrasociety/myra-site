'use client';

import { useParams } from 'next/navigation';
import { getTranslations } from './i18n';

export function useTranslations(namespace) {
  const params = useParams();
  const locale = params?.locale || 'fr';
  return getTranslations(locale, namespace);
}

export function useLocale() {
  const params = useParams();
  return params?.locale || 'fr';
}