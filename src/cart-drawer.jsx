'use client';
import React from 'react';
import emailjs from '@emailjs/browser';
import { Picto, ORSTokens } from './shared';

const RETRAITS = [
  { id: 'jeu-lussac',  label: 'Lussac-les-Églises',    detail: 'Jeudi · 17h–17h30 · Place du kiosque à pizza' },
  { id: 'jeu-magnac',  label: 'Magnac-Laval',           detail: 'Jeudi · 18h–18h30 · Place de la Mairie' },
  { id: 'ven-dorat',   label: 'Le Dorat',               detail: 'Vendredi · 17h–17h30 · Place de la fontaine' },
  { id: 'ven-chateau', label: 'Châteauponsac',           detail: 'Vendredi · 18h–18h30 · Parking collège J.Moulin' },
  { id: 'mer-ferme',   label: 'À la ferme — Mercredi',  detail: 'Mercredi · 9h–11h · 1 Les Soulzors, Verneuil-Moustiers' },
  { id: 'sam-ferme',   label: 'À la ferme — Samedi',    detail: 'Samedi · 9h–11h · 1 Les Soulzors, Verneuil-Moustiers' },
];

function formatOrder(items, retraitId, phone, email, note) {
  const retrait = RETRAITS.find(r => r.id === retraitId);
  const lines = items.map(i => `- ${i.nom} × ${i.qty} ${i.unit.replace('€/', '')}`).join('\n');
  const contact = [phone && `Téléphone : ${phone}`, email && `Email : ${email}`].filter(Boolean).join('\n');
  return `DEMANDE DE RÉSERVATION\n\nContact :\n${contact}\n\nProduits :\n${lines}\n\nPoint de retrait : ${retrait ? retrait.detail : retraitId}${note ? `\n\nMessage : ${note}` : ''}`;
}

