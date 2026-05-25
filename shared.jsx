// Pictos custom + tokens partagés pour les deux variantes
// O'régale des saisons

// Jeux de couleurs sélectionnables via Tweaks
// Toutes les palettes conservent la même structure de tokens
const ORSPalettes = {
  // 1 — Originale (conservée du site)
  origine: {
    nom: 'Origine',
    vert: '#3d5a3a', vertDark: '#2a3f28', vertSoft: '#6b7f5a',
    orange: '#d4733a', orangeDark: '#b85a24',
    creme: '#faf7f0', cremeDark: '#f2ecdb', sable: '#ebe3d1',
    charbon: '#1f1d18', charbonSoft: '#4a4740', charbonMute: '#8a857a',
    bord: '#d9d1bc',
  },
  // 2 — Forêt : verts plus profonds, accent ocre/jaune doré
  foret: {
    nom: 'Forêt',
    vert: '#2d4a2a', vertDark: '#1a2e18', vertSoft: '#557047',
    orange: '#c89a3c', orangeDark: '#9a7424',
    creme: '#f7f3e8', cremeDark: '#ede5cf', sable: '#e3d9bd',
    charbon: '#1c1a14', charbonSoft: '#403d34', charbonMute: '#807868',
    bord: '#d2c8a8',
  },
  // 3 — Coquelicot : crème lumineux, accent rouge tomate vif
  coquelicot: {
    nom: 'Coquelicot',
    vert: '#4a6b3e', vertDark: '#324a28', vertSoft: '#7d9367',
    orange: '#c43d2e', orangeDark: '#962a1e',
    creme: '#fbf6e9', cremeDark: '#f1ead4', sable: '#e6dcbd',
    charbon: '#2a1f1a', charbonSoft: '#544840', charbonMute: '#8a8074',
    bord: '#d8cdb0',
  },
  // 4 — Lavande : terreux + violet doux pour rappel Provence
  lavande: {
    nom: 'Lavande',
    vert: '#496149', vertDark: '#324533', vertSoft: '#7d8c75',
    orange: '#8c6aa3', orangeDark: '#634578',
    creme: '#f8f4ec', cremeDark: '#ece6d6', sable: '#dfd5be',
    charbon: '#211d24', charbonSoft: '#48424c', charbonMute: '#857d8a',
    bord: '#cfc5b3',
  },
  // 5 — Nuit : mode sombre éditorial
  nuit: {
    nom: 'Nuit',
    vert: '#a8c79a', vertDark: '#0e1a0d', vertSoft: '#7d9670',
    orange: '#e8954e', orangeDark: '#c47632',
    creme: '#1a1814', cremeDark: '#252119', sable: '#2f2a20',
    charbon: '#f5efdf', charbonSoft: '#c9c0a8', charbonMute: '#807866',
    bord: '#3a3327',
  },
};

// Palette active (assignée au runtime via setORSPalette)
const ORSTokens = {
  ...ORSPalettes.origine,
  serif: '"Fraunces", Georgia, serif',
  sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
};

function setORSPalette(key) {
  const p = ORSPalettes[key] || ORSPalettes.origine;
  Object.assign(ORSTokens, p);
}

