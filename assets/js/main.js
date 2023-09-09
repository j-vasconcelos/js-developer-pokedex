const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10;
let offset = 0;


function loadPokemonItens(offset, limit) {
    pokeApi.getAll(offset, limit).then((pokemons = []) => {
        const html = pokemons.map((pokemon) => `
            <li class="pokemon ${pokemon.type}" onClick="detailPokemonPopup(${pokemon.id})">
                <span class="number">#${pokemon.id.toString().padStart(3, "0")}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>

                    <img src="${pokemon.photo}"
                        alt="${pokemon.name}">
                </div>
            </li>
        `).join('')
        pokemonList.innerHTML += html
    })
}

function detailPokemonPopup(id) {
    pokeApi.getDetail(id).then((pokemonDetail) => {

        const types = pokemonDetail.types.map((typeSlot) => typeSlot.type.name)
        const [type] = types

        pokemonDetail.type = type

        const html = `
            <section id="popup">
                <div class="detailPokemon ${pokemonDetail.type}">
                    <header>
                        <span id="close" onClick="hiddenPopup()">X</span>
                        <span class="number">#${pokemonDetail.id.toString().padStart(3, "0")}</span>
                    </header>

                    <h1>${pokemonDetail.name}</h1>

                    <img src="${pokemonDetail.sprites.other.dream_world.front_default}"
                        alt="${pokemonDetail.name}">

                    <div class="data">
                        <h4>Base Stats</h4>

                        <div class="stat-bar">
                            <p>Height: ${(pokemonDetail.height / 10).toFixed(2)}m</p>
                            <p>Weight: ${(pokemonDetail.weight / 10)}kg</p>
                        </div>

                        ${pokemonDetail.stats.map((name_stats) => `<p>${name_stats.stat.name}</p>
                                                                <div class="hability">
                                                                    <p class="stats ${pokemonDetail.type}" style="width: ${name_stats.base_stat * .40}%;">${name_stats.base_stat}</p>
                                                                </div>`).join('')}
                    </div>
                </div>
            </section>
        `
        pokemonList.innerHTML += html
    })


}

loadPokemonItens(offset, limit)

function loadMore() {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
}

loadMoreButton.addEventListener('click', () => loadMore())

function hiddenPopup() {
    const popup = document.getElementById('popup')
    popup.parentElement.removeChild(popup)
}