# MYRA Society — Decisions Log

Ce document trace les décisions de design / direction artistique / contenu prises par Jeremy au fur et à mesure de l'évolution du site. Il sert de référence pour éviter de répéter des erreurs et garantir la cohérence de la marque.

---

## Positionnement validé

- **Niveau 1** : Private Recovery House
- **Niveau 2** : L'art de recevoir le corps
- **Niveau 3** : Marlenheim, Alsace · En construction
- **Niveau 4** : Hébergements existants · communauté · investisseurs · news
- **Niveau 5** : Services futurs (spa, fitness, nutrition) évoqués comme vision, jamais détaillés comme produits figés

---

## Architecture validée

5 pages :
1. Home
2. Hébergements
3. Nous rejoindre (anciennement `/soutenir`)
4. News
5. Contact

Pas de pages individuelles pour les services (spa, fitness, nutrition, training, recovery).

---

## Phrases / formulations validées

### Phrases manifestes
- Not a hotel. A way of living.
- L'art de recevoir le corps.
- The body has a house now.
- Marlenheim is day one.
- Work hard. Recover hard. Back to life.
- En construction. Déjà en mouvement.
- Plus intime qu'un hôtel. Plus exigeant qu'un club. Plus incarné qu'un spa.
- Coming quietly.
- A house in progress.
- Access by stay, invitation or founding membership.

### Positionnement court
- Private Recovery House
- Maison privée de récupération, d'hospitalité et de performance

### CTA validés
- Découvrir la mission
- Nous rejoindre
- Contacter MYRA
- Demander un accès
- Demander le dossier privé
- Rejoindre le cercle fondateur
- Proposer un partenariat
- Demander une disponibilité

### CTA interdits sur la home
- Réserver (autorisé uniquement sur la page Hébergements)

---

## Décisions design accumulées (session courante)

### Palette (immuable)
- Ink #0C0C0A — fond dominant
- Porcelain #F4F5F0 — fond sections claires
- Stone #D8D5CD — séparateurs
- Denim #465364 — micro-labels
- Smoky Plum #4E3D42 — profondeur club/investor room (sous-utilisé pour l'instant)
- Bordeaux #351421 — accent ULTRA rare (max 2% de la surface)

### Typographie
- Cormorant Garamond (font-serif) + Montserrat (font-sans)
- Jamais de bold 700 — max font-medium 500
- Hero home h1 : font-serif uppercase, "tagline_2" en italic sentence case
- Statement tagline : `clamp(16px, 2vw, 26px)` letterSpacing 0.10em leading 1.7

