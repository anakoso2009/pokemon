const grid = document.getElementById("grid");

// ================== CONFIGURAÇÕES ==================
const ONLY_TYPE = "electric"; // tipo desejado
const MAX_POKEMON = 12;      // quantidade de pokémon

// ================== CORES POR TIPO =================
const typeColors = {
  electric: "#F7D02C",
  flying: "#A98FF3",
  dragon: "#6F35FC",
  dark: "#705746",
  fire: "#EE8130",
  water: "#6390F0",
  grass: "#7AC74C",
  psychic: "#F95587",
  ice: "#96D9D6",
  rock: "#B6A136",
  ghost: "#735797",
  fairy: "#D685AD",
  steel: "#B7B7CE",
  bug: "#A6B91A",
  poison: "#A33EA1",
  ground: "#E2BF65",
  fighting: "#C22E28",
  normal: "#A8A77A"
};

// ================== BUSCAR POKÉMON =================
async function fetchAndCreateCard(pokemon) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

    const data = await res.json();
    createCardHTML(data);

  } catch (error) {
    console.error("Erro ao buscar Pokémon:", error);
  }
}

// ================== BUSCAR POR TIPO =================
async function fetchPokemonByType(type, limit) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!res.ok) throw new Error("Erro ao buscar tipo");

    const data = await res.json();

    const pokemons = data.pokemon
      .slice(0, limit)
      .map(p => p.pokemon.name);

    await Promise.all(pokemons.map(name => fetchAndCreateCard(name)));

  } catch (error) {
    console.error("Erro ao buscar Pokémon por tipo:", error);
  }
}

// ================== CRIAR CARD ==================
function createCardHTML(data) {
  const name = data.name;
  const id = data.id.toString().padStart(3, "0");

  const imgUrl =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default;

  const height = data.height / 10;
  const weight = data.weight / 10;

  const abilities = data.abilities
    .map(a => a.ability.name)
    .slice(0, 2)
    .join(", ");

  const stats = {};
  data.stats.forEach(s => (stats[s.stat.name] = s.base_stat));

  const atk = stats.attack || 0;
  const def = stats.defense || 0;

  const mainType = data.types[0].type.name;
  const color = typeColors[mainType] || "#777";

  const typesHtml = data.types
    .map(t => {
      const tName = t.type.name;
      const tColor = typeColors[tName] || "#777";
      return `<span class="type-badge" style="background-color:${tColor}">${tName}</span>`;
    })
    .join("");

  const card = document.createElement("div");
  card.classList.add("pokemon-card");

  card.innerHTML = `
    <div class="card-header" style="background:linear-gradient(to bottom, ${color}, white);">
      <img src="${imgUrl}" alt="${name}" class="poke-img">
    </div>

    <div class="card-body">
      <span class="poke-id">#${id}</span>
      <h2 class="poke-name">${name}</h2>

      <div class="types">${typesHtml}</div>

      <div class="info-row">
        <div class="info-box">
          <h4>Altura</h4>
          <p>${height} m</p>
        </div>
        <div class="info-box">
          <h4>Peso</h4>
          <p>${weight} kg</p>
        </div>
      </div>

      <div class="abilities">
        <strong>Habilidades:</strong> ${abilities}
      </div>

      <div class="stats-wrapper">
        <div class="stat-line">
          <span class="stat-label">ATK</span>
          <span class="stat-value">${atk}</span>
          <div class="progress-bg">
            <div class="progress-fill" style="width:${Math.min(
              atk / 2,
              100
            )}%; background-color:${color};"></div>
          </div>
        </div>

        <div class="stat-line">
          <span class="stat-label">DEF</span>
          <span class="stat-value">${def}</span>
          <div class="progress-bg">
            <div class="progress-fill" style="width:${Math.min(
              def / 2,
              100
            )}%; background-color:${color};"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  grid.prepend(card);
}

// ================== INICIALIZAR ==================
(async function init() {
  if (!grid) {
    console.error("Elemento #grid não encontrado");
    return;
  }

  grid.innerHTML = "";
  await fetchPokemonByType(ONLY_TYPE, MAX_POKEMON);
})();
