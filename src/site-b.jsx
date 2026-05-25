'use client';
import React from 'react';
import Image from 'next/image';
import emailjs from '@emailjs/browser';
import { Picto, Placeholder, FadeIn, MapContact, ORSTokens } from './shared';
import { ProductGrid } from './product-grid';

function ContactFormBlock({ t, compact = false }) {
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
    width: '100%', padding: '12px 16px', fontSize: 14,
    border: `1px solid ${t.bord}`, outline: 'none',
    fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box',
    transition: 'border-color .15s',
  };

  if (status === 'success') return (
    <div style={{ padding: '40px', background: t.cremeDark, textAlign: 'center' }}>
      <div style={{ fontFamily: t.serif, fontSize: 32, fontWeight: 400, color: t.vert, marginBottom: 10 }}>Message envoyé ✓</div>
      <div style={{ fontSize: 14, color: t.charbonMute, marginBottom: 24 }}>Nous vous répondrons dans les meilleurs délais.</div>
      <button onClick={() => setStatus('idle')} style={{
        background: 'none', border: `1px solid ${t.bord}`, padding: '9px 22px',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, color: t.charbon,
      }}>Envoyer un autre message</button>
    </div>
  );

  return (
    <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 16 }}>
      <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Nom *</label>
        <input style={inputStyle} value={form.name} onChange={e => F('name', e.target.value)} placeholder="Votre nom" required />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Email *</label>
        <input style={inputStyle} type="email" value={form.email} onChange={e => F('email', e.target.value)} placeholder="votre@email.fr" required />
      </div>
      <div style={{ gridColumn: compact ? 'auto' : '1 / -1' }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Message *</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }} value={form.message} onChange={e => F('message', e.target.value)} placeholder="Votre demande, produits souhaités…" required />
      </div>
      <div style={{ gridColumn: compact ? 'auto' : '1 / -1', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button type="submit" disabled={status === 'sending'} style={{
          background: t.vert, color: t.creme, border: 'none',
          cursor: status === 'sending' ? 'not-allowed' : 'pointer',
          padding: '13px 28px', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          opacity: status === 'sending' ? 0.7 : 1,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          {status === 'sending' ? 'Envoi en cours…' : <><span>Envoyer</span><Picto name="arrowRight" size={14} stroke={2} /></>}
        </button>
        {status === 'error' && (
          <span style={{ fontSize: 13, color: '#dc2626' }}>Une erreur est survenue. Réessayez ou appelez-nous.</span>
        )}
      </div>
    </form>
  );
}

const NAV_B = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'produits', label: 'Nos Produits' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'contact', label: 'Contact & RDV' },
];

const PRODUITS_B = [
  { nom: 'Tomate cœur de bœuf', saison: 'Été', prix: '4,50', unit: '€/kg' },
  { nom: 'Courgette ronde', saison: 'Été', prix: '3,20', unit: '€/kg' },
  { nom: 'Fraise Mara des bois', saison: 'Été', prix: '6,90', unit: '€/barq.' },
  { nom: 'Courge butternut', saison: 'Hiver', prix: '2,80', unit: '€/kg' },
  { nom: 'Mâche verte', saison: 'Hiver', prix: '4,00', unit: '€/botte' },
];

const PROMOS_B = [
  { titre: 'Panier découverte', desc: '6 produits de saison.', prix: '18', avant: '24', remise: '-25%' },
  { titre: 'Panier famille', desc: '10 kg de légumes variés.', prix: '32', avant: '40', remise: '-20%' },
  { titre: 'Panier conserves', desc: 'Tomates et courgettes en gros volume.', prix: '28', avant: '35', remise: '-20%' },
];

