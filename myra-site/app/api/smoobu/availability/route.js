import { NextResponse } from 'next/server';

export async function POST(request) {
  const API_KEY   = process.env.SMOOBU_API_KEY;
  const CLIENT_ID = process.env.SMOOBU_CLIENT_ID;

  if (!API_KEY) {
    return NextResponse.json({ error: 'SMOOBU_API_KEY manquante' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
  }

  const { arrivalDate, departureDate, apartments, guests } = body;

  if (!arrivalDate || !departureDate || !apartments?.length) {
    return NextResponse.json(
      { error: 'arrivalDate, departureDate et apartments sont requis' },
      { status: 400 }
    );
  }

  if (arrivalDate >= departureDate) {
    return NextResponse.json(
      { error: 'La date de départ doit être après la date d\'arrivée' },
      { status: 400 }
    );
  }

  try {
    const smoobuBody = {
      arrivalDate,
      departureDate,
      apartments,
      ...(CLIENT_ID && { customerId: Number(CLIENT_ID) }),
      ...(guests && { guests: Number(guests) }),
    };

    const res = await fetch('https://login.smoobu.com/booking/checkApartmentAvailability', {
      method: 'POST',
      headers: {
        'Api-Key': API_KEY,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(smoobuBody),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Smoobu ${res.status}`, raw: err }, { status: res.status });
    }

    const data = await res.json();

    const msPerDay = 86400000;
    const nights   = Math.round(
      (new Date(departureDate) - new Date(arrivalDate)) / msPerDay
    );

    const enrichedPrices = {};
    if (data.prices) {
      Object.entries(data.prices).forEach(([aptId, priceInfo]) => {
        enrichedPrices[aptId] = {
          total:    priceInfo.price,
          perNight: nights > 0 ? Math.round(priceInfo.price / nights) : null,
          nights,
          currency: priceInfo.currency,
        };
      });
    }

    return NextResponse.json({
      availableApartments: data.availableApartments ?? [],
      prices:              enrichedPrices,
      errors:              data.errorMessages ?? {},
      nights,
      period:              { arrivalDate, departureDate },
    });
  } catch (err) {
    console.error('[Smoobu/availability] Erreur:', err);
    return NextResponse.json({ error: 'Erreur réseau Smoobu' }, { status: 503 });
  }
}