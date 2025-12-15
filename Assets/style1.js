const ONLY_TYPE = "electric";
  const MAX_POKEMON = 12;

  const typeColors = {
    electric: "#F7D02C"
  };

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    const response = await fetch(`https://pokeapi.co/api/v2/type/${ONLY_TYPE}`);
    const data = await response.json();

    let count = 0;

    for (const item of data.pokemon) {
      if (count >= MAX_POKEMON) break;

      const pokemonData = await fetchPokemon(item.pokemon.name);

      // ❌ ignora se tiver mais de um tipo
      if (pokemonData.types.length > 1) continue;

      createCard(pokemonData);
      count++;
    }
  }

  async function fetchPokemon(name) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    return res.json();
  }

  function createCard(data) {
    const grid = document.getElementById("grid");

    const name = data.name;
    const id = String(data.id).padStart(3, "0");
    const img = data.sprites.other["official-artwork"].front_default;
    const type = data.types[0].type.name;
    const color = typeColors[type];

    // 📏 Altura inteligente
    const heightMeters = data.height / 10;
    const heightText =
      heightMeters < 1
        ? `${heightMeters * 100} cm`
        : `${heightMeters} m`;

    const weightKg = data.weight / 10;

    const atk = data.stats.find(s => s.stat.name === "attack").base_stat;
    const def = data.stats.find(s => s.stat.name === "defense").base_stat;

    const card = document.createElement("div");
    card.className = "pokemon-card";

    card.innerHTML = `
      <div class="card-header" style="background: linear-gradient(${color}, white);">
        <img class="poke-img" src="${img}" alt="${name}">
      </div>

      <div class="card-body">
        <span class="poke-id">#${id}</span>
        <h2 class="poke-name">${name}</h2>

        <span class="type-badge">${type}</span>

        <div class="info-row">
          <div class="info-box">
            <strong>Altura</strong>
            <div>${heightText}</div>
          </div>
          <div class="info-box">
            <strong>Peso</strong>
            <div>${weightKg} kg</div>
          </div>
        </div>

        <div class="stat-line">
          Ataque: ${atk}
          <div class="progress-bg">
            <div class="progress-fill" style="width:${atk / 2}%; background:${color}"></div>
          </div>
        </div>

        <div class="stat-line">
          Defesa: ${def}
          <div class="progress-bg">
            <div class="progress-fill" style="width:${def / 2}%; background:${color}"></div>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  }