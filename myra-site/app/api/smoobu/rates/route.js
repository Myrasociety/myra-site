import { NextResponse } from 'next/server';

const API_KEY  = process.env.SMOOBU_API_KEY;
const BASE_URL = 'https://login.smoobu.com/api';

export const APARTMENT_IDS = [2450913, 2868461, 2637623, 1920032];

const toKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export async function GET(request) {
  if (!API_KEY) {
    return NextResponse.json({ error: 'SMOOBU_API_KEY manquante' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);

  const today = new Date();
  const inOneYear = new Date(today);
  inOneYear.setFullYear(today.getFullYear() + 1);

  const startDate = searchParams.get('start_date') ?? toKey(today);
  const endDate   = searchParams.get('end_date')   ?? toKey(inOneYear);

  const requestedIds = searchParams.getAll('apartments[]').length > 0
    ? searchParams.getAll('apartments[]').map(Number)
    : APARTMENT_IDS;

  const url = new URL(`${BASE_URL}/rates`);
  requestedIds.forEach(id => url.searchParams.append('apartments[]', id));
  url.searchParams.set('start_date', startDate);
  url.searchParams.set('end_date', endDate);

  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Api-Key': API_KEY,
        'Cache-Control': 'no-cache',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: `Smoobu API ${res.status}`, raw: body }, { status: res.status });
    }

    const raw = await res.json();
    const transformed = {};

    if (raw.data) {
      Object.entries(raw.data).forEach(([aptId, calendar]) => {
        transformed[aptId] = {
          id: Number(aptId),
          calendar: {},
          stats: { minPrice: Infinity, maxPrice: -Infinity, availableDays: 0 },
        };
        Object.entries(calendar).forEach(([date, day]) => {
          const isAvailable = day.available === 1;
          transformed[aptId].calendar[date] = {
            available: isAvailable,
            price: day.price ?? null,
            minStay: day.min_length_of_stay ?? 1,
          };
          if (isAvailable && day.price) {
            transformed[aptId].stats.minPrice = Math.min(transformed[aptId].stats.minPrice, day.price);
            transformed[aptId].stats.maxPrice = Math.max(transformed[aptId].stats.maxPrice, day.price);
            transformed[aptId].stats.availableDays++;
          }
        });
        if (transformed[aptId].stats.minPrice === Infinity) {
          transformed[aptId].stats.minPrice = null;
          transformed[aptId].stats.maxPrice = null;
        }
      });
    }

    return NextResponse.json(
      { data: transformed, fetchedAt: new Date().toISOString(), range: { startDate, endDate } },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
    );
  } catch (err) {
    return NextResponse.json({ error: 'Impossible de joindre Smoobu' }, { status: 503 });
  }
}