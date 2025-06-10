import React, { useState } from 'react';
import './App.css';

const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#F0B6BC"
};

const getTypeColor = (types) => {
  const primaryType = types[0]?.type.name;
  return typeColors[primaryType] || "#F0F0F0";
};

function App() {
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [pokemonName1, setPokemonName1] = useState('');
  const [pokemonName2, setPokemonName2] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showModalNotFound, setShowModalNotFound] = useState(false);

  const fetchPokemonData = async (pokemonName) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar dados do Pokémon:", error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (pokemonName1 && pokemonName2) {
      const pokemonData1 = await fetchPokemonData(pokemonName1);
      const pokemonData2 = await fetchPokemonData(pokemonName2);

      if (!pokemonData1 || !pokemonData2) {
        setShowModalNotFound(true);
      } else {
        setPokemon1(pokemonData1);
        setPokemon2(pokemonData2);
        setShowModal(false);
        setShowModalNotFound(false);
      }
    } else {
      setShowModal(true);
    }
  };

  const statsComparison = (stat1, stat2) => {
    const maxStat = Math.max(stat1, stat2);
    return {
      stat1: (stat1 / maxStat) * 100,
      stat2: (stat2 / maxStat) * 100,
      stat1Value: stat1,
      stat2Value: stat2
    };
  };

  const attackComparison = statsComparison(pokemon1?.stats[1].base_stat, pokemon2?.stats[1].base_stat);
  const defenseComparison = statsComparison(pokemon1?.stats[2].base_stat, pokemon2?.stats[2].base_stat);
  const speedComparison = statsComparison(pokemon1?.stats[5].base_stat, pokemon2?.stats[5].base_stat);

  return (
    <div className="App">
      <h1>Comparador de Pokémon</h1>
      <div className="comparador-pesquisa-container">
        <input 
          type="text" 
          placeholder="Nome ou ID do Pokémon 1" 
          value={pokemonName1} 
          onChange={(e) => setPokemonName1(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Nome ou ID do Pokémon 2" 
          value={pokemonName2} 
          onChange={(e) => setPokemonName2(e.target.value)} 
        />
        <button className="comparar-button" onClick={handleSearch}>Comparar</button>
      </div>

      {showModal && (
        <div className="comparador-modal">
          <div className="comparador-modal-content">
            <p>Por favor, preencha os dois campos de Pokémon para realizar a comparação!</p>
            <button onClick={() => setShowModal(false)}>Fechar</button>
          </div>
        </div>
      )}

      {showModalNotFound && (
        <div className="comparador-modal">
          <div className="comparador-modal-content">
            <p>Um ou ambos os Pokémon não foram encontrados. Tente novamente!</p>
            <button onClick={() => setShowModalNotFound(false)}>Fechar</button>
          </div>
        </div>
      )}

      {pokemon1 && pokemon2 && (
        <div className="comparador-container">
          <div className="pokemon-card-comparador" style={{ backgroundColor: getTypeColor(pokemon1.types) }}>
            <h3>{pokemon1.name.toUpperCase()}</h3>
            <img src={pokemon1.sprites.front_default} alt={pokemon1.name} />
            <p>Altura: {pokemon1.height / 10} m</p>
            <p>Peso: {pokemon1.weight / 10} kg</p>
            <p>Tipo: {pokemon1.types.map(type => type.type.name).join(', ')}</p>
          </div>

          <div className="pokemon-card-comparador" style={{ backgroundColor: getTypeColor(pokemon2.types) }}>
            <h3>{pokemon2.name.toUpperCase()}</h3>
            <img src={pokemon2.sprites.front_default} alt={pokemon2.name} />
            <p>Altura: {pokemon2.height / 10} m</p>
            <p>Peso: {pokemon2.weight / 10} kg</p>
            <p>Tipo: {pokemon2.types.map(type => type.type.name).join(', ')}</p>
          </div>
        </div>
      )}

      {pokemon1 && pokemon2 && (
        <div className="comparador-bar">
          <h2>Comparação de Stats</h2>
          <div >
            <p>Ataque</p>
            <div className="bar">
              <div className="bar-1" style={{ width: `${attackComparison.stat1}%`, backgroundColor: '#4CAF50' }}></div>
              <div className="bar-2" style={{ width: `${attackComparison.stat2}%`, backgroundColor: '#FF5722' }}></div>
            </div>
            <div className="stat-values">
              <span>{attackComparison.stat1Value}</span>
              <span>{attackComparison.stat2Value}</span>
            </div>
          </div>
          <div className="stat-bar">
            <p>Defesa</p>
            <div className="bar">
              <div className="bar-1" style={{ width: `${defenseComparison.stat1}%`, backgroundColor: '#4CAF50' }}></div>
              <div className="bar-2" style={{ width: `${defenseComparison.stat2}%`, backgroundColor: '#FF5722' }}></div>
            </div>
            <div className="stat-values">
              <span>{defenseComparison.stat1Value}</span>
              <span>{defenseComparison.stat2Value}</span>
            </div>
          </div>
          <div className="stat-bar">
            <p>Velocidade</p>
            <div className="bar">
              <div className="bar-1" style={{ width: `${speedComparison.stat1}%`, backgroundColor: '#4CAF50' }}></div>
              <div className="bar-2" style={{ width: `${speedComparison.stat2}%`, backgroundColor: '#FF5722' }}></div>
            </div>
            <div className="stat-values">
              <span>{speedComparison.stat1Value}</span>
              <span>{speedComparison.stat2Value}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
