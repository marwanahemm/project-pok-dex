// ========================================
// API — Tyradex (données en français)
// ========================================
const API_URL = 'https://tyradex.app/api/v1/pokemon';

// ========================================
// COULEURS PAR TYPE
// ========================================
const TYPE_COLORS = {
    'Plante':    '#22c55e',
    'Feu':       '#f97316',
    'Eau':       '#3b82f6',
    'Insecte':   '#84cc16',
    'Normal':    '#9ca3af',
    'Poison':    '#a855f7',
    'Électrik':  '#eab308',
    'Sol':       '#f59e0b',
    'Fée':       '#ec4899',
    'Combat':    '#ef4444',
    'Psy':       '#d946ef',
    'Roche':     '#92400e',
    'Spectre':   '#6366f1',
    'Glace':     '#06b6d4',
    'Dragon':    '#4f46e5',
    'Ténèbres':  '#57534e',
    'Acier':     '#64748b',
    'Vol':       '#38bdf8',
};

function statColor(v) {
    if (v < 50)  return '#ef4444';
    if (v < 80)  return '#f97316';
    if (v < 100) return '#eab308';
    if (v < 130) return '#22c55e';
    return '#6366f1';
}

// ========================================
// ÉTAT
// ========================================
let allPokemon  = [];
let currentIdx  = 0;
let shinyOn     = false;
let detailOpen  = false;

// ========================================
// Le DOM
// ========================================
const loadingScreen   = document.getElementById('loading');

const viewMain        = document.getElementById('view-main');
const viewDetail      = document.getElementById('view-detail');
const pokeNum         = document.getElementById('poke-num');
const counter         = document.getElementById('counter');
const pokeSprite      = document.getElementById('poke-sprite');
const pokeName        = document.getElementById('poke-name');
const pokeTypes       = document.getElementById('poke-types');

const detailNum       = document.getElementById('detail-num');
const detailName      = document.getElementById('detail-name');
const detailHeight    = document.getElementById('detail-height');
const detailWeight    = document.getElementById('detail-weight');
const detailTalents   = document.getElementById('detail-talents');
const detailStats     = document.getElementById('detail-stats');

const prevBtn         = document.getElementById('prev-btn');
const nextBtn         = document.getElementById('next-btn');
const toggleBtn       = document.getElementById('toggle-btn');
const shinyBtn        = document.getElementById('shiny-btn');
const searchBtn       = document.getElementById('search-btn');

const searchOverlay   = document.getElementById('search-overlay');
const searchBackdrop  = document.getElementById('search-backdrop');
const searchInput     = document.getElementById('search-input');
const searchResults   = document.getElementById('search-results');
const searchCloseBtn  = document.getElementById('search-close');

// ========================================
// Chargement des données depuis l'API
// ========================================
async function loadPokemon() {
    try {
        const res  = await fetch(API_URL);
        const data = await res.json();
        // Index 0 = "Inconnu", on prend 1 à 151
        allPokemon = data.slice(1, 152);
        display(0);
        loadingScreen.classList.add('hidden');
    } catch (err) {
        console.error('Erreur API:', err);
        loadingScreen.innerHTML = '<p style="color:#ef4444;padding:20px">Impossible de charger les données. Vérifiez votre connexion.</p>';
    }
}

// ========================================
// AFFICHE UN POKÉMON
// ========================================
function display(idx) {
    const p = allPokemon[idx];
    currentIdx = idx;

    const id    = String(p.pokedex_id).padStart(3, '0');
    const name  = p.name?.fr || '???';
    const types = p.types || [];
    const img   = shinyOn ? (p.sprites?.shiny || p.sprites?.regular) : p.sprites?.regular;

    // Vue principale
    pokeNum.textContent     = `#${id}`;
    counter.textContent     = `${idx + 1} / ${allPokemon.length}`;
    pokeSprite.src          = img || '';
    pokeSprite.alt          = name;
    pokeName.textContent    = name;
    pokeTypes.innerHTML     = typeBadges(types);

    // Vue détail
    detailNum.textContent    = `#${id}`;
    detailName.textContent   = name;
    detailHeight.textContent = p.height || '—';
    detailWeight.textContent = p.weight || '—';

    // Talents
    const talents = p.talents || [];
    detailTalents.innerHTML = talents.length
        ? talents.map(t => `<span class="talent-chip ${t.tc ? 'tc' : ''}">${t.name}</span>`).join('')
        : '<span class="talent-chip">—</span>';

    // StatIstiques
    const stats      = p.stats;
    const statLabels = { hp: 'PV', atk: 'Atk', def: 'Def', spe_atk: 'Atk.S', spe_def: 'Def.S', vit: 'Vit' };
    if (stats) {
        detailStats.innerHTML = Object.entries(statLabels).map(([k, lbl]) => {
            const v   = stats[k] ?? 0;
            const pct = Math.min(100, Math.round((v / 255) * 100));
            return `
                <div class="stat-row">
                    <span class="stat-lbl">${lbl}</span>
                    <span class="stat-num">${v}</span>
                    <div class="stat-track">
                        <div class="stat-fill" style="width:${pct}%;background:${statColor(v)}"></div>
                    </div>
                </div>`;
        }).join('');
    } else {
        detailStats.innerHTML = '<span style="color:rgba(255,255,255,.3);font-size:11px">—</span>';
    }

    // Couleur de fond Pokéball (type)
    updateOrangeTheme(types);
}

