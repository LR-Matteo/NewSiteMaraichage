# Handoff — O'régale des saisons (Refonte page d'accueil)

## Aperçu
Refonte de la page d'accueil de **O'régale des saisons**, un maraîcher en Haute-Vienne. Direction artistique éditoriale (feel magazine artisanal haut de gamme), avec hero full-bleed, typographie servie, et composition asymétrique.

## À propos des fichiers de design
Les fichiers de ce dossier sont des **références de design en HTML/React** — un prototype haute fidélité montrant l'apparence et le comportement souhaités, **pas du code de production à copier tel quel**. La tâche consiste à **recréer ce design dans l'environnement cible du codebase** (Next.js, Astro, WordPress, etc.) en utilisant ses patterns établis. Si aucun environnement n'existe, **Next.js + Tailwind** est un bon choix pour ce type de site éditorial.

Le prototype utilise React via Babel-in-browser (pratique pour itérer en design) — à ne **pas** reproduire en prod.

## Fidélité
**Haute fidélité (hifi)** — typographie, couleurs, espacements et compositions sont définitifs. Les images sont des **placeholders** texturés annotés (ex: « Photo maraîcher heure dorée ») : il faudra les remplacer par les vraies photos du client.

## Pour ouvrir dans VS Code

Le package contient **deux vues** : desktop et mobile. Ouvre `index.html` pour le hub avec choix entre les deux.


1. Décompresser le zip dans un dossier
2. `code design_handoff_o_regale/`
3. Servir le dossier en local (la page utilise des modules) :
   - **VS Code** : extension *Live Server* → clic droit sur `index.html` → *Open with Live Server*
   - **Ou** : `npx serve .` depuis le terminal