// Pictos custom SVG — line icons fines, cohérents
const Picto = ({ name, size = 24, stroke = 1.4, color = 'currentColor' }) => {
  const paths = {
    leaf: <><path d="M20 4C12 4 4 8 4 16c0 2 .5 3.5 1.5 4.5C6 21 7 21 8 21c8 0 12-7 12-17z"/><path d="M4 20c3-3 6-6 10-10"/></>,
    carrot: <><path d="M7 17L17 7"/><path d="M6 18c-2 0-3-1-3-3l6-6c5-5 12-5 12-5s0 7-5 12l-6 6c-2 0-3-1-3-3z"/><path d="M13 4l2-2M17 6l2-2M19 10l2-1"/></>,
    basket: <><path d="M3 9h18l-2 11a2 2 0 01-2 2H7a2 2 0 01-2-2L3 9z"/><path d="M8 9l2-5M16 9l-2-5"/><path d="M9 14v4M15 14v4M12 14v4"/></>,
    sprout: <><path d="M12 22V11"/><path d="M12 11c0-4 3-7 7-7-1 4-3 7-7 7z"/><path d="M12 13c0-3-2-6-6-6 0 4 3 6 6 6z"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></>,
    snow: <><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/><path d="M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2M6 12l-2-2M6 12l-2 2M18 12l2-2M18 12l2 2"/></>,
    pin: <><path d="M12 22s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z"/><circle cx="12" cy="9" r="3"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.8a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.28a2 2 0 012.11-.45c.9.35 1.84.59 2.8.72A2 2 0 0122 16.92z"/></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="1"/><path d="M2 6l10 8 10-8"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></>,
    arrowRight: <><path d="M4 12h16M14 6l6 6-6 6"/></>,
    arrowLeft: <><path d="M20 12H4M10 18l-6-6 6-6"/></>,
    play: <><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill={color}/></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    close: <><path d="M6 6l12 12M18 6L6 18"/></>,
    scales: <><path d="M12 3v18M5 7h14"/><path d="M5 7l-3 6a3 3 0 006 0L5 7zM19 7l-3 6a3 3 0 006 0L19 7z"/></>,
    handshake: <><path d="M11 17l2 2a1 1 0 003 0l5-5a2 2 0 000-3l-5-5a2 2 0 00-3 0L9 9"/><path d="M5 13l4-4M14 6l-3 3M3 11l5 5 2-2"/></>,
    recycle: <><path d="M7 19H4a2 2 0 01-1.7-3l2.5-4.3"/><path d="M17 19l2-3 3 2"/><path d="M14 5l2 3.5-3 2"/><path d="M12 2l3 5-5 1M6 10l2 4 5-1M16 17l3-5 4 3"/></>,
    heart: <><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 000-7.8z"/></>,
    harvest: <><path d="M3 12s3-4 9-4 9 4 9 4"/><path d="M3 12s3 4 9 4 9-4 9-4"/><path d="M12 8v8M8 10v4M16 10v4"/></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none"/></>,
    facebook: <><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

// Placeholder image soigné — rectangle texturé avec annotation
const Placeholder = ({ label, ratio = '4/3', tone = 'creme', style = {} }) => {
  const bgs = {
    creme: ORSTokens.sable,
    vert: ORSTokens.vertSoft,
    sable: ORSTokens.cremeDark,
    dark: ORSTokens.vertDark,
  };
  const textColors = {
    creme: ORSTokens.charbonSoft,
    vert: ORSTokens.creme,
    sable: ORSTokens.charbonSoft,
    dark: ORSTokens.creme,
  };
  const bg = bgs[tone];
  const tc = textColors[tone];
  return (
    <div style={{
      aspectRatio: ratio,
      background: `
        repeating-linear-gradient(135deg, transparent 0 14px, rgba(0,0,0,0.025) 14px 15px),
        ${bg}
      `,
      position: 'relative',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        position: 'absolute', top: 12, left: 14,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase',
        color: tc, opacity: 0.7,
      }}>img</div>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: ORSTokens.sans, fontSize: 13, color: tc, opacity: 0.75, textAlign: 'center', padding: 20,
      }}>{label}</div>
    </div>
  );
};

// Apparition au scroll — wraps any block with a fade + rise animation
const FadeIn = ({ children, delay = 0, distance = 30, style = {}, ...props }) => {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : `translateY(${distance}px)`,
      transition: `opacity .7s ease ${delay}ms, transform .7s ease ${delay}ms`,
      ...style,
    }} {...props}>{children}</div>
  );
};

// Carte Google Maps sans clé API — intégration iframe standard (gratuit, sans compte)
const MapContact = ({ style = {} }) => (
  <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', ...style }}>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2754.7497335324974!2d1.1311124766669816!3d46.334662674940525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47fc05146566561f%3A0xd2d332295a076424!2s1%20Les%20Soulzors%2C%2087360%20Verneuil-Moustiers!5e0!3m2!1sfr!2sfr!4v1777191057559!5m2!1sfr!2sfr"
      width="100%" height="100%"
      style={{ border: 0, display: 'block', position: 'absolute', inset: 0 }}
      allowFullScreen loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Localisation de la ferme"
    />
  </div>
);

Object.assign(window, { ORSTokens, ORSPalettes, setORSPalette, Picto, Placeholder, FadeIn, MapContact });
