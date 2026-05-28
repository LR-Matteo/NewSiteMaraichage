'use client';
import React from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { Picto, Placeholder, FadeIn, MapContact, ORSTokens } from './shared';
import { PRODUITS_B, PROMOS_B } from './site-b';
import { CartDrawer } from './cart-drawer';

function ContactFormBlockMobile({ t }) {
  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [status, setStatus] = React.useState('idle');

  function F(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setStatus('sending');
    try {
      await emailjs.send('service_lfgrmkv', 'template_1er3wnb', {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('[emailjs]', err);
      setStatus('error');
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontSize: 15,
    border: `1px solid ${t.bord}`, outline: 'none',
    fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box',
  };

  if (status === 'success') return (
    <div style={{ padding: '32px 18px', background: t.cremeDark, textAlign: 'center' }}>
      <div style={{ fontFamily: t.serif, fontSize: 26, fontWeight: 400, color: t.vert, marginBottom: 8 }}>Message envoyé ✓</div>
      <div style={{ fontSize: 13, color: t.charbonMute, marginBottom: 20 }}>Nous vous répondrons dans les meilleurs délais.</div>
      <button onClick={() => setStatus('idle')} style={{
        background: 'none', border: `1px solid ${t.bord}`, padding: '9px 22px',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: t.charbon,
      }}>Envoyer un autre message</button>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Nom *</label>
        <input style={inputStyle} value={form.name} onChange={e => F('name', e.target.value)} placeholder="Votre nom" required />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Email *</label>
        <input style={inputStyle} type="email" value={form.email} onChange={e => F('email', e.target.value)} placeholder="votre@email.fr" required />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Message *</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }} value={form.message} onChange={e => F('message', e.target.value)} placeholder="Votre demande, produits souhaités…" required />
      </div>
      <div>
        <button type="submit" disabled={status === 'sending'} style={{
          width: '100%', background: t.vert, color: t.creme, border: 'none',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          padding: '14px', fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          opacity: status === 'sending' ? 0.7 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          {status === 'sending' ? 'Envoi en cours…' : <><span>Envoyer le message</span><Picto name="arrowRight" size={14} stroke={2} /></>}
        </button>
        {status === 'error' && (
          <p style={{ fontSize: 13, color: '#dc2626', marginTop: 10, textAlign: 'center' }}>
            Une erreur est survenue. Réessayez ou appelez-nous.
          </p>
        )}
      </div>
    </form>
  );
}

const NAV_MOBILE = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'produits', label: 'Produits' },
  { id: 'promotions', label: 'Promos' },
  { id: 'contact', label: 'Contact' },
];

function SiteMobile({ produits: produitsProp, promotions: promotionsProp, homeContent, onLogoClick }) {
  const [section, setSection] = React.useState('accueil');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [saisonFilter, setSaisonFilter] = React.useState('toutes');
  const [gallerieIdx, setGallerieIdx] = React.useState(0);
  const [cartItems, setCartItems] = React.useState([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const t = ORSTokens;

  function addToCart(p) {
    setCartItems(prev => {
      const exists = prev.find(i => i.nom === p.nom);
      if (exists) return prev.map(i => i.nom === p.nom ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { nom: p.nom, prix: p.prix, unit: p.unit, qty: 1 }];
    });
  }
  function updateQty(nom, qty) {
    if (qty <= 0) setCartItems(prev => prev.filter(i => i.nom !== nom));
    else setCartItems(prev => prev.map(i => i.nom === nom ? { ...i, qty } : i));
  }
  function removeFromCart(nom) { setCartItems(prev => prev.filter(i => i.nom !== nom)); }
  function clearCart() { setCartItems([]); }
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [section]);

  const allProduits = produitsProp && produitsProp.length > 0 ? produitsProp : PRODUITS_B;
  const allPromos = promotionsProp && promotionsProp.length > 0 ? promotionsProp : PROMOS_B;
  const produitsFiltres = saisonFilter === 'toutes' ? allProduits : allProduits.filter(p => p.saison === saisonFilter);
  const g = (key) => (homeContent && homeContent[key]) || null;
  const GALLERY = [
    { key: 'gallery_1', label: "Serres à l'aube", tone: 'vert' },
    { key: 'gallery_2', label: 'Cagette tomates', tone: 'sable' },
    { key: 'gallery_3', label: 'Détail basilic', tone: 'creme' },
    { key: 'gallery_4', label: 'Mains, terre', tone: 'dark' },
    { key: 'gallery_5', label: "Étal du marché", tone: 'creme' },
    { key: 'gallery_6', label: 'Rangée de courgettes', tone: 'vert' },
  ];

  return (
    <div style={{
      fontFamily: t.sans, color: t.charbon, background: t.creme,
      width: '100%', minHeight: '100vh',
    }}>
      {/* Header mobile */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: t.creme, borderBottom: `1px solid ${t.bord}`,
        padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'default' }} onClick={onLogoClick}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: t.vert, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Picto name="leaf" size={14} color={t.creme} stroke={1.8} />
          </div>
          <div style={{ fontFamily: t.serif, fontSize: 17, fontWeight: 500, letterSpacing: -0.3 }}>
            O'régale <em style={{ fontStyle: 'italic', fontWeight: 400, color: t.vert }}>des saisons</em>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setCartOpen(true)} style={{
            position: 'relative', background: cartItems.length > 0 ? t.vert : 'transparent',
            border: cartItems.length > 0 ? 'none' : 'none', cursor: 'pointer', padding: 6, borderRadius: '50%',
          }}>
            <Picto name="basket" size={22} stroke={1.6} color={cartItems.length > 0 ? t.creme : t.charbon} />
            {cartItems.length > 0 && (
              <span style={{
                position: 'absolute', top: 0, right: 0,
                background: t.orange, color: t.creme, borderRadius: '50%',
                width: 16, height: 16, fontSize: 9, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartItems.length}</span>
            )}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
          }}>
            <Picto name={menuOpen ? 'close' : 'menu'} size={24} stroke={1.5} color={t.charbon} />
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 58, left: 0, right: 0, zIndex: 25,
          background: t.creme, borderBottom: `1px solid ${t.bord}`,
          padding: '8px 18px 16px',
        }}>
          {NAV_MOBILE.map(n => (
            <button key={n.id} onClick={() => { setSection(n.id); setMenuOpen(false); }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                width: '100%', textAlign: 'left',
                fontFamily: t.serif, fontSize: 22, fontWeight: 400,
                color: section === n.id ? t.vert : t.charbon,
                padding: '12px 0', borderBottom: `1px solid ${t.bord}`,
                fontStyle: section === n.id ? 'italic' : 'normal',
              }}>
              {n.label}
            </button>
          ))}
          <a href="tel:0760515836" style={{
            display: 'flex', alignItems: 'center', gap: 10, marginTop: 16,
            background: t.orange, color: t.creme, textDecoration: 'none',
            padding: '14px 18px', borderRadius: 999, fontSize: 14, fontWeight: 600,
          }}>
            <Picto name="phone" size={16} stroke={2} /> 07 60 51 58 36
          </a>
        </div>
      )}

      {/* ═══════ ACCUEIL ═══════ */}
      {section === 'accueil' && <>

      <section style={{ position: 'relative', height: 580, overflow: 'hidden', background: t.charbon }}>
        {homeContent && homeContent.hero_url
          ? <Image src={homeContent.hero_url} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: 0.35 }} />
          : <Placeholder label="Maraîcher au champ" ratio="auto" tone="dark" style={{ position: 'absolute', inset: 0, height: '100%' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(31,29,24,0.15) 0%, rgba(31,29,24,0.7) 100%)' }}/>
        <div style={{ position: 'absolute', top: 24, left: 18, right: 18, color: t.creme, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 500, display: 'flex', justifyContent: 'space-between' }}>
          <span>Édition printemps · 2026</span>
          <span>Haute-Vienne</span>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: 18, right: 18, color: t.creme }}>
          <h1 style={{ fontFamily: t.serif, fontSize: 64, lineHeight: 0.92, letterSpacing: -1.5, fontWeight: 400, margin: 0 }}>
            Cultivé,<br/>
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>cueilli,</em><br/>livré.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, margin: '20px 0 24px', opacity: 0.92 }}>
            Fruits et légumes de saison, sans pesticides. Récoltés le matin, livrés le jour même.
          </p>
          <button onClick={() => setSection('produits')} style={{
            background: t.creme, color: t.charbon, border: 'none', cursor: 'pointer',
            padding: '14px 22px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
            fontFamily: t.sans, fontWeight: 600, borderRadius: 999, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            Voir les produits <Picto name="arrowRight" size={14} stroke={1.8} />
          </button>
        </div>
      </section>

      <FadeIn>
        <div style={{ background: t.charbon, color: t.creme, padding: '14px 18px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 24, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {['Sans pesticides', 'Circuit court', 'Récolte du jour', 'Zéro gaspillage'].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ color: t.orange }}>·</span> {v}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <section style={{ padding: '56px 18px' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 16 }}>
            ·── Notre histoire
          </div>
          <h2 style={{ fontFamily: t.serif, fontSize: 44, lineHeight: 0.95, letterSpacing: -1.2, fontWeight: 400, margin: 0 }}>
            Une <em style={{ fontStyle: 'italic', color: t.vert }}>terre</em>,<br/>
            une <em style={{ fontStyle: 'italic', color: t.vert }}>famille</em>,<br/>
            un <em style={{ fontStyle: 'italic', color: t.vert }}>métier</em>.
          </h2>
          <div style={{ position: 'relative', marginTop: 28 }}>
            <Placeholder label="Maraîcher au travail" ratio="4/5" tone="vert" />
            <div style={{
              position: 'absolute', top: -16, right: -8, background: t.orange, color: t.creme,
              width: 86, height: 86, borderRadius: '50%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-6deg)',
            }}>
              <div style={{ fontFamily: t.serif, fontSize: 10, fontStyle: 'italic' }}>récolté</div>
              <div style={{ fontFamily: t.serif, fontSize: 18, fontWeight: 500, lineHeight: 1 }}>ce matin</div>
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: t.charbonSoft, margin: '28px 0 0' }}>
            Maraîchers passionnés, nous cultivons des légumes et des fruits dans le respect de la biodiversité, en harmonie avec la nature et les saisons. Ici, aucun engrais chimique ni produit de synthèse : nos cultures sont 100 % naturelles, pour vous offrir des produits sains et authentiques
          </p>
        </section>
      </FadeIn>

      <FadeIn>
        <section style={{ background: t.vertDark, color: t.creme, padding: '48px 18px' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 14 }}>
            ·── Nos engagements
          </div>
          <h2 style={{ fontFamily: t.serif, fontSize: 36, lineHeight: 1, letterSpacing: -1, fontWeight: 400, margin: '0 0 32px' }}>
            Quatre <em style={{ fontStyle: 'italic', color: t.orange }}>principes</em>.
          </h2>
          {[
            { num: '01', icon: 'sprout', titre: 'Culture raisonnée', txt: 'Aucun pesticide. Rotation, engrais verts, paillage.' },
            { num: '02', icon: 'pin', titre: 'Circuit court', txt: 'De la parcelle au panier en moins de 24h.' },
            { num: '03', icon: 'handshake', titre: 'Vente directe', txt: "Pas d'intermédiaire. Juste prix." },
            { num: '04', icon: 'recycle', titre: 'Zéro gaspillage', txt: 'Tri, compost, conserves.' },
          ].map(v => (
            <div key={v.num} style={{ padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: t.serif, fontSize: 13, fontStyle: 'italic', opacity: 0.6 }}>{v.num}</span>
                <Picto name={v.icon} size={18} color={t.orange} stroke={1.4} />
              </div>
              <h3 style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500, margin: '0 0 6px', letterSpacing: -0.3 }}>{v.titre}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.75, margin: 0 }}>{v.txt}</p>
            </div>
          ))}
        </section>
      </FadeIn>

      {/* GALERIE CARROUSEL */}
      <FadeIn>
        <section style={{ padding: '48px 18px' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.vert, fontWeight: 600, marginBottom: 14 }}>
            ·── Carnet visuel
          </div>
          <h2 style={{ fontFamily: t.serif, fontSize: 36, lineHeight: 1, letterSpacing: -1, fontWeight: 400, margin: '0 0 20px' }}>
            La ferme, <em style={{ fontStyle: 'italic', color: t.vert }}>vue de l'intérieur</em>.
          </h2>
          <div style={{ position: 'relative' }}>
            <div style={{ border: `2px solid ${t.orange}`, overflow: 'hidden' }}>
              {g(GALLERY[gallerieIdx].key)
                ? <Image src={g(GALLERY[gallerieIdx].key)} alt="" width={400} height={300} sizes="100vw" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
                : <Placeholder label={GALLERY[gallerieIdx].label} ratio="4/3" tone={GALLERY[gallerieIdx].tone} />
              }
            </div>
            <button onClick={() => setGallerieIdx((gallerieIdx - 1 + GALLERY.length) % GALLERY.length)} style={{
              position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)',
              background: t.creme, border: `2px solid ${t.orange}`, cursor: 'pointer',
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Picto name="arrowLeft" size={16} stroke={2} color={t.charbon} />
            </button>
            <button onClick={() => setGallerieIdx((gallerieIdx + 1) % GALLERY.length)} style={{
              position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)',
              background: t.creme, border: `2px solid ${t.orange}`, cursor: 'pointer',
              width: 40, height: 40, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Picto name="arrowRight" size={16} stroke={2} color={t.charbon} />
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 14 }}>
            {GALLERY.map((_, i) => (
              <div key={i} onClick={() => setGallerieIdx(i)} style={{
                width: i === gallerieIdx ? 20 : 6, height: 6, borderRadius: 3,
                background: i === gallerieIdx ? t.orange : t.bord,
                cursor: 'pointer', transition: 'all .2s',
              }} />
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Aperçu promotions */}
      <FadeIn>
        <section style={{ background: t.cremeDark, padding: '48px 18px' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 14 }}>
            ·── Offres de la semaine
          </div>
          <h2 style={{ fontFamily: t.serif, fontSize: 36, lineHeight: 1, letterSpacing: -1, fontWeight: 400, margin: '0 0 24px' }}>
            Les <em style={{ fontStyle: 'italic', color: t.orange }}>promotions</em><br/>du moment.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {Array.from({ length: 4 }).map((_, i) => {
              const promo = allPromos[i];
              if (!promo) return (
                <div key={i} style={{
                  background: t.cremeDark, border: `1px dashed ${t.bord}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180,
                }}>
                  <div style={{ fontFamily: t.serif, fontSize: 12, color: t.charbonMute, fontStyle: 'italic', textAlign: 'center', padding: 16 }}>
                    Prochaine<br/>promotion<br/>à venir…
                  </div>
                </div>
              );
              return (
                <article key={i} onClick={() => setSection('promotions')} style={{
                  background: t.creme, border: `2px solid ${t.orange}`, overflow: 'hidden', cursor: 'pointer',
                }}>
                  <div style={{ position: 'relative', aspectRatio: '1/1' }}>
                    {promo.image
                      ? <Image src={promo.image} alt={promo.titre} fill sizes="50vw" style={{ objectFit: 'cover' }} />
                      : <Placeholder label={promo.titre} ratio="auto" tone="sable" style={{ position: 'absolute', inset: 0, height: '100%' }} />
                    }
                    {promo.remise && (
                      <div style={{
                        position: 'absolute', top: 8, right: 8,
                        background: t.orange, color: t.creme,
                        fontSize: 8, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                        padding: '3px 7px', borderRadius: 999,
                      }}>{promo.remise}</div>
                    )}
                    <button onClick={e => { e.stopPropagation(); addToCart({ nom: promo.titre, prix: promo.prix, unit: promo.unit }); }} title="Ajouter à ma demande" style={{
                      position: 'absolute', bottom: 8, left: 8,
                      background: t.charbon, color: t.creme, border: 'none', cursor: 'pointer',
                      width: 30, height: 30, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Picto name="basket" size={12} stroke={1.8} color={t.creme} />
                    </button>
                  </div>
                  <div style={{ padding: 12 }}>
                    <h3 style={{ fontFamily: t.serif, fontSize: 15, fontWeight: 500, margin: '0 0 6px', letterSpacing: -0.2, lineHeight: 1.1 }}>{promo.titre}</h3>
                    <div style={{ fontFamily: t.serif, fontSize: 18, fontWeight: 500, color: t.orange, letterSpacing: -0.3, lineHeight: 1 }}>
                      {promo.prix}<span style={{ fontSize: 10, color: t.charbonMute, marginLeft: 2 }}>{promo.unit}</span>
                    </div>
                    {promo.avant && (
                      <div style={{ fontSize: 10, color: t.charbonMute, textDecoration: 'line-through', marginTop: 2 }}>{promo.avant} {promo.unit}</div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <button onClick={() => setSection('promotions')} style={{
            marginTop: 16, background: t.orange, color: t.creme, border: 'none', cursor: 'pointer',
            padding: '14px 22px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
            fontWeight: 600, borderRadius: 999, width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            Voir toutes les promos <Picto name="arrowRight" size={14} stroke={1.8} />
          </button>
        </section>
      </FadeIn>
      </>}

      {/* ═══════ PRODUITS ═══════ */}
      {section === 'produits' && (
      <section style={{ padding: '32px 18px 56px' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.vert, fontWeight: 600, marginBottom: 14 }}>
          ·── Catalogue
        </div>
        <h1 style={{ fontFamily: t.serif, fontSize: 64, lineHeight: 0.9, letterSpacing: -1.8, fontWeight: 400, margin: 0 }}>
          Les <em style={{ fontStyle: 'italic', color: t.vert }}>récoltes</em>.
        </h1>
        <p style={{ fontSize: 14, color: t.charbonSoft, margin: '16px 0 0', lineHeight: 1.6 }}>
          Commande par téléphone ou mail — nous récoltons sur demande pour garantir la fraîcheur.
        </p>
        <div style={{ display: 'flex', gap: 6, margin: '16px 0 24px', overflowX: 'auto' }}>
          {[
            { id: 'toutes', label: 'Toutes', icon: 'leaf' },
            { id: 'Été', label: 'Été', icon: 'sun' },
            { id: 'Hiver', label: 'Hiver', icon: 'snow' },
          ].map(f => (
            <button key={f.id} onClick={() => setSaisonFilter(f.id)} style={{
              background: saisonFilter === f.id ? t.vert : t.creme,
              color: saisonFilter === f.id ? t.creme : t.charbonSoft,
              border: `1px solid ${saisonFilter === f.id ? t.vert : t.bord}`,
              padding: '10px 14px', cursor: 'pointer', borderRadius: 999,
              fontSize: 12, fontWeight: 500, flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Picto name={f.icon} size={13} stroke={1.5} />
              {f.label}
            </button>
          ))}
        </div>
        {produitsFiltres.map((p, i) => {
          const promo = allPromos.find(pr => pr.titre === p.nom);
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '90px 1fr', gap: 16,
              padding: '20px 0', borderTop: `1px solid ${t.bord}`,
            }}>
              <div style={{ position: 'relative' }}>
                {p.image
                  ? <Image src={p.image} alt={p.nom} width={90} height={90} sizes="90px" style={{ display: 'block', objectFit: 'cover' }} />
                  : <Placeholder label={p.nom} ratio="1/1" tone={p.saison === 'Été' ? 'sable' : 'creme'} />
                }
                {promo && (
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    background: t.orange, color: t.creme,
                    fontSize: 7, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
                    padding: '3px 6px', borderRadius: 999,
                  }}>PROMO</div>
                )}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Picto name={p.saison === 'Été' ? 'sun' : 'snow'} size={11} color={p.saison === 'Été' ? t.orange : t.vertSoft} />
                  <span style={{ fontSize: 9, color: t.charbonMute, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{p.saison}</span>
                </div>
                <h3 style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500, margin: '0 0 8px', letterSpacing: -0.4, lineHeight: 1.1 }}>{p.nom}</h3>
                {promo ? (
                  <>
                    <div style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500, color: t.orange, letterSpacing: -0.3 }}>
                      {promo.prix}<span style={{ fontSize: 12, color: t.charbonMute, marginLeft: 2 }}>{p.unit}</span>
                    </div>
                    <div style={{ fontSize: 11, color: t.charbonMute, textDecoration: 'line-through' }}>{p.prix} {p.unit}</div>
                    <button onClick={() => setSection('promotions')} style={{
                      marginTop: 8, background: t.orange, color: t.creme, border: 'none', cursor: 'pointer',
                      padding: '6px 12px', borderRadius: 999, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
                      fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      Voir la promo <Picto name="arrowRight" size={10} stroke={2} />
                    </button>
                  </>
                ) : (
                  <div style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500, color: t.vert, letterSpacing: -0.3 }}>
                    {p.prix}<span style={{ fontSize: 12, color: t.charbonMute, marginLeft: 2 }}>{p.unit}</span>
                  </div>
                )}
                <button onClick={() => addToCart(p)} style={{
                  marginTop: 10, background: t.charbon, color: t.creme, border: 'none', cursor: 'pointer',
                  padding: '7px 12px', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                }}>
                  <Picto name="basket" size={11} stroke={1.8} color={t.creme} /> Ajouter
                </button>
              </div>
            </div>
          );
        })}
      </section>
      )}

      {/* ═══════ PROMOTIONS ═══════ */}
      {section === 'promotions' && (
      <section style={{ padding: '32px 18px 56px' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 14 }}>
          ·── Offres
        </div>
        <h1 style={{ fontFamily: t.serif, fontSize: 64, lineHeight: 0.9, letterSpacing: -1.8, fontWeight: 400, margin: '0 0 16px' }}>
          Les <em style={{ fontStyle: 'italic', color: t.orange }}>promos</em>.
        </h1>
        <p style={{ fontSize: 14, color: t.charbonSoft, margin: '0 0 20px', lineHeight: 1.6 }}>
          Commande par téléphone ou mail — nous récoltons sur demande pour garantir la fraîcheur.
        </p>
        {allPromos.length === 0 ? (
          <div style={{ fontFamily: t.serif, fontSize: 18, color: t.charbonMute, fontStyle: 'italic' }}>
            Aucune promotion en ce moment.
          </div>
        ) : allPromos.map((promo, i) => (
          <div key={i} style={{ background: t.creme, border: `2px solid ${t.orange}`, marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ position: 'relative', aspectRatio: '16/9' }}>
              {promo.image
                ? <Image src={promo.image} alt={promo.titre} fill sizes="100vw" style={{ objectFit: 'cover' }} />
                : <Placeholder label={promo.titre} ratio="auto" tone="sable" style={{ position: 'absolute', inset: 0, height: '100%' }} />
              }
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: t.creme, padding: '4px 8px',
                fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999,
              }}>
                <Picto name={promo.saison === 'Été' ? 'sun' : 'snow'} size={9} color={promo.saison === 'Été' ? t.orange : t.vertSoft} />
                <span style={{ color: t.charbon }}>{promo.saison}</span>
              </div>
              {promo.remise && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: t.orange, color: t.creme, padding: '4px 8px', borderRadius: 999, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{promo.remise}</div>
              )}
              <button onClick={() => addToCart({ nom: promo.titre, prix: promo.prix, unit: promo.unit })} title="Ajouter à ma demande" style={{
                position: 'absolute', bottom: 10, right: 10,
                background: t.charbon, color: t.creme, border: 'none', cursor: 'pointer',
                width: 34, height: 34, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Picto name="basket" size={14} stroke={1.8} color={t.creme} />
              </button>
            </div>
            <div style={{ padding: 18 }}>
              <h3 style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500, margin: '0 0 6px', letterSpacing: -0.3 }}>{promo.titre}</h3>
              {promo.desc && <p style={{ fontSize: 13, color: t.charbonSoft, lineHeight: 1.5, margin: '0 0 14px' }}>{promo.desc}</p>}
              <div style={{ paddingTop: 12, borderTop: `1px solid ${t.bord}` }}>
                <div style={{ fontFamily: t.serif, fontSize: 28, fontWeight: 500, color: t.orange, letterSpacing: -0.5 }}>
                  {promo.prix}<span style={{ fontSize: 12, color: t.charbonMute, marginLeft: 3 }}>{promo.unit}</span>
                </div>
                {promo.avant && <div style={{ fontSize: 12, color: t.charbonMute, textDecoration: 'line-through' }}>{promo.avant} {promo.unit}</div>}
              </div>
            </div>
          </div>
        ))}
      </section>
      )}

      {/* ═══════ CONTACT ═══════ */}
      {section === 'contact' && (
      <section style={{ padding: '32px 18px 56px' }}>
        <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.vert, fontWeight: 600, marginBottom: 14 }}>
          ·── Rendez-vous
        </div>
        <h1 style={{ fontFamily: t.serif, fontSize: 64, lineHeight: 0.9, letterSpacing: -1.8, fontWeight: 400, margin: '0 0 28px' }}>
          <em style={{ fontStyle: 'italic', color: t.vert }}>Venez</em>.
        </h1>
        {[
          { icon: 'phone', label: 'Téléphone', val: '07 60 51 58 36', detail: 'Lun–Sam · 8h–19h', bg: t.vert, color: t.creme, accent: t.orange },
          { icon: 'mail', label: 'Email', val: 'oregale.des.saisons@gmail.com', detail: 'Réponse sous 24h', bg: t.creme, color: t.charbon, accent: t.vert },
          { icon: 'pin', label: 'Adresse', val: '1 Les Soulzors', detail: '87360 Verneuil-Moustiers', bg: t.charbon, color: t.creme, accent: t.orange },
        ].map((c, i) => (
          <div key={i} style={{
            background: c.bg, color: c.color,
            border: c.bg === t.creme ? `1px solid ${t.bord}` : 'none',
            padding: '20px 18px', display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12,
          }}>
            <Picto name={c.icon} size={22} color={c.accent} stroke={1.4} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontFamily: t.serif, fontSize: 18, fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.1, wordBreak: 'break-word' }}>{c.val}</div>
              <div style={{ fontSize: 12, opacity: 0.75, marginTop: 3 }}>{c.detail}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 20 }}>
          <MapContact />
          <div style={{ marginTop: 16, background: t.sable, overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: `1px solid ${t.bord}`, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute }}>
              Points de retrait & livraisons
            </div>
            {[
              {
                jour: 'Jeudi', icone: 'truck', couleur: t.vert,
                arrets: [
                  { lieu: 'Lussac-les-Églises', horaire: '17h–17h30', detail: 'Place du kiosque à pizza' },
                  { lieu: 'Magnac-Laval',        horaire: '18h–18h30', detail: 'Place de la Mairie' },
                ],
              },
              {
                jour: 'Vendredi', icone: 'truck', couleur: t.vert,
                arrets: [
                  { lieu: 'Le Dorat',      horaire: '17h–17h30', detail: 'Place de la fontaine' },
                  { lieu: 'Châteauponsac', horaire: '18h–18h30', detail: 'Parking du collège J.Moulin' },
                ],
              },
              {
                jour: 'À la ferme', icone: 'sprout', couleur: t.orange,
                arrets: [
                  { lieu: 'Mercredi', horaire: '9h–11h', detail: '1 Les Soulzors, Verneuil-Moustiers' },
                  { lieu: 'Samedi',   horaire: '9h–11h', detail: '1 Les Soulzors, Verneuil-Moustiers' },
                ],
              },
            ].map((grp, gi, arr) => (
              <div key={gi} style={{ padding: '14px 18px', borderBottom: gi < arr.length - 1 ? `1px solid ${t.bord}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Picto name={grp.icone} size={11} color={grp.couleur} stroke={1.8} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: grp.couleur }}>{grp.jour}</span>
                </div>
                {grp.arrets.map((a, ai) => (
                  <div key={ai} style={{ marginBottom: ai < grp.arrets.length - 1 ? 10 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.charbon }}>{a.lieu}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: t.charbon, flexShrink: 0, fontFamily: t.serif }}>{a.horaire}</span>
                    </div>
                    <div style={{ fontSize: 11, color: t.charbonMute, marginTop: 2 }}>{a.detail}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '14px 18px', background: t.creme, border: `1px solid ${t.bord}` }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, fontWeight: 600, marginBottom: 10 }}>Suivez-nous</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="https://www.instagram.com/o_regale_des_saisons/" target="_blank" rel="noopener noreferrer" style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 0',
                background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                color: '#fff', borderRadius: 999, textDecoration: 'none', fontSize: 13, fontWeight: 600,
              }}>
                <Picto name="instagram" size={15} color="#fff" stroke={1.6} />
                Instagram
              </a>
              <a href="https://www.facebook.com/o.regale.des.saisons.ancien/" target="_blank" rel="noopener noreferrer" style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 0',
                background: '#1877F2', color: '#fff', borderRadius: 999,
                textDecoration: 'none', fontSize: 13, fontWeight: 600,
              }}>
                <Picto name="facebook" size={15} color="#fff" stroke={1.6} />
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, paddingTop: 28, borderTop: `1px solid ${t.bord}` }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.vert, fontWeight: 600, marginBottom: 8 }}>
            ·── Nous écrire
          </div>
          <p style={{ fontSize: 14, color: t.charbonMute, margin: '0 0 20px', lineHeight: 1.6 }}>
            Une question ou une commande à préparer ? Envoyez-nous un message.
          </p>
          <ContactFormBlockMobile t={t} />
        </div>
      </section>
      )}

      {cartOpen && (
        <CartDrawer items={cartItems} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onRemove={removeFromCart} onClear={clearCart} />
      )}

      {/* Footer */}
      <footer style={{ background: t.charbon, color: t.creme, padding: '32px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: t.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Picto name="leaf" size={13} color={t.creme} stroke={1.8} />
          </div>
          <div style={{ fontFamily: t.serif, fontSize: 18 }}>
            O'régale <em style={{ fontStyle: 'italic' }}>des saisons</em>
          </div>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5, marginBottom: 16 }}>
          Plus sain et bien meilleur
        </div>
        <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
          <a href="https://www.instagram.com/o_regale_des_saisons/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.creme, textDecoration: 'none', opacity: 0.8 }}>
            <Picto name="instagram" size={15} color={t.orange} stroke={1.6} />
            Instagram
          </a>
          <a href="https://www.facebook.com/o.regale.des.saisons.ancien/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: t.creme, textDecoration: 'none', opacity: 0.8 }}>
            <Picto name="facebook" size={15} color={t.orange} stroke={1.6} />
            Facebook
          </a>
        </div>
        <div style={{ fontSize: 10, opacity: 0.5, letterSpacing: 0.5 }}>
          © 2026 — Haute-Vienne · Nouvelle-Aquitaine
        </div>
      </footer>
    </div>
  );
}

export { SiteMobile };
