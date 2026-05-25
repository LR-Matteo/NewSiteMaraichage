import './globals.css';

export const metadata = {
  title: "O'régale des saisons — Fruits & légumes de saison, Haute-Vienne",
  description: "Maraîchers en Haute-Vienne (87), nous livrons fruits et légumes de saison sans pesticides. Livraisons le jeudi à Lussac-les-Églises et Magnac-Laval, le vendredi au Dorat et Châteauponsac. Vente à la ferme mercredi et samedi 9h–11h.",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://oregale-des-saisons.fr' },
  openGraph: {
    type: 'website',
    siteName: "O'régale des saisons",
    title: "O'régale des saisons — Fruits & légumes de saison, Haute-Vienne",
    description: "Maraîchers en Haute-Vienne. Fruits et légumes cultivés sans pesticides, récoltés le matin. Livraisons le jeudi et vendredi sur 4 communes, vente à la ferme mercredi et samedi.",
    url: 'https://oregale-des-saisons.fr',
    images: [{ url: 'https://oregale-des-saisons.fr/images/og-image.png', width: 1200, height: 630 }],
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: "O'régale des saisons — Fruits & légumes de saison, Haute-Vienne",
    description: "Maraîchers en Haute-Vienne. Fruits et légumes cultivés sans pesticides, récoltés le matin.",
    images: ['https://oregale-des-saisons.fr/images/og-image.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'FarmersMarket'],
  name: "O'régale des saisons",
  description: "Maraîchers en Haute-Vienne proposant des fruits et légumes de saison cultivés sans pesticides. Vente directe à la ferme et livraisons sur 4 communes.",
  url: 'https://oregale-des-saisons.fr',
  telephone: '+33760515836',
  image: 'https://oregale-des-saisons.fr/images/og-image.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '1 Les Soulzors',
    addressLocality: 'Verneuil-Moustiers',
    postalCode: '87360',
    addressCountry: 'FR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 46.1167, longitude: 1.35 },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '09:00', closes: '11:00', description: 'Vente à la ferme — 1 Les Soulzors, Verneuil-Moustiers' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '11:00', description: 'Vente à la ferme — 1 Les Soulzors, Verneuil-Moustiers' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '17:00', closes: '18:30', description: 'Livraison — Lussac-les-Églises & Magnac-Laval' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '17:00', closes: '18:30', description: 'Livraison — Le Dorat & Châteauponsac' },
  ],
  priceRange: '€',
  servesCuisine: 'Fruits et légumes de saison',
  areaServed: ['Verneuil-Moustiers', 'Lussac-les-Églises', 'Magnac-Laval', 'Le Dorat', 'Châteauponsac'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
