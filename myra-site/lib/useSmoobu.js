'use client';

// lib/useSmoobu.js
// Correction critique : /api/ en minuscules (sensible à la casse sur Linux/Vercel)

import { useState, useEffect, useCallback } from 'react';

const toKey = (date) => {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// ─── useRates ─────────────────────────────────────────────────────────────────
export function useRates(apartmentIds = []) {
  const [ratesData, setRatesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!apartmentIds.length) return;
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        apartmentIds.forEach(id => params.append('apartments[]', id));
        const res = await fetch(`/api/smoobu/rates?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setRatesData(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartmentIds.join(',')]);

  return { ratesData, isLoading, error };
}

// ─── useAvailability ──────────────────────────────────────────────────────────
export function useAvailability(checkIn, checkOut, apartmentIds, guests = 0) {
  const [availData, setAvailData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  const checkInKey  = toKey(checkIn);
  const checkOutKey = toKey(checkOut);

  const check = useCallback(async () => {
    if (!checkInKey || !checkOutKey || !apartmentIds?.length) {
      setAvailData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/smoobu/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          arrivalDate:   checkInKey,
          departureDate: checkOutKey,
          apartments:    apartmentIds,
          ...(guests > 0 && { guests }),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAvailData(data);
    } catch (e) {
      console.error('[useAvailability]', e);
      setError('Impossible de vérifier les disponibilités.');
      setAvailData(null);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkInKey, checkOutKey, apartmentIds?.join(','), guests]);

  useEffect(() => {
    check();
  }, [check]);

  return { availData, isLoading, error, refetch: check };
}

export { toKey };