// ========================================
// THÈME COULEUR (zone orange adapte selon type)
// ========================================
function updateOrangeTheme(types) {
    const color = TYPE_COLORS[types[0]?.name] || '#e8631a';
    document.documentElement.style.setProperty('--type-color', color);
}

// ========================================
// BADGES DE TYPE
// ========================================
function typeBadges(types) {
    return types.map(t =>
        `<span class="type-badge" style="background:${TYPE_COLORS[t.name] || '#6b7280'}">${t.name}</span>`
    ).join('');
}

// ========================================
// TOGGLE VUE DÉTAIL
// ========================================
function toggleView() {
    detailOpen = !detailOpen;
    viewMain.classList.toggle('active', !detailOpen);
    viewDetail.classList.toggle('active', detailOpen);
    toggleBtn.style.background = detailOpen
        ? 'radial-gradient(circle at 35% 30%, #6366f1 0%, #4f46e5 100%)'
        : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #d4d4d4 60%, #b8b8b8 100%)';
}

// ========================================
// NAV
// ========================================
function goNext() {
    const next = (currentIdx + 1) % allPokemon.length;
    display(next);
}
function goPrev() {
    const prev = (currentIdx - 1 + allPokemon.length) % allPokemon.length;
    display(prev);
}

// ========================================
// RECHERCHE
// ========================================
function openSearch() {
    searchOverlay.classList.remove('hidden');
    searchInput.focus();
    renderSearchResults('');
}

function closeSearch() {
    searchOverlay.classList.add('hidden');
    searchInput.value = '';
}

function renderSearchResults(q) {
    const query = q.toLowerCase().trim();
    const matches = allPokemon.filter(p =>
        !query
        || p.name?.fr?.toLowerCase().includes(query)
        || String(p.pokedex_id).includes(query)
    ).slice(0, 20);

    if (matches.length === 0) {
        searchResults.innerHTML = '<div class="no-results">Aucun résultat</div>';
        return;
    }

    searchResults.innerHTML = matches.map(p => {
        const id    = String(p.pokedex_id).padStart(3, '0');
        const name  = p.name?.fr || '???';
        const img   = p.sprites?.regular || '';
        const types = p.types || [];
        return `
            <div class="result-item" data-idx="${allPokemon.indexOf(p)}">
                <img class="result-img" src="${img}" alt="${name}">
                <span class="result-num">#${id}</span>
                <span class="result-name">${name}</span>
                <div class="result-types">${typeBadges(types)}</div>
            </div>`;
    }).join('');

    searchResults.querySelectorAll('.result-item').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.idx, 10);
            display(idx);
            // Repasser en vue sprite si on était en détail
            if (detailOpen) toggleView();
            closeSearch();
        });
    });
}

// ========================================
// SHINY
// ========================================
function toggleShiny() {
    shinyOn = !shinyOn;
    shinyBtn.classList.toggle('active', shinyOn);
    display(currentIdx);
}

// ========================================
// ÉVÉNEMENTS
// ========================================
prevBtn.addEventListener('click', goPrev);
nextBtn.addEventListener('click', goNext);
toggleBtn.addEventListener('click', toggleView);
shinyBtn.addEventListener('click', toggleShiny);
searchBtn.addEventListener('click', openSearch);
searchCloseBtn.addEventListener('click', closeSearch);
searchBackdrop.addEventListener('click', closeSearch);

searchInput.addEventListener('input', e => renderSearchResults(e.target.value));

document.addEventListener('keydown', e => {
    if (!searchOverlay.classList.contains('hidden')) {
        if (e.key === 'Escape') closeSearch();
        return;
    }
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft')  goPrev();
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleView(); }
    if (e.key === 'f' || e.key === 'F')     openSearch();
});

// Swipe tactile
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx > 0 ? goPrev() : goNext();
}, { passive: true });

// ========================================
// DÉMARRAGE
// ========================================
loadPokemon();
