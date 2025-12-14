const grid = document.getElementById("grid");

async function fetchFlyingPokemons(limit = 12) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/type/flying`);
    const data = await res.json();

    // Pega uma quantidade limitada
    const pokemons = data.pokemon.slice(0, limit);

    for (const p of pokemons) {
      await fetchAndCreateCard(p.pokemon.name);
    }
  } catch (error) {
    console.error("Erro ao buscar Pokémon voador:", error);
  }
}

async function fetchAndCreateCard(pokemon) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if (!res.ok) throw new Error("Erro HTTP");

    const data = await res.json();
    createCardHTML(data);
  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
  }
}

function createCardHTML(data) {
  const name = data.name;
  const id = data.id.toString().padStart(3, "0");

  const imgUrl =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default;

  const height =
    data.height < 10 ? `${data.height * 10} cm` : `${data.height / 10} m`;

  const weight = `${data.weight / 10} kg`;

  const abilities = data.abilities
    .slice(0, 2)
    .map((a) => a.ability.name)
    .join(", ");

  const stats = {};
  data.stats.forEach((s) => (stats[s.stat.name] = s.base_stat));

  const atk = stats.attack || 0;
  const def = stats.defense || 0;

  const mainType = data.types[0].type.name;

  const card = document.createElement("div");
  card.classList.add("pokemon-card");

  card.innerHTML = `
    <div class="cardfrente">
      <img src="${imgUrl}" alt="${name}" class="poke-img">
      <h2 class="poke-name">${name}</h2>
      <span class="saibamais"> clique e saiba mais </span>
    </div>

    <div class="cardtras">
      <span class="poke-id">#${id}</span>

      <p><strong>Altura:</strong> ${height}</p>
      <p><strong>Peso:</strong> ${weight}</p>
      <p><strong>Ataque:</strong> ${atk}</p>
      <p><strong>Defesa:</strong> ${def}</p>
      <p><strong>Habilidades:</strong></p>
      <div id="habil"> <p>${abilities}</p>
</div>
    </div>
  `;

  card.addEventListener("click", () => {
    card.classList.toggle("open");
  });

  grid.appendChild(card);
}

fetchFlyingPokemons(12);