function CartDrawer({ items, onClose, onUpdateQty, onRemove, onClear }) {
  const t = ORSTokens;
  const [form, setForm] = React.useState({ name: '', phone: '', email: '', retrait: '', note: '' });
  const [contactError, setContactError] = React.useState(false);
  const [status, setStatus] = React.useState('idle');
  const F = (k, v) => { setForm(f => ({ ...f, [k]: v })); setContactError(false); };

  async function submit(e) {
    e.preventDefault();
    if (!form.phone.trim() && !form.email.trim()) { setContactError(true); return; }
    setStatus('sending');
    try {
      await emailjs.send('service_lfgrmkv', 'template_1er3wnb', {
        name: form.name.trim(),
        email: form.email.trim() || form.phone.trim(),
        message: formatOrder(items, form.retrait, form.phone.trim(), form.email.trim(), form.note),
      });
      setStatus('success');
    } catch (err) {
      console.error('[emailjs]', err);
      setStatus('error');
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', fontSize: 14,
    border: `1px solid ${t.bord}`, outline: 'none',
    fontFamily: 'inherit', background: '#fff', boxSizing: 'border-box',
  };

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(31,29,24,0.45)', zIndex: 40 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, maxWidth: '100vw',
        background: t.creme, zIndex: 41, overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 32px rgba(0,0,0,0.15)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${t.bord}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: t.creme, zIndex: 1,
        }}>
          <div>
            <div style={{ fontFamily: t.serif, fontSize: 22, fontWeight: 500, letterSpacing: -0.3 }}>
              Ma demande de réservation
            </div>
            <div style={{ fontSize: 12, color: t.charbonMute, marginTop: 2 }}>
              {items.length} produit{items.length > 1 ? 's' : ''}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Picto name="close" size={22} stroke={1.5} color={t.charbon} />
          </button>
        </div>

        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontFamily: t.serif, fontSize: 28, color: t.vert, marginBottom: 12 }}>Demande envoyée ✓</div>
              <p style={{ fontSize: 14, color: t.charbonSoft, lineHeight: 1.7, maxWidth: 320, margin: '0 auto 28px' }}>
                Nous vous rappellerons pour confirmer la disponibilité des produits et valider votre réservation.
              </p>
              <button onClick={() => { onClear(); onClose(); }} style={{
                background: t.vert, color: t.creme, border: 'none',
                padding: '12px 28px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              }}>
                Fermer
              </button>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: t.charbonMute }}>
              <Picto name="basket" size={40} stroke={1.2} color={t.bord} />
              <div style={{ fontFamily: t.serif, fontSize: 18, marginTop: 16, fontStyle: 'italic' }}>
                Votre demande est vide.
              </div>
              <div style={{ fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
                Ajoutez des produits depuis le catalogue<br />en cliquant sur "Ajouter à ma demande".
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div>
                {items.map((item, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1fr auto',
                    gap: 12, padding: '12px 0', borderBottom: `1px solid ${t.bord}`, alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontFamily: t.serif, fontSize: 16, fontWeight: 500, marginBottom: 2 }}>{item.nom}</div>
                      <div style={{ fontSize: 12, color: t.charbonMute }}>{item.prix} {item.unit}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => onUpdateQty(item.nom, item.qty - 1)} style={{
                        width: 28, height: 28, border: `1px solid ${t.bord}`, background: '#fff',
                        cursor: 'pointer', fontSize: 18, color: t.charbon,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>−</button>
                      <span style={{ fontFamily: t.serif, fontSize: 18, minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.nom, item.qty + 1)} style={{
                        width: 28, height: 28, border: `1px solid ${t.bord}`, background: '#fff',
                        cursor: 'pointer', fontSize: 18, color: t.charbon,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>+</button>
                      <button onClick={() => onRemove(item.nom)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 2 }}>
                        <Picto name="close" size={13} stroke={2} color={t.charbonMute} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <div style={{
                padding: '14px 16px', borderLeft: `3px solid ${t.orange}`,
                background: t.cremeDark, fontSize: 13, color: t.charbonSoft, lineHeight: 1.65,
              }}>
                Votre demande sera traitée dans les meilleurs délais. Nous vous contacterons par téléphone ou par email pour confirmer la disponibilité et valider la réservation.{' '}
                <strong>Aucune réservation n'est garantie avant cette confirmation.</strong>
              </div>

              {/* Form */}
              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Nom *</label>
                  <input style={inputStyle} value={form.name} onChange={e => F('name', e.target.value)} placeholder="Votre nom" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 4 }}>Téléphone</label>
                  <div style={{ fontSize: 11, color: t.charbonMute, marginBottom: 8 }}>Au moins l'un des deux est requis</div>
                  <input style={{ ...inputStyle, borderColor: contactError ? '#dc2626' : t.bord }} type="tel" value={form.phone} onChange={e => F('phone', e.target.value)} placeholder="06 XX XX XX XX" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Email</label>
                  <input style={{ ...inputStyle, borderColor: contactError ? '#dc2626' : t.bord }} type="email" value={form.email} onChange={e => F('email', e.target.value)} placeholder="votre@email.fr" />
                </div>
                {contactError && (
                  <p style={{ fontSize: 12, color: '#dc2626', margin: '-8px 0 0', fontStyle: 'italic' }}>
                    Veuillez renseigner un téléphone ou une adresse email.
                  </p>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 10 }}>Point de retrait *</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {RETRAITS.map(r => (
                      <label key={r.id} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer',
                        padding: '10px 12px',
                        background: form.retrait === r.id ? t.cremeDark : '#fff',
                        border: `1px solid ${form.retrait === r.id ? t.vert : t.bord}`,
                        transition: 'all .1s',
                      }}>
                        <input type="radio" name="retrait" value={r.id} checked={form.retrait === r.id} onChange={() => F('retrait', r.id)} style={{ marginTop: 3, accentColor: t.vert }} required />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: t.charbon }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: t.charbonMute, marginTop: 2 }}>{r.detail}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: t.charbonMute, marginBottom: 8 }}>Message (optionnel)</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.note} onChange={e => F('note', e.target.value)} placeholder="Précisions sur les quantités, variétés souhaitées…" />
                </div>
                <button type="submit" disabled={status === 'sending'} style={{
                  background: t.vert, color: t.creme, border: 'none',
                  padding: '14px', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                  opacity: status === 'sending' ? 0.7 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma demande'}
                </button>
                {status === 'error' && (
                  <p style={{ fontSize: 13, color: '#dc2626', textAlign: 'center', margin: 0 }}>
                    Une erreur est survenue. Réessayez ou appelez-nous au 07 60 51 58 36.
                  </p>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CartButton({ count, onClick }) {
  const t = ORSTokens;
  return (
    <button onClick={onClick} style={{
      background: count > 0 ? t.vert : t.creme,
      color: count > 0 ? t.creme : t.charbon,
      border: `1px solid ${count > 0 ? t.vert : t.bord}`,
      cursor: 'pointer',
      padding: '9px 18px', borderRadius: 999, fontSize: 13, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 8, transition: 'all .15s',
    }}>
      <Picto name="basket" size={15} stroke={1.8} color={count > 0 ? t.creme : t.charbon} />
      {count > 0 ? `Ma demande (${count})` : 'Réserver'}
    </button>
  );
}

export { CartDrawer, CartButton };
