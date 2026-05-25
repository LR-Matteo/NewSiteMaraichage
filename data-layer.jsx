// Chargement des données depuis data.json

async function _loadData() {
  const res = await fetch('./data.json');
  if (!res.ok) throw new Error('data.json introuvable');
  return res.json();
}

function _normProduit(p) {
  return {
    nom: p.name,
    prix: String(p.price).replace('.', ','),
    unit: p.unit ? `€/${p.unit}` : '€/kg',
    saison: p.season === 'été' ? 'Été' : 'Hiver',
    image: p.image || null,
  };
}

function _normPromo(promo, produits) {
  const prod = (produits || []).find(p => p.id === promo.product_id) || null;
  const avant = prod ? parseFloat(prod.price) : null;
  const prixPromo = parseFloat(promo.promo_price);
  const remise = avant && avant > prixPromo
    ? `-${Math.round((1 - prixPromo / avant) * 100)}%`
    : null;
  return {
    titre: prod ? prod.name : 'Promotion',
    desc: promo.description || '',
    prix: String(promo.promo_price).replace('.', ','),
    avant: avant ? String(avant).replace('.', ',') : null,
    remise,
    image: prod ? (prod.image || null) : null,
    saison: prod ? (prod.season === 'été' ? 'Été' : 'Hiver') : 'Été',
    unit: prod && prod.unit ? `€/${prod.unit}` : '€/kg',
  };
}

function useORSData() {
  const [produits, setProduits] = React.useState([]);
  const [promotions, setPromotions] = React.useState([]);
  const [homeContent, setHomeContent] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    _loadData()
      .then(data => {
        const prods = data.products || [];
        const promos = (data.promotions || []).filter(pr => pr.active);
        const home = data.home_content || {};
        setProduits(prods.map(_normProduit));
        setPromotions(promos.map(pr => _normPromo(pr, prods)));
        setHomeContent(home);
      })
      .catch(e => console.warn('[ors] Chargement données échoué :', e.message))
      .finally(() => setLoading(false));
  }, []);

  return { produits, promotions, homeContent, loading };
}

Object.assign(window, { useORSData, _normProduit, _normPromo });