function SiteB({ tweaks = {}, produits: produitsProp, promotions: promotionsProp, homeContent = {}, onLogoClick }) {
  const [section, setSection] = React.useState('accueil');
  const [saisonFilter, setSaisonFilter] = React.useState('toutes');
  const t = ORSTokens;
  const gridStyle = tweaks.productGrid || 'liste';

  React.useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [section]);

  const allProduits = produitsProp && produitsProp.length > 0 ? produitsProp : PRODUITS_B;
  const allPromos = promotionsProp && promotionsProp.length > 0 ? promotionsProp : PROMOS_B;
  const g = (key) => homeContent[key] || null;

  const produits = saisonFilter === 'toutes' ? allProduits : allProduits.filter(p => p.saison === saisonFilter);

  return (
    <div style={{
      fontFamily: t.sans, color: t.charbon, background: t.creme,
      minHeight: '100%', width: '100%',
    }}>
      {/* ───── NAV flottante ───── */}
      <header style={{
        position: 'sticky', top: 20, zIndex: 20, margin: '20px 32px 0',
        background: t.creme, border: `1px solid ${t.bord}`,
        padding: '14px 20px 14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: 999,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'default' }} onClick={onLogoClick}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: t.vert, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Picto name="leaf" size={16} color={t.creme} stroke={1.8} />
          </div>
          <div style={{ fontFamily: t.serif, fontSize: 19, fontWeight: 500, letterSpacing: -0.4 }}>
            O'régale <em style={{ fontStyle: 'italic', fontWeight: 400, color: t.vert }}>des saisons</em>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: 4 }}>
          {NAV_B.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              style={{
                background: section === n.id ? t.charbon : 'transparent',
                color: section === n.id ? t.creme : t.charbonSoft,
                border: 'none', cursor: 'pointer', borderRadius: 999,
                fontFamily: t.sans, fontSize: 13, fontWeight: 500,
                padding: '8px 16px', transition: 'all .15s',
              }}>
              {n.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setSection('contact')} style={{
          background: t.orange, color: t.creme, border: 'none', cursor: 'pointer',
          padding: '9px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Picto name="phone" size={14} stroke={2} /> 07 60 51 58 36
        </button>
      </header>

      {/* ═══════════ ACCUEIL ═══════════ */}
      {section === 'accueil' && <>

      {/* HERO */}
      <section style={{ position: 'relative', margin: '24px 32px 0', height: 720, overflow: 'hidden', background: t.charbon }}>
        {homeContent.hero_url
          ? <Image src={homeContent.hero_url} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', opacity: 0.35 }} />
          : <Placeholder label="Photo maraîcher heure dorée · paysage rural Haute-Vienne" ratio="auto" tone="dark" style={{ position: 'absolute', inset: 0, height: '100%' }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(31,29,24,0.1) 0%, rgba(31,29,24,0.5) 100%)' }}/>
        <div style={{ position: 'absolute', top: 48, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', color: t.creme, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500 }}>
          <span>Édition printemps · 2026</span>
          <span>Haute-Vienne · 45°51N 1°18E</span>
        </div>
        <div style={{ position: 'absolute', bottom: 64, left: 56, right: 56, color: t.creme }}>
          <h1 style={{
            fontFamily: t.serif, fontSize: 180, lineHeight: 0.88, letterSpacing: -4,
            fontWeight: 400, margin: 0,
          }}>
            Cultivé,<br/>
            <em style={{ fontStyle: 'italic', fontWeight: 300 }}>cueilli,</em> livré.
          </h1>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 32 }}>
            <p style={{ fontSize: 18, lineHeight: 1.5, maxWidth: 460, margin: 0, opacity: 0.92 }}>
              Fruits et légumes de saison, sans pesticides. Récoltés le matin, livrés chez vous le jour même.
            </p>
            <button onClick={() => setSection('produits')} style={{
              background: t.creme, color: t.charbon, border: 'none', cursor: 'pointer',
              padding: '18px 28px', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
              fontFamily: t.sans, fontWeight: 600, borderRadius: 999,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              Voir les produits <Picto name="arrowRight" size={16} stroke={1.8} />
            </button>
          </div>
        </div>
      </section>

      {/* Ticker valeurs */}
      <FadeIn>
        <div style={{ background: t.charbon, color: t.creme, padding: '22px 0', overflow: 'hidden', margin: '0 32px' }}>
          <div style={{ display: 'flex', gap: 64, justifyContent: 'space-around', alignItems: 'center', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 500 }}>
            {[
              { icon: 'sprout', txt: 'Sans pesticides' },
              { icon: 'pin', txt: 'Circuit court' },
              { icon: 'handshake', txt: 'Vente directe' },
              { icon: 'clock', txt: 'Récolte du jour' },
              { icon: 'recycle', txt: 'Zéro gaspillage' },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Picto name={v.icon} size={18} color={t.orange} stroke={1.5} />
                {v.txt}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* NOTRE HISTOIRE */}
      <FadeIn>
        <section style={{ padding: '140px 56px 120px', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 100, right: 56,
            fontFamily: t.serif, fontSize: 380, lineHeight: 0.8,
            color: t.sable, fontWeight: 400, fontStyle: 'italic',
            pointerEvents: 'none', zIndex: 0,
          }}>
            15
          </div>
          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: 80, alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 32 }}>
                ·── Notre histoire
              </div>
              <h2 style={{ fontFamily: t.serif, fontSize: 84, lineHeight: 0.95, letterSpacing: -2, fontWeight: 400, margin: 0 }}>
                Une <em style={{ fontStyle: 'italic', color: t.vert }}>terre</em>,<br/>
                une <em style={{ fontStyle: 'italic', color: t.vert }}>famille</em>,<br/>
                un <em style={{ fontStyle: 'italic', color: t.vert }}>métier</em>.
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: t.charbonSoft, marginTop: 40, maxWidth: 440 }}>
                Maraîchers passionnés, nous cultivons des légumes et des fruits dans le respect de la biodiversité, en harmonie avec la nature et les saisons. Ici, aucun engrais chimique ni produit de synthèse : nos cultures sont 100 % naturelles, pour vous offrir des produits sains et authentiques.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: t.charbonSoft, marginTop: 40, maxWidth: 440 }}>Nous réalisons nous-même nos semis à partir de graines biologiques issues de l'association Kokopelli, reconnue pour la préservation de variétés anciennes et reproductibles. Notre engagement : produire localement, durablement, et avec amour du vivant</p>
              <div style={{ marginTop: 40 }}>
                <div style={{ fontFamily: t.serif, fontSize: 18, fontStyle: 'italic', fontWeight: 500 }}>Le maraîcher</div>
                <div style={{ fontSize: 13, color: t.charbonMute }}>Fondateur, Verneuil-Moustiers</div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ border: `2px solid ${t.orange}`, overflow: 'hidden' }}>
                {homeContent.portrait_url
                  ? <Image src={homeContent.portrait_url} alt="Le maraîcher" width={300} height={400} sizes="(max-width: 768px) 100vw, 33vw" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
                  : <Placeholder label="Main sur légumes fraîchement cueillis" ratio="3/4" tone="vert" />
                }
              </div>
              <div style={{ position: 'absolute', top: -14, right: -14, background: t.orange, color: t.creme, width: 76, height: 76, borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-6deg)' }}>
                <div style={{ fontFamily: t.serif, fontSize: 9, fontStyle: 'italic', letterSpacing: 0.5 }}>récolté</div>
                <div style={{ fontFamily: t.serif, fontSize: 16, fontWeight: 500, lineHeight: 1 }}>ce matin</div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* VALEURS */}
      <FadeIn>
        <section style={{ background: t.vertDark, color: t.creme, padding: '100px 56px' }}>
          <div style={{ maxWidth: 600, marginBottom: 64 }}>
            <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 20 }}>
              ·── Nos engagements
            </div>
            <h2 style={{ fontFamily: t.serif, fontSize: 56, lineHeight: 1, letterSpacing: -1.2, fontWeight: 400, margin: 0 }}>
              Quatre <em style={{ fontStyle: 'italic', color: t.orange }}>principes</em>,<br/>tenus saison après saison.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.15)' }}>
            {[
              { num: '01', icon: 'sprout', titre: 'Culture raisonnée', txt: 'Aucun pesticide de synthèse. Rotation, engrais verts, paillage.' },
              { num: '02', icon: 'pin', titre: 'Circuit court', txt: 'De la parcelle au panier en moins de 24h.' },
              { num: '03', icon: 'handshake', titre: 'Vente directe', txt: "Pas d'intermédiaire. Juste prix, pour vous et pour nous." },
              { num: '04', icon: 'recycle', titre: 'Zéro gaspillage', txt: 'Tri, compost, conserves. Rien ne se perd.' },
            ].map(v => (
              <div key={v.num} style={{ background: t.vertDark, padding: '32px 28px 36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                  <span style={{ fontFamily: t.serif, fontSize: 14, fontStyle: 'italic', opacity: 0.6 }}>{v.num}</span>
                  <Picto name={v.icon} size={22} color={t.orange} stroke={1.4} />
                </div>
                <h3 style={{ fontFamily: t.serif, fontSize: 24, fontWeight: 500, margin: '0 0 12px', letterSpacing: -0.3 }}>{v.titre}</h3>
                <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.75, margin: 0 }}>{v.txt}</p>
              </div>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* GALERIE */}
      <FadeIn>
        <section style={{ padding: '80px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
            <h2 style={{ fontFamily: t.serif, fontSize: 72, lineHeight: 0.95, letterSpacing: -2, fontWeight: 400, margin: 0, maxWidth: 600 }}>
              La ferme, <em style={{ fontStyle: 'italic', color: t.vert }}>vue de l'intérieur</em>.
            </h2>
            <div style={{ fontSize: 13, color: t.charbonMute, fontFamily: 'ui-monospace, monospace', letterSpacing: 0.5, paddingBottom: 8 }}>
              CARNET VISUEL / 06
            </div>
          </div>
          {(() => {
            const photos = [
              { key: 'gallery_1', label: "Serres à l'aube", tone: 'vert',  gridColumn: '1 / 3', gridRow: '1' },
              { key: 'gallery_2', label: 'Cagette tomates', tone: 'sable', gridColumn: '3',     gridRow: '1 / 3' },
              { key: 'gallery_3', label: 'Détail basilic',  tone: 'creme', gridColumn: '1',     gridRow: '2' },
              { key: 'gallery_4', label: 'Mains, terre',    tone: 'dark',  gridColumn: '2',     gridRow: '2' },
              { key: 'gallery_5', label: "Étal du marché",  tone: 'creme', gridColumn: '1',     gridRow: '3' },
              { key: 'gallery_6', label: 'Rangée de courgettes', tone: 'vert', gridColumn: '2 / 4', gridRow: '3' },
            ];
            return (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: '340px 220px 280px',
                gap: 10,
              }}>
                {photos.map(({ key, label, tone, gridColumn, gridRow }) => (
                  <div key={key} style={{ gridColumn, gridRow, border: `2px solid ${t.orange}`, overflow: 'hidden', position: 'relative' }}>
                    {g(key)
                      ? <Image src={g(key)} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                      : <Placeholder label={label} ratio="auto" tone={tone} style={{ height: '100%' }} />
                    }
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      </FadeIn>

      {/* VIDÉO */}
      <FadeIn>
        <section style={{ background: t.charbon, color: t.creme, padding: '120px 56px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 72, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 20 }}>
                ·── En mouvement
              </div>
              <h2 style={{ fontFamily: t.serif, fontSize: 64, lineHeight: 1, letterSpacing: -1.5, fontWeight: 400, margin: '0 0 32px' }}>
                Une <em style={{ fontStyle: 'italic', color: t.orange }}>journée</em><br/>à la ferme.
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.75, margin: '0 0 40px', maxWidth: 380 }}>
                De la récolte à 6h du matin jusqu'au dernier panier livré. Quatre minutes pour tout comprendre.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.6 }}>
                <span>Durée</span>
                <span style={{ fontFamily: t.serif, fontSize: 24, fontStyle: 'italic', fontWeight: 400, opacity: 1, color: t.creme }}>04:32</span>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <Placeholder label="Vidéo d'immersion à la ferme" ratio="16/9" tone="dark" />
              <button style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                background: t.orange, border: 'none', cursor: 'pointer',
                width: 96, height: 96, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Picto name="play" size={40} color={t.creme} stroke={1.6} />
              </button>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* APERÇU PROMOTIONS */}
      <FadeIn>
        <ApercuProduitsB t={t} promos={allPromos} onVoirPlus={() => setSection('promotions')} />
      </FadeIn>

      </>}

      {/* ═══════════ PRODUITS ═══════════ */}
      {section === 'produits' && (
      <section style={{ padding: '64px 56px 120px' }}>
        <div style={{ maxWidth: 900, marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.vert, fontWeight: 600, marginBottom: 20 }}>
            ·── Catalogue 2026
          </div>
          <h1 style={{ fontFamily: t.serif, fontSize: 120, lineHeight: 0.9, letterSpacing: -3, fontWeight: 400, margin: 0 }}>
            Les <em style={{ fontStyle: 'italic', color: t.vert }}>récoltes</em>.
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: t.charbonSoft, marginTop: 24, maxWidth: 560 }}>
            Commande par téléphone ou mail — nous récoltons sur demande pour garantir la fraîcheur.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
          {[
            { id: 'toutes', label: 'Toutes les saisons', icon: 'leaf' },
            { id: 'Été', label: 'Été', icon: 'sun' },
            { id: 'Hiver', label: 'Hiver', icon: 'snow' },
          ].map(f => (
            <button key={f.id} onClick={() => setSaisonFilter(f.id)} style={{
              background: saisonFilter === f.id ? t.vert : t.creme,
              color: saisonFilter === f.id ? t.creme : t.charbonSoft,
              border: `1px solid ${saisonFilter === f.id ? t.vert : t.bord}`,
              padding: '12px 22px', cursor: 'pointer', borderRadius: 999,
              fontFamily: t.sans, fontSize: 13, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Picto name={f.icon} size={15} stroke={1.5} />
              {f.label}
            </button>
          ))}
        </div>
        <ProductGrid produits={produits} t={t} variant={gridStyle} promos={allPromos} onVoirPromo={() => setSection('promotions')} />
      </section>
      )}

      {/* ═══════════ PROMOTIONS ═══════════ */}
      {section === 'promotions' && (
      <section style={{ padding: '64px 56px 120px' }}>
        <div style={{ maxWidth: 900, marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 20 }}>
            ·── Offres de la semaine
          </div>
          <h1 style={{ fontFamily: t.serif, fontSize: 120, lineHeight: 0.9, letterSpacing: -3, fontWeight: 400, margin: 0 }}>
            Les <em style={{ fontStyle: 'italic', color: t.orange }}>promos</em>.
          </h1>
        </div>
        <p style={{ fontSize: 15, color: t.charbonSoft, margin: '0 0 32px', lineHeight: 1.6 }}>
          Commande par téléphone ou mail — nous récoltons sur demande pour garantir la fraîcheur.
        </p>
        {allPromos.length === 0 ? (
          <div style={{ fontFamily: t.serif, fontSize: 22, color: t.charbonMute, fontStyle: 'italic', paddingTop: 40 }}>
            Aucune promotion en ce moment.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {allPromos.map((promo, i) => (
              <article key={i} style={{
                background: t.creme, border: `2px solid ${t.orange}`, overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ position: 'relative' }}>
                  {promo.image
                    ? <Image src={promo.image} alt={promo.titre} width={400} height={300} sizes="(max-width: 768px) 100vw, 25vw" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
                    : <Placeholder label={promo.titre} ratio="4/3" tone="sable" />
                  }
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: t.creme, padding: '4px 9px',
                    fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999,
                  }}>
                    <Picto name={promo.saison === 'Été' ? 'sun' : 'snow'} size={10} color={promo.saison === 'Été' ? t.orange : t.vertSoft} />
                    <span style={{ color: t.charbon }}>{promo.saison}</span>
                  </div>
                  {promo.remise && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10,
                      background: t.orange, color: t.creme,
                      padding: '4px 9px', borderRadius: 999,
                      fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                    }}>{promo.remise}</div>
                  )}
                </div>
                <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontFamily: t.serif, fontSize: 20, fontWeight: 500, margin: '0 0 6px', letterSpacing: -0.3, lineHeight: 1.05 }}>
                    {promo.titre}
                  </h3>
                  {promo.desc && (
                    <p style={{ fontSize: 12, color: t.charbonSoft, lineHeight: 1.4, margin: '0 0 12px', flex: 1 }}>{promo.desc}</p>
                  )}
                  <div style={{
                    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                    borderTop: `1px solid ${t.bord}`, paddingTop: 12, marginTop: 'auto',
                  }}>
                    <div>
                      <div style={{ fontFamily: t.serif, fontSize: 28, fontWeight: 500, color: t.orange, lineHeight: 1, letterSpacing: -0.5 }}>
                        {promo.prix}
                        <span style={{ fontSize: 12, color: t.charbonMute, fontStyle: 'italic', marginLeft: 3 }}>{promo.unit}</span>
                      </div>
                      {promo.avant && (
                        <div style={{ fontSize: 11, color: t.charbonMute, textDecoration: 'line-through', marginTop: 3 }}>
                          {promo.avant} {promo.unit}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      )}

      {/* ═══════════ CONTACT ═══════════ */}
      {section === 'contact' && (
      <section style={{ padding: '64px 56px 120px' }}>
        <div style={{ maxWidth: 900, marginBottom: 56 }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.vert, fontWeight: 600, marginBottom: 20 }}>
            ·── Rendez-vous
          </div>
          <h1 style={{ fontFamily: t.serif, fontSize: 120, lineHeight: 0.9, letterSpacing: -3, fontWeight: 400, margin: 0 }}>
            <em style={{ fontStyle: 'italic', color: t.vert }}>Venez</em>.
          </h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: 32 }}>
          <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
            {[
              { icon: 'phone', label: 'Par téléphone', val: '07 60 51 58 36', detail: 'Lun–Sam · 8h–19h', bg: t.vert, color: t.creme },
              { icon: 'mail', label: 'Par email', val: 'oregale.des.saisons@gmail.com', detail: 'Réponse sous 24h', bg: t.creme, color: t.charbon },
              { icon: 'pin', label: 'À la ferme', val: '1 Les Soulzors', detail: '87360 Verneuil-Moustiers', bg: t.charbon, color: t.creme },
            ].map((c, i) => (
              <div key={i} style={{ background: c.bg, color: c.color, padding: '20px 24px', border: c.bg === t.creme ? `1px solid ${t.bord}` : 'none', display: 'flex', gap: 18, alignItems: 'center' }}>
                <Picto name={c.icon} size={22} color={c.bg === t.creme ? t.vert : t.orange} stroke={1.4} />
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>{c.label}</div>
                  <div style={{ fontFamily: t.serif, fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>{c.val}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginTop: 3 }}>{c.detail}</div>
                </div>
              </div>
            ))}
            <div style={{ background: t.sable, overflow: 'hidden' }}>
              <div style={{ padding: '12px 20px', borderBottom: `1px solid ${t.bord}`, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute }}>
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
                    { lieu: 'Le Dorat',       horaire: '17h–17h30', detail: 'Place de la fontaine' },
                    { lieu: 'Châteauponsac',  horaire: '18h–18h30', detail: 'Parking du collège J.Moulin' },
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
                <div key={gi} style={{ padding: '14px 20px', borderBottom: gi < arr.length - 1 ? `1px solid ${t.bord}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <Picto name={grp.icone} size={11} color={grp.couleur} stroke={1.8} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: grp.couleur }}>{grp.jour}</span>
                  </div>
                  {grp.arrets.map((a, ai) => (
                    <div key={ai} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: ai < grp.arrets.length - 1 ? 8 : 0 }}>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.charbon }}>{a.lieu}</span>
                        <span style={{ fontSize: 11, color: t.charbonMute, marginLeft: 6 }}>{a.detail}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: t.charbon, flexShrink: 0, fontFamily: t.serif }}>{a.horaire}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 20px', background: t.creme, border: `1px solid ${t.bord}`, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, fontWeight: 600, minWidth: 80 }}>Suivez-nous</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href="https://www.instagram.com/oregaledessaisons" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                  background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  color: '#fff', borderRadius: 999, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                }}>
                  <Picto name="instagram" size={14} color="#fff" stroke={1.6} />
                  Instagram
                </a>
                <a href="https://www.facebook.com/oregaledessaisons" target="_blank" rel="noopener noreferrer" style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                  background: '#1877F2', color: '#fff', borderRadius: 999,
                  textDecoration: 'none', fontSize: 12, fontWeight: 600,
                }}>
                  <Picto name="facebook" size={14} color="#fff" stroke={1.6} />
                  Facebook
                </a>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <MapContact style={{ aspectRatio: 'unset', height: '100%', flex: 1 }} />
          </div>
        </div>

        <div style={{ marginTop: 56, paddingTop: 48, borderTop: `1px solid ${t.bord}` }}>
          <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.vert, fontWeight: 600, marginBottom: 8 }}>
            ·── Nous écrire
          </div>
          <p style={{ fontSize: 15, color: t.charbonMute, margin: '0 0 28px', maxWidth: 480, lineHeight: 1.6 }}>
            Une question, une commande à préparer ? Envoyez-nous un message, nous vous répondons rapidement.
          </p>
          <ContactFormBlock t={t} />
        </div>
      </section>
      )}

      {/* FOOTER */}
      <footer style={{ background: t.charbon, color: t.creme, padding: '80px 56px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 48, marginBottom: 64, borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.orange, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Picto name="leaf" size={17} color={t.creme} stroke={1.8} />
              </div>
              <div style={{ fontFamily: t.serif, fontSize: 26, fontWeight: 400 }}>
                O'régale <em style={{ fontStyle: 'italic' }}>des saisons</em>
              </div>
            </div>
            <div style={{ fontSize: 14, opacity: 0.7, maxWidth: 360, lineHeight: 1.6 }}>
              Plus sain et bien meilleur.
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.5, marginBottom: 16 }}>Navigation</div>
            {NAV_B.map(n => <div key={n.id} style={{ fontSize: 14, marginBottom: 10 }}>{n.label}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.5, marginBottom: 16 }}>Contact</div>
            <div style={{ fontSize: 14, marginBottom: 10 }}>07 60 51 58 36</div>
            <div style={{ fontSize: 14, marginBottom: 10, opacity: 0.85 }}>oregale.des.saisons@gmail.com</div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.5, marginBottom: 16 }}>Réseaux sociaux</div>
            <a href="https://www.instagram.com/oregaledessaisons" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 12, color: t.creme, textDecoration: 'none', opacity: 0.85 }}>
              <Picto name="instagram" size={16} color={t.orange} stroke={1.6} />
              Instagram
            </a>
            <a href="https://www.facebook.com/oregaledessaisons" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: t.creme, textDecoration: 'none', opacity: 0.85 }}>
              <Picto name="facebook" size={16} color={t.orange} stroke={1.6} />
              Facebook
            </a>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.5, marginBottom: 16 }}>Ferme</div>
            <div style={{ fontSize: 14, marginBottom: 10 }}>1 Les Soulzors</div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>87360 Verneuil-Moustiers</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, opacity: 0.5, letterSpacing: 0.5 }}>
          <span>© 2026 O'régale des saisons — Tous droits réservés</span>
          <span>Haute-Vienne · Nouvelle-Aquitaine</span>
        </div>
      </footer>
    </div>
  );
}

function ApercuProduitsB({ t, promos, onVoirPlus }) {
  const echantillon = promos.slice(0, 4);
  return (
    <section style={{ padding: '120px 56px', background: t.cremeDark }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', color: t.orange, fontWeight: 600, marginBottom: 20 }}>
            ·── Offres de la semaine
          </div>
          <h2 style={{ fontFamily: t.serif, fontSize: 64, lineHeight: 0.95, letterSpacing: -1.5, fontWeight: 400, margin: 0 }}>
            Les <em style={{ fontStyle: 'italic', color: t.orange }}>promotions</em><br/>du moment.
          </h2>
        </div>
        <button onClick={onVoirPlus} style={{
          background: t.orange, color: t.creme, border: 'none',
          padding: '16px 26px', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
          fontFamily: t.sans, fontWeight: 600, cursor: 'pointer', borderRadius: 999,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          Voir toutes les promos <Picto name="arrowRight" size={14} stroke={1.8} />
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {Array.from({ length: 4 }).map((_, i) => {
          const promo = echantillon[i];
          if (!promo) return (
            <div key={i} style={{
              background: t.cremeDark, border: `1px dashed ${t.bord}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 320,
            }}>
              <div style={{ fontFamily: t.serif, fontSize: 14, color: t.charbonMute, fontStyle: 'italic', textAlign: 'center', padding: 20 }}>
                Prochaine<br/>promotion<br/>à venir…
              </div>
            </div>
          );
          return (
            <article key={i} onClick={onVoirPlus} style={{
              background: t.creme, border: `2px solid ${t.orange}`, overflow: 'hidden', cursor: 'pointer',
            }}>
              <div style={{ position: 'relative' }}>
                {promo.image
                  ? <Image src={promo.image} alt={promo.titre} width={400} height={400} sizes="(max-width: 768px) 50vw, 25vw" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
                  : <Placeholder label={promo.titre} ratio="1/1" tone="sable" />
                }
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: t.creme, padding: '5px 10px',
                  fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 5, borderRadius: 999,
                }}>
                  <Picto name={promo.saison === 'Été' ? 'sun' : 'snow'} size={10} color={promo.saison === 'Été' ? t.orange : t.vertSoft} />
                  <span style={{ color: t.charbon }}>{promo.saison}</span>
                </div>
                {promo.remise && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: t.orange, color: t.creme,
                    padding: '5px 10px', borderRadius: 999,
                    fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 700,
                  }}>{promo.remise}</div>
                )}
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontFamily: t.serif, fontSize: 20, fontWeight: 500, margin: '0 0 10px', letterSpacing: -0.3, lineHeight: 1.05 }}>{promo.titre}</h3>
                {promo.desc && (
                  <p style={{ fontSize: 12, color: t.charbonSoft, lineHeight: 1.4, margin: '0 0 12px' }}>{promo.desc}</p>
                )}
                <div style={{ borderTop: `1px solid ${t.bord}`, paddingTop: 14 }}>
                  <div style={{ fontFamily: t.serif, fontSize: 28, fontWeight: 500, color: t.orange, letterSpacing: -0.5, lineHeight: 1 }}>
                    {promo.prix}
                    <span style={{ fontSize: 13, color: t.charbonMute, fontStyle: 'italic', marginLeft: 4 }}>{promo.unit}</span>
                  </div>
                  {promo.avant && (
                    <div style={{ fontSize: 12, color: t.charbonMute, textDecoration: 'line-through', marginTop: 3 }}>{promo.avant} {promo.unit}</div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export { SiteB, PRODUITS_B, PROMOS_B };
