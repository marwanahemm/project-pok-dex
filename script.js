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