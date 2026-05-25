'use client';
import React from 'react';
import Image from 'next/image';
import { Picto, Placeholder } from './shared';

const ProduitImage = ({ p, ratio, tone, style }) => {
  if (!p.image) {
    return <Placeholder label={p.nom} ratio={ratio} tone={tone} style={style} />;
  }
  if (ratio === 'auto') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
        <Image src={p.image} alt={p.nom} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: ratio }}>
      <Image src={p.image} alt={p.nom} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
    </div>
  );
};

function ProductGrid({ produits, t, variant, promos = [], onVoirPromo, onAddToCart }) {
  if (variant === 'cartes') return <ProductGridCards produits={produits} t={t} promos={promos} onVoirPromo={onVoirPromo} onAddToCart={onAddToCart} />;
  if (variant === 'mosaique') return <ProductGridMosaic produits={produits} t={t} promos={promos} onVoirPromo={onVoirPromo} onAddToCart={onAddToCart} />;
  return <ProductGridList produits={produits} t={t} promos={promos} onVoirPromo={onVoirPromo} onAddToCart={onAddToCart} />;
}

function ProductGridList({ produits, t, promos, onVoirPromo, onAddToCart }) {
  return (
    <div>
      {produits.map((p, i) => {
        const promo = promos.find(pr => pr.titre === p.nom);
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 48,
            alignItems: 'center', padding: '32px 0', borderTop: `1px solid ${t.bord}`,
            borderBottom: i === produits.length - 1 ? `1px solid ${t.bord}` : 'none',
          }}>
            <div style={{ position: 'relative' }}>
              <ProduitImage p={p} ratio="1/1" tone={p.saison === 'Été' ? 'sable' : 'creme'} />
              <div style={{
                position: 'absolute', top: 10, left: 10,
                fontFamily: t.serif, fontSize: 14, fontStyle: 'italic',
                color: t.charbonMute, fontWeight: 400,
              }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              {promo && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: t.orange, color: t.creme,
                  fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                  padding: '4px 8px', borderRadius: 999,
                }}>PROMO</div>
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Picto name={p.saison === 'Été' ? 'sun' : 'snow'} size={13} color={p.saison === 'Été' ? t.orange : t.vertSoft} />
                <span style={{ fontSize: 11, color: t.charbonMute, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>{p.saison}</span>
              </div>
              <h3 style={{ fontFamily: t.serif, fontSize: 44, fontWeight: 400, margin: 0, letterSpacing: -0.8, lineHeight: 1 }}>
                {p.nom}
              </h3>
              {promo && promo.desc && (
                <p style={{ fontSize: 13, color: t.orange, margin: '10px 0 0', fontStyle: 'italic' }}>{promo.desc}</p>
              )}
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
              <div>
                {promo ? (
                  <>
                    <div style={{ fontFamily: t.serif, fontSize: 52, fontWeight: 500, color: t.orange, letterSpacing: -1, lineHeight: 1 }}>{promo.prix}</div>
                    <div style={{ fontSize: 14, color: t.charbonMute, textDecoration: 'line-through', marginTop: 2 }}>{p.prix} {p.unit}</div>
                  </>
                ) : (
                  <span style={{ fontFamily: t.serif, fontSize: 52, fontWeight: 500, color: t.vert, letterSpacing: -1, lineHeight: 1 }}>{p.prix}</span>
                )}
                <div style={{ fontSize: 13, color: t.charbonMute, marginTop: 4 }}>{p.unit}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {promo && (
                  <button onClick={onVoirPromo} style={{
                    background: t.orange, color: t.creme, border: 'none', cursor: 'pointer',
                    padding: '10px 18px', borderRadius: 999, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    Voir la promo <Picto name="arrowRight" size={13} stroke={1.8} />
                  </button>
                )}
                {onAddToCart && (
                  <button onClick={() => onAddToCart(p)} style={{
                    background: t.creme, color: t.charbon, border: `1px solid ${t.bord}`, cursor: 'pointer',
                    padding: '10px 18px', borderRadius: 999, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
                    fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <Picto name="basket" size={13} stroke={1.8} /> Ajouter à ma demande
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductGridCards({ produits, t, promos, onVoirPromo, onAddToCart }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      {produits.map((p, i) => {
        const promo = promos.find(pr => pr.titre === p.nom);
        return (
          <article key={i} style={{
            background: t.creme, border: `1px solid ${promo ? t.orange : t.bord}`, overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            transition: 'transform .2s, box-shadow .2s',
          }}>
            <div style={{ position: 'relative' }}>
              <ProduitImage p={p} ratio="4/3" tone={p.saison === 'Été' ? 'sable' : 'creme'} />
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: t.creme, padding: '4px 9px',
                fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999,
              }}>
                <Picto name={p.saison === 'Été' ? 'sun' : 'snow'} size={10} color={p.saison === 'Été' ? t.orange : t.vertSoft} />
                <span style={{ color: t.charbon }}>{p.saison}</span>
              </div>
              {promo && (
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                  background: t.orange, color: t.creme,
                  padding: '4px 9px', borderRadius: 999,
                  fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                }}>PROMO</div>
              )}
              {onAddToCart && (
                <button onClick={() => onAddToCart(p)} title="Ajouter à ma demande" style={{
                  position: 'absolute', bottom: 10, right: 10,
                  background: t.charbon, color: t.creme, border: 'none', cursor: 'pointer',
                  width: 34, height: 34, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Picto name="basket" size={14} stroke={1.8} color={t.creme} />
                </button>
              )}
            </div>
            <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontFamily: t.serif, fontSize: 20, fontWeight: 500, margin: '0 0 6px', letterSpacing: -0.3, lineHeight: 1.05, flex: 1 }}>
                {p.nom}
              </h3>
              {promo && promo.desc && (
                <p style={{ fontSize: 12, color: t.orange, margin: '0 0 10px', fontStyle: 'italic', lineHeight: 1.4 }}>{promo.desc}</p>
              )}
              <div style={{
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                borderTop: `1px solid ${t.bord}`, paddingTop: 12,
              }}>
                <div>
                  {promo ? (
                    <>
                      <div style={{ fontFamily: t.serif, fontSize: 26, fontWeight: 500, color: t.orange, lineHeight: 1, letterSpacing: -0.5 }}>
                        {promo.prix}
                        <span style={{ fontSize: 12, color: t.charbonMute, fontStyle: 'italic', marginLeft: 3 }}>{p.unit}</span>
                      </div>
                      <div style={{ fontSize: 11, color: t.charbonMute, textDecoration: 'line-through', marginTop: 2 }}>
                        {p.prix} {p.unit}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontFamily: t.serif, fontSize: 26, fontWeight: 500, color: t.vert, lineHeight: 1, letterSpacing: -0.5 }}>
                      {p.prix}
                      <span style={{ fontSize: 12, color: t.charbonMute, fontStyle: 'italic', marginLeft: 3 }}>{p.unit}</span>
                    </div>
                  )}
                </div>
                {promo && (
                  <button onClick={onVoirPromo} style={{
                    background: t.orange, color: t.creme, border: 'none', cursor: 'pointer',
                    width: 34, height: 34, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Picto name="arrowRight" size={13} stroke={2} />
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ProductGridMosaic({ produits, t, promos, onVoirPromo, onAddToCart }) {
  const layouts = [
    { col: 'span 8', row: 'span 2', size: 'big' },
    { col: 'span 4', row: 'span 1', size: 'small' },
    { col: 'span 4', row: 'span 1', size: 'small' },
    { col: 'span 5', row: 'span 1', size: 'med' },
    { col: 'span 7', row: 'span 1', size: 'med' },
    { col: 'span 12', row: 'span 1', size: 'wide' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridAutoRows: '280px', gap: 16 }}>
      {produits.map((p, i) => {
        const l = layouts[i % layouts.length];
        const isBig = l.size === 'big';
        const isWide = l.size === 'wide';
        const promo = promos.find(pr => pr.titre === p.nom);
        return (
          <article key={i} style={{
            gridColumn: l.col, gridRow: l.row,
            position: 'relative', overflow: 'hidden',
            background: t.cremeDark,
            border: promo ? `2px solid ${t.orange}` : 'none',
            display: 'flex', flexDirection: isWide ? 'row' : 'column',
          }}>
            <div style={{
              position: 'relative',
              flex: isWide ? '0 0 45%' : 'none',
              height: isWide ? '100%' : (isBig ? '60%' : '55%'),
            }}>
              <ProduitImage p={p} ratio="auto" tone={p.saison === 'Été' ? 'sable' : 'vert'} style={{ height: '100%', width: '100%' }} />
              <div style={{
                position: 'absolute', top: 14, left: 14,
                background: t.creme, padding: '4px 10px',
                fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Picto name={p.saison === 'Été' ? 'sun' : 'snow'} size={11} color={p.saison === 'Été' ? t.orange : t.vertSoft} />
                <span style={{ color: t.charbon }}>{p.saison}</span>
              </div>
              {promo && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  background: t.orange, color: t.creme,
                  fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                  padding: '4px 8px', borderRadius: 999,
                }}>PROMO</div>
              )}
            </div>
            <div style={{
              padding: isBig ? '24px 28px' : '18px 20px',
              background: t.creme, flex: 1,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <h3 style={{
                fontFamily: t.serif,
                fontSize: isBig ? 38 : (isWide ? 30 : 22),
                fontWeight: 500, margin: 0,
                letterSpacing: -0.5, lineHeight: 1.05,
              }}>
                {p.nom}
              </h3>
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                marginTop: 12, paddingTop: 10, borderTop: `1px solid ${t.bord}`,
              }}>
                {promo ? (
                  <div>
                    <div style={{ fontFamily: t.serif, fontSize: isBig ? 32 : 22, fontWeight: 500, color: t.orange, letterSpacing: -0.5 }}>
                      {promo.prix}
                      <span style={{ fontSize: 12, color: t.charbonMute, fontStyle: 'italic', marginLeft: 4, fontWeight: 400 }}>{p.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, color: t.charbonMute, textDecoration: 'line-through' }}>{p.prix}</div>
                  </div>
                ) : (
                  <div style={{ fontFamily: t.serif, fontSize: isBig ? 32 : 22, fontWeight: 500, color: t.vert, letterSpacing: -0.5 }}>
                    {p.prix}
                    <span style={{ fontSize: 12, color: t.charbonMute, fontStyle: 'italic', marginLeft: 4, fontWeight: 400 }}>{p.unit}</span>
                  </div>
                )}
                {promo && (
                  <button onClick={onVoirPromo} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <Picto name="arrowRight" size={16} color={t.orange} stroke={1.8} />
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export { ProductGrid };
