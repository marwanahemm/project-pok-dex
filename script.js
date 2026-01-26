// ========================================
// VARIABLES GLOBALES// VARIABLES GLOBALES
// ========================================

let allPokemon = [];
let currentIndex = 0;

// Éléments DOM
const pokemonImage = document.getElementById('pokemon-image');
const pokemonName = document.getElementById('pokemon-name');
const pokemonNumber = document.getElementById('pokemon-number');
const pokemonTypes = document.getElementById('pokemon-types');
const pokemonHeight = document.getElementById('pokemon-height');
const pokemonWeight = document.getElementById('pokemon-weight');
const pokemonTalents = document.getElementById('pokemon-talents');
const counter = document.getElementById('counter');

const prevbtn = document.getElementById('prev-btn');
const nextbtn = document.getElementById('next-btn');

// ========================================
// CHARGEMENT DES POKÉMON
// ========================================

async function loadPokemon() {
    try {
        const response = await fetch('https://tyradex.vercel.app/api/v1/gen/1');
        const data = await response.json();
        
        allPokemon = data;
        displayPokemon(0);
        
    } catch (error) {
        console.error('Erreur:', error);
        pokemonName.textContent = 'Erreur';
    }
}

// ========================================
// AFFICHAGE D'UN POKÉMON
// ========================================

function displayPokemon(index) {
    const pokemon = allPokemon[index];
    currentIndex = index;

// Image
pokemonImage.src = pokemon.sprites.regular;
pokemon.alt = pokemon.name.fr;

 // Nom
    pokemonName.textContent = pokemon.name.fr;
    
    // Numéro
    const pokedexId = String(pokemon.pokedex_id).padStart(3, '0');
    pokemonNumber.textContent = `#${pokedexId}`;
    
    // Compteur
    counter.textContent = `${index + 1} / ${allPokemon.length}`;
    
    // Types
    displayTypes(pokemon.types);
    
    // Taille
    pokemonHeight.textContent = pokemon.height;
    
    // Poids
    pokemonWeight.textContent = pokemon.weight;
    
    // Talents
    const talents = pokemon.talents.map(t => t.name).join(', ');
    pokemonTalents.textContent = talents;
}

// ========================================
// AFFICHAGE DES TYPES
// ========================================

function displayTypes(types) {
    // Vide le conteneur
    pokemonTypes.innerText;

    types.array.forEach(element => {
        const badge = document.createElement('span');
        badge.className = 'type-badge';
        badge.style.background = getTypeColor(type.name);

        pokemonTypes.appendChild(badge);
    });
}

// ========================================
// COULEURS DES TYPES
// ========================================

function getTypeColor(typeName) {
    const colors = {
        'Plante': '#78c850',
        'Feu': '#f08030',
        'Eau': '#6890f0',
        'Insecte': '#a8b820',
        'Normal': '#a8a878',
        'Poison': '#a040a0',
        'Électrik': '#f8d030',
        'Sol': '#e0c068',
        'Fée': '#ee99ac',
        'Combat': '#c03028',
        'Psy': '#f85888',
        'Roche': '#b8a038',
        'Spectre': '#705898',
        'Glace': '#98d8d8',
        'Dragon': '#7038f8',
        'Ténèbres': '#705848',
        'Acier': '#b8b8d0',
        'Vol': '#a890f0'
    };
    
    return colors[typeName] || '#777';
}

// ========================================
// NAVIGATION
// ========================================

function nextPokemon() {
    if (currentIndex < allPokemon.length - 1) {
        displayPokemon(currentIndex + 1);
    } else {
        displayPokemon(0);
    }
}

function previousPokemon() {
    if (currentIndex > 0) {
        displayPokemon(currentIndex - 1);
    } else {
        displayPokemon(allPokemon.length - 1);
    }
}

// ========================================
// ÉVÉNEMENTS
// ========================================

// Boutons navigation
nextBtn.addEventListener('click', nextPokemon);
prevBtn.addEventListener('click', previousPokemon);

// Clavier
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') nextPokemon();
    if (event.key === 'ArrowLeft') previousPokemon();
});

// Dpad
document.querySelector('.dpad-btn.right').addEventListener('click', nextPokemon);
document.querySelector('.dpad-btn.left').addEventListener('click', previousPokemon);
document.querySelector('.dpad-btn.up').addEventListener('click', () =>{
    // Saute de 10 pokémon
    const newIndex = Math.min(allPokemon.length -1, currentIndex -10);
    displayPokemon(newIndex);
});
document.querySelector('.dpad-btn.up').addEventListener('click', () =>{
    // Saute de 10 pokémon
    const newIndex = Math.min(allPokemon.length -1, currentIndex +10);
    displayPokemon(newIndex);
});

// ========================================
// DÉMARRAGE
// ========================================

loadPokemon();
