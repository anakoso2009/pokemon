const grid = document.getElementById("grid");

const typeColors = {
  dark: "#341298ff", };

async function fetchDarkPokemons() {
    const res = await fetch(`https://pokeapi.co/api/v2/type/dark`);
    const data = await res.json();

    // Obter um número limitado de Pokémon
    const pokemons = data.pokemon.slice(0, 12);

    for (const p of pokemons) {
      const res2 = await fetch(p.pokemon.url);
      const pokemonData = await res2.json();

      const name = pokemonData.name;
      const id = pokemonData.id.toString().padStart(3, "0");

      const imgUrl =
        pokemonData.sprites.other["official-artwork"].front_default ||
        pokemonData.sprites.front_default;

      const height = pokemonData.height < 10 ? `${pokemonData.height * 10}cm` : `${pokemonData.height / 10}m`;

      const weight = `${pokemonData.weight / 10} kg`;

      const abilities = pokemonData.abilities
        .slice(0, 2)
        .map((a) => a.ability.name)
        .join(", ");

      const stats = {};
      pokemonData.stats.forEach((s) => (stats[s.stat.name] = s.base_stat));

      const atk = stats.attack || 0;
      const def = stats.defense || 0;

      const mainType = pokemonData.types[0].type.name;
      const color = typeColors[mainType] || "#777";

      const card = document.createElement("div");
      card.classList.add("pokemon-card");
      card.style.borderColor = color;

      card.innerHTML = `
        <div class="card-front">
          <img src="${imgUrl}" alt="${name}" class="poke-img">
          <h2 class="poke-name">${name}</h2>
          <span class="know-more">Saiba mais</span>
        </div>

        <div class="card-back">
          <span class="poke-id">#${id}</span>

          <p><strong>Altura:</strong> ${height}</p>
          <p><strong>Peso:</strong> ${weight}</p>
          <p><strong>Ataque:</strong> ${atk}</p>
          <p><strong>Defesa:</strong> ${def}</p>
          <div class="habil">
            <p><strong>Habilidades:</strong> ${abilities}</p>
          </div>
        </div>
      `;
      

      card.addEventListener("click", () => {
        card.classList.toggle("open");
      });

      grid.appendChild(card);
    }
  }

fetchDarkPokemons();