### Spacing scale (3 tiers home)
- feature : `py-20 md:py-40` (Statement)
- major : `py-16 md:py-32` (EquinoxSections #01, SupportPoster)
- standard : `py-14 md:py-24` (Complexe, DoubleImage, Équipe, EquinoxSections #02 #03)

### Layouts asymétriques (home)
- Complexe : col-span-2 texte + col-span-9 col-start-4 image
- EquinoxSections : md:col-span-7 image + md:col-span-5 contenu
- Équipe : lg:col-span-7 image + lg:col-span-5 contenu
- DoubleImage : col-span-6 image1 + col-span-4 image2 + col-span-2 texte

### Eyebrow standardisé
- Trait `w-4 h-px` opacity 0.4 backgroundColor Bordeaux (sauf sections Ink → opacity peut être 0.30-0.40)
- Suivi d'un h2 ou h3 selon contexte avec classes Cap accent (font-sans text-[11px] tracking-[0.55em] uppercase color Bordeaux)

### Filtres images (système commun)
- Standard : `saturate(0.85) brightness(0.92) contrast(1.04)`
- Hero/dark contexts : `saturate(0.85) brightness(0.50) contrast(1.06)` (avec brightness modulé)
- Exception SupportPoster bg : `grayscale(1) brightness(0.28) contrast(1.12)` (B&W cinéma)
- Banner Citation flower : `saturate(0.72) brightness(0.75)` ou similaire (artwork DA, garder couleur)

### Smooth scroll
- Lenis installé via `components/SmoothScroll.js` rendu dans `app/[locale]/layout.js`
- Duration 1.2s, easing cubic
- Désactivé si prefers-reduced-motion

### Hero pacing
- Durations entrée 2.0s / 1.8s (vs standard 1.4s) pour effet "savor"
- Ken-burns 3.5s sur images Hero

---

## Corrections utilisateur récentes

### CTA "Demander un accès" dans Navbar (REJETÉ)
- Date : 2026-05-12
- Décision : Pas de bouton CTA dans la Navbar — "je trouve qu'il mène à rien"
- Implication : Navbar reste minimaliste. Les CTA importants (dossier privé / contact) restent dans les pages, pas dans le header global.
- i18n key `nav.access_cta` conservée dans messages pour usage futur potentiel (sections, footer)

### Section 3 entrées INVEST/PARTNER/BELONG sur /nous-rejoindre (REJETÉ)
- Date : 2026-05-12
- Décision : Pas de section "Nous rejoindre" avec 3 cartes INVEST/PARTNER/BELONG sur la page /nous-rejoindre — "enleve la section avec les trois entrées"
- Implication : Pas de pattern Paris Society 3-entries sur /nous-rejoindre. La page conserve sa structure existante : Hero / Genèse / Services / Timeline / SectionCercles (offres I/II/III) / Final. Les 3 catégories d'audience (investisseurs / partenaires / communauté) ne sont pas explicitement segmentées — un parcours unique.

## Erreurs à ne pas répéter

- Transformer le site en one page
- Créer trop de pages services (spa/fitness/nutrition/etc.)
- Parler de services non finalisés comme s'ils étaient figés
- Utiliser le mot "gîte"
- Faire un site hôtelier classique
- Faire un site spa beige
- Utiliser des CTA génériques ("Réserver", "En savoir plus", "Envoyer")
- Écrire trop de textes marketing
- Coder sans expliquer
- Supprimer la base existante sans justification
- Repartir de zéro
- **Animer les chiffres visibles avec count-up (0 → valeur)** — rejet explicite Jeremy
- **Ajouter des éléments visuels au Hero** (CTA, scroll cue, séparateurs, eyebrows additionnels) — Hero minimal est signature
- **Appliquer grayscale fort aux artworks** (`/DA/*`) — garder couleurs sur les images de direction artistique
- **Couleurs hors palette** : doré, beige wellness, vert sauge, rose poudré, bleu, vert, orange
- **#2B1022** (faux Bordeaux) ou **#F3F2EF** (faux Porcelain) — toujours utiliser les valeurs brand book exactes
- Cards arrondies / ombres / design SaaS / gradients
- Hover JS `onMouseEnter/Leave` quand Tailwind `hover:` peut faire la même chose

---

## Questions ouvertes

(aucune pour le moment)

## Réponses validées

| Question | Réponse |
|---|---|
| EquinoxSections | **Garder** (chambres / table / récupération) — pas remplacer par NEW AT MYRA. **Mais transformer chaque section en full-screen Gentle Monster** : chaque scroll = changement d'univers |
| Page /news | **Créer le squelette** maintenant |
| Renommage /soutenir → /nous-rejoindre | **OK** + redirection 301 de l'ancienne URL |
| Copy | **Claude propose placeholders factuels**, Jeremy refine après |

## Principes éditoriaux validés (post audit)

- **Le moins de texte le mieux** — partout, en particulier Hero
- **Home : garder le style présent** (pas de full-screen agressif sur home, on conserve les sections + polish)
- **Full-screen Gentle Monster uniquement sur `/nous-rejoindre`** — pour montrer spa / fitness / restaurant en explication immersive de la vision
- **Focus style éditorial** — magazine, asymétrique, grands visuels, micro-copy
- **EquinoxSections (Chambres / Table / Récupération) reste sur la home** dans le style actuel

---

## Historique des étapes

| Étape | Date | Décision |
|---|---|---|
| Audit Étape 1 | 2026-05-12 | En attente validation Jeremy |
