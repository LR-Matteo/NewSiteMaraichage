'use client';
import React from 'react';
import { ORSTokens } from './shared';
import { useORSData } from './data-layer';
import { SiteB } from './site-b';
import { SiteMobile } from './site-mobile';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    setIsMobile(window.innerWidth < breakpoint);
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

  return (
    <div>
      {isMobile
        ? <SiteMobile produits={produits} promotions={promotions} homeContent={homeContent} />
        : <SiteB tweaks={tweaks} produits={produits} promotions={promotions} homeContent={homeContent} />
      }
    </div>
  );
}

export { SiteResponsive };
