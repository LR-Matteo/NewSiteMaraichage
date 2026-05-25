// Wrapper responsive — bascule entre SiteB (desktop) et SiteMobile

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < breakpoint);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}

function SiteResponsive({ tweaks = {} }) {
  const isMobile = useIsMobile();
  const { produits, promotions, homeContent, loading } = useORSData();
  const t = ORSTokens;

  if (loading) return (
    <div style={{ minHeight: '100vh', background: t.creme, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: t.serif, fontSize: 28, color: t.charbonMute, fontStyle: 'italic' }}>Chargement…</div>
    </div>
  );

  const Mobile = window.SiteMobile;
  const Desktop = window.SiteB;

  return (
    <div>
      {isMobile
        ? <Mobile produits={produits} promotions={promotions} homeContent={homeContent} />
        : <Desktop tweaks={tweaks} produits={produits} promotions={promotions} homeContent={homeContent} />
      }
    </div>
  );
}

Object.assign(window, { SiteResponsive, useIsMobile });