⚠️ Ne **pas** ouvrir `index.html` en double-clic (file://) — Babel a besoin d'un serveur HTTP pour charger les `.jsx` distants.

### Pages disponibles
- `index.html` — hub (choix desktop / mobile)
- `desktop.html` — version 1360px complète
- `mobile.html` — version 390px dans frame iOS

## Configuration finale validée
- **Palette** : `Forêt` (verts profonds + ocre doré)
- **Grille produits** : `Cartes` (grille 3 colonnes avec photo carrée, badge saison, prix éditorial)

Ces deux choix sont déjà câblés dans `index.html`.

## Sections de la page
1. **Header sticky** — pilule flottante avec logo, nav (4 sections), CTA téléphone orange
2. **Hero full-bleed** — image plein-écran, métadonnées en haut (édition, coordonnées GPS), titre 180px serif italique « Cultivé, *cueilli*, livré. », baseline + CTA
3. **Ticker valeurs** — bandeau charbon avec 5 pictos (sans pesticides, circuit court, vente directe, récolte du jour, zéro gaspillage)
4. **Notre histoire** — composition asymétrique avec chiffre géant « 15 » en filigrane derrière, photo + badge orange « récolté ce matin » incliné
5. **Engagements** — 4 cartes numérotées sur fond vert foncé
6. **Galerie** — mosaïque éditoriale 6 images, ratios variables
7. **Vidéo** — bandeau charbon, lecteur sur fond sombre, durée 04:32
8. **Aperçu produits** — 4 cartes (échantillon)
9. **Catalogue produits complet** (section navigable) — filtres pilule, grille **cartes**
10. **Promotions** (section navigable) — 3 paniers avec badges remise
11. **Contact** (section navigable) — 3 blocs contact + carte + zones de livraison en chips
12. **Footer** — 4 colonnes navigation/contact/ferme, fond charbon

Les sections **Nos Produits / Promotions / Contact** sont des vues commutées via `useState` dans `SiteB` — la nav remplace le contenu en place (SPA-like).

## Design tokens

### Palette Forêt (`shared.jsx` → `ORSPalettes.foret`)
```
vert         #2d4a2a   accent principal
vertDark     #1a2e18   sections sombres
vertSoft     #557047   accents secondaires
orange       #c89a3c   accent chaud (ocre doré)
orangeDark   #9a7424
creme        #f7f3e8   fond principal
cremeDark    #ede5cf   fond secondaire
sable        #e3d9bd   fond tertiaire / chips
charbon      #1c1a14   typographie + sections sombres
charbonSoft  #403d34   texte secondaire
charbonMute  #807868   texte tertiaire / labels
bord         #d2c8a8   bordures fines
```

### Typographie
- **Serif (titres)** : Fraunces (Google Fonts) — opsz 9..144, weights 300–700, italiques exploitées
- **Sans (corps)** : Inter — weights 400/500/600/700
- Échelle titres : 180px (hero), 120px (section H1), 84px / 64px / 56px / 40px / 30px / 24px / 22px
- Échelle corps : 18px / 16px / 15px / 14px / 13px
- Eyebrows / labels : 11px, letter-spacing 2.5px, uppercase, weight 600

### Spacing
- Padding sections : 120px (vertical) / 56px (horizontal)
- Marges latérales hero & header : 32px
- Gaps grilles : 16px / 20px / 24px / 32px / 48px / 72px

### Iconographie
Pictos custom SVG (line icons, stroke 1.4–1.8) — pas d'emojis. Bibliothèque dans `shared.jsx` → composant `Picto` :
`leaf, carrot, basket, sprout, sun, snow, pin, phone, mail, clock, arrowRight, play, scales, handshake, recycle, heart, harvest`.

### Border radius
- Pilules nav / chips / boutons : `999px`
- Boutons secondaires : `0` (carrés, feel éditorial)
- Cartes produits : `0`

## Données de démo
- **Téléphone** : 06 98 62 04 38
- **Email** : contact@o-regale-des-saisons.fr
- **Adresse** : 1 route de Lémarrière, 87360 Verneuil-Moustiers
- **Zones de livraison** : Magnac-Laval, Le Dorat, Lussac-les-Églises, Verneuil-Moustiers, Châteauponsac, Bellac
- **5 produits exemple** (été/hiver) dans `PRODUITS_B` (`site-b.jsx`)
- **3 paniers promo** : Découverte 18€, Famille 32€, Conserves 28€

## Comportement & interactions
- Nav SPA : `useState('accueil' | 'produits' | 'promotions' | 'contact')` — le contenu change sans navigation
- Filtres saison : `useState('toutes' | 'été' | 'hiver')` filtre la liste `PRODUITS_B`
- Hover : pas d'animations sophistiquées, transitions `.15s` sur les états actifs/inactifs
- Vidéo : bouton play orange — à brancher sur YouTube/Vimeo embed

## Fichiers
- `index.html` — entry point, charge React/Babel + JSX modules + monte `<SiteB>`
- `shared.jsx` — palettes, tokens, composant `Picto`, `Placeholder`
- `site-b.jsx` — composant principal desktop `SiteB`
- `site-mobile.jsx` — composant mobile `SiteMobile`
- `product-grid.jsx` — 3 dispositions de grille produits (liste / cartes / mosaïque)
- `ios-frame.jsx` — frame iOS pour visualiser le mobile (purement décoratif, à retirer en prod)

## Recommandations d'implémentation
1. **Stack suggérée** : Next.js (App Router) + Tailwind CSS, ou Astro pour un site essentiellement statique
2. **CMS** : Sanity, Contentful ou Decap pour que le maraîcher puisse mettre à jour produits/promos/galerie
3. **Images** : utiliser `next/image` avec composants placeholder pendant le développement
4. **Polices** : importer Fraunces et Inter via `next/font/google` (auto-hosting + préchargement)
5. **Couleurs** : exporter la palette Forêt en variables Tailwind dans `tailwind.config.js`
6. **Accessibilité à vérifier** :
   - Contraste `charbonMute` sur `creme` — borderline, à valider sur les labels secondaires
   - Boutons doivent avoir des focus rings visibles (manquants dans le proto)
   - Nav SPA → utiliser `<a href>` réels avec routing pour SEO

## Prochaines étapes
- [ ] Photographies réelles (16+ : portrait maraîcher, hero, galerie 6, produits 5+, paniers 3, livraison)
- [ ] Vidéo immersion (4–5 min)
- [ ] Vraie carte interactive des zones de livraison (Mapbox / Leaflet)
- [ ] Système de commande (formulaire mail ou panier léger)
- [ ] Mentions légales, politique de confidentialité, RGPD
- [ ] Version mobile responsive (le proto cible 1360px desktop — la version mobile existe en prototype séparé)
