// Fetch Pokemon data
async function fetchPokemonData(offset, limit) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

// Fetch Pokemon details and image
async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const abilities = data.abilities.map((ability) => ability.ability.name);
    const moves = data.moves.map((move) => move.move.name);
    const weight = data.weight;
    const image = data.sprites.other['official-artwork'].front_default;

    return {
      abilities,
      moves,
      weight,
      image,
    };
  } catch (error) {
    console.error(error);
  }
}

// Display Pokemon data
async function displayPokemonData(offset, limit) {
  const pokemonListElement = document.getElementById('pokemon-list');
  pokemonListElement.innerHTML = '';

  const pokemonData = await fetchPokemonData(offset, limit);

  for (let i = 0; i < pokemonData.length; i++) {
    const pokemon = pokemonData[i];
    const pokemonDetails = await fetchPokemonDetails(pokemon.url);

    // Create Pokemon card
    const pokemonCard = document.createElement('div');
    pokemonCard.className = 'pokemon-card';
    pokemonCard.innerHTML = `
      <img src="${pokemonDetails.image}" alt="${pokemon.name}" class="pokemon-image" width="150px" height="150px">
      <h3>${pokemon.name}</h3>
      <p><strong>Abilities:</strong> ${pokemonDetails.abilities.join(', ')}</p>
      <p><strong>Moves:</strong> ${pokemonDetails.moves.join(', ')}</p>
      <p><strong>Weight:</strong> ${pokemonDetails.weight}</p>
    `;

    // Add suitable color class to Pokemon name
    const nameElement = pokemonCard.querySelector('h3');
    nameElement.classList.add(getColorClass(i));

    pokemonListElement.appendChild(pokemonCard);
  }
}

// Get suitable color class for Pokemon name
function getColorClass(index) {
  const colorClasses = ['color-class-1', 'color-class-2', 'color-class-3', 'color-class-4'];
  return colorClasses[index % colorClasses.length];
}

// Pagination event listeners
let offset = 0;
const limit = 10;

const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

prevButton.addEventListener('click', () => {
  if (offset > 0) {
    offset -= limit;
    displayPokemonData(offset, limit);
  }
});

nextButton.addEventListener('click', () => {
  offset += limit;
  displayPokemonData(offset, limit);
});

// Initial display of Pokemon data
displayPokemonData(offset, limit);
