@AGENTS.md

# MYRA Society — Contexte Projet

## Identité
MYRA Society est un club privé de récupération et d'hébergement premium situé à Marlenheim, Alsace.
Positionnement : "Not a hotel. A way of living."
Ce n'est pas un hôtel spa générique. C'est un club confidentiel, sélectif, lifestyle et architectural.

## Stack Technique
- Next.js 16, App Router, Turbopack
- React 19, Framer Motion 12
- Tailwind CSS 4
- i18n : fr / en / de via /messages/*.json
- Réservations : Smoobu API (/api/smoobu/*)
- Paiement : Stripe (/api/checkout)
- Fonts : Montserrat (--font-sans) + Cormorant Garamond (--font-serif)

## Tokens de couleur — IMMUABLES
INK      = #0C0C0A   (fond principal, dominant)
PORCL    = #F4F5F0   (fond sections claires)
STONE    = #D8D5CD   (texte secondaire sur fond sombre)
DENIM    = #465364   (labels, micro-textes)
BORDEAUX = #351421   (accent unique — max 2% de la surface)
Ces valeurs ne changent jamais. Ne pas utiliser #2B1022 ni #3D0D0C.

## Typographie
- Titres display : font-serif (Cormorant Garamond), font-light, italic pour les sous-titres
- Corps : font-sans (Montserrat), font-light ou font-medium (500)
- Labels : font-sans, text-[9-11px], uppercase, tracking-[0.4-0.6em]
- Jamais de bold (700) — maximum font-medium (500)

## Règles de design — NE JAMAIS ENFREINDRE
1. Fond dominant = Ink (#0C0C0A). Les sections claires (Porcelain) sont l'exception.
2. L'accent Bordeaux (#351421) s'utilise en règle (1.5px), underline hover, et petits points. Jamais en fond de surface large.
3. Photos : filter grayscale + contrast élevé. Jamais de photos couleur saturées.
4. Grain analogique sur toutes les sections Ink : opacity 0.035, fractalNoise SVG.
5. Transitions : cubic-bezier(0.16, 1, 0.3, 1) — jamais ease-in-out standard.
6. Espaces négatifs généreux — ne jamais surcharger.
7. Zéro bordure radius sur les éléments UI (boutons, cards) — tout est carré.

## Ton éditorial — ADN Verbal
- Unapologetic ambition : direct, sans excuse
- Cut the bullshit : pas de jargon spa/wellness générique
- Poetic realism : précis et sensoriel
- Franglais organique : mélange naturel fr/en

Exemples :
- ❌ "Profitez de nos installations de bien-être"
- ✅ "Votre récupération. Sérieusement."
- ❌ "Réserver" → ✅ "Accéder"
- ❌ "Envoyer" → ✅ "Transmettre"
- ❌ "En savoir plus" → ✅ "Découvrir"

## Architecture des fichiers clés
app/[locale]/page.js          — Homepage
app/[locale]/layout.js        — Layout avec metadata OG
app/[locale]/hebergement/     — Listing suites + filtres
app/[locale]/hebergement/[id] — Fiche suite + réservation
app/[locale]/contact/         — Page contact
app/[locale]/soutenir/        — Page investisseurs/club
components/Navbar.js          — Navigation fixe
components/Footer.js          — Footer Ink
components/Contact.js         — Formulaire réutilisable
lib/fonts.js                  — Montserrat + Cormorant
lib/useSmoobu.js              — Hook disponibilités
styles/globals.css            — Tokens CSS + utilitaires
messages/fr.json              — Traductions FR

## Règles techniques critiques
- motion.img (Framer Motion) NE PEUT PAS être remplacé par next/image
- Tous les attributs JSX complexes sur une seule ligne dans les .map() — Turbopack bug
- Jamais de localStorage/sessionStorage
- Le bordeaux dans les underlines hover : backgroundColor: '#351421'
- Composants 'use client' uniquement quand nécessaire

## Suites disponibles
- Edwige (smoobuId: 2450913) — 120m², 4 personnes
- Wingert (smoobuId: 2868461) — 120m², 4 personnes  
- Julia (smoobuId: 2637623) — 95m², 2 personnes

## À ne jamais faire
- Ajouter des border-radius sur les boutons ou cards MYRA
- Utiliser des couleurs hors palette (pas de bleu, vert, orange)
- Écrire du copy générique type "Bienvenue chez nous"
- Casser l'encodage UTF-8 des fichiers (problème PowerShell Windows)
- Modifier la logique Smoobu ou Stripe sans validation explicite