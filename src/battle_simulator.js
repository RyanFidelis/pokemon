import React, { useState } from 'react';
import './App.css';

const SimuladorDeBatalha = () => {
  const [pokemon1, setPokemon1] = useState('');
  const [pokemon2, setPokemon2] = useState('');
  const [pokemonData1, setPokemonData1] = useState(null);
  const [pokemonData2, setPokemonData2] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [pokemon1HP, setPokemon1HP] = useState(0);
  const [pokemon2HP, setPokemon2HP] = useState(0);
  const [pokemon1Status, setPokemon1Status] = useState('');
  const [pokemon2Status, setPokemon2Status] = useState('');
  const [modal, setModal] = useState({ show: false, message: '' }); 

  const fetchPokemonData = async (name, level = 50) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) throw new Error('Pokémon não encontrado');
      const data = await response.json();
      data.level = level;
      return data;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  };

  const handleFetchPokemon = async () => {
    if (!pokemon1 || !pokemon2) {
      setModal({ show: true, message: "Preencha os campos para os dois Pokémon!" });
      return;
    }

    const data1 = await fetchPokemonData(pokemon1, 50);
    const data2 = await fetchPokemonData(pokemon2, 50);

    if (data1 && data2) {
      setPokemonData1(data1);
      setPokemonData2(data2);
      setPokemon1HP(data1.stats[0]?.base_stat || 0); 
      setPokemon2HP(data2.stats[0]?.base_stat || 0); 
      setBattleLog([]);
      setPokemon1Status('');
      setPokemon2Status('');
    } else {
      setModal({ show: true, message: "Um ou ambos os Pokémon não foram encontrados!" });
    }
  };

  const calculateDamage = (attacker, defender, move) => {
    const attackStat = attacker.stats[1]?.base_stat || 0;
    const defenseStat = defender.stats[2]?.base_stat || 0;
    const basePower = move.power || 50;
    const attackerLevel = attacker.level || 50;
    const typeEffectiveness = calculateTypeEffectiveness(move, defender);
    const randomFactor = Math.random() * (1.2 - 0.8) + 0.8;

    return Math.floor((((2 * attackerLevel) / 5 + 2) * basePower * (attackStat / defenseStat) / 50 + 2) * randomFactor * typeEffectiveness);
  };

  const calculateTypeEffectiveness = (move, defender) => {
    const typeAdvantages = {
      normal: [],
      fire: ['grass', 'bug', 'ice', 'steel'],
      water: ['fire', 'ground', 'rock'],
      electric: ['water', 'flying'],
      grass: ['water', 'ground', 'rock'],
      ice: ['grass', 'ground', 'flying', 'dragon'],
      fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
      poison: ['grass', 'fairy'],
      ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
      flying: ['grass', 'fighting', 'bug'],
      psychic: ['fighting', 'poison'],
      bug: ['grass', 'psychic', 'dark'],
      rock: ['fire', 'ice', 'flying', 'bug'],
      ghost: ['psychic', 'ghost'],
      dragon: ['dragon'],
      dark: ['psychic', 'ghost'],
      steel: ['ice', 'rock', 'fairy'],
      fairy: ['fighting', 'dragon', 'dark']
    };

    const moveType = move.type.name;
    const defenderTypes = defender.types.map((typeSlot) => typeSlot.type.name);

    if (defenderTypes.some((type) => typeAdvantages[moveType]?.includes(type))) return 2;
    if (defenderTypes.some((type) => typeAdvantages[type]?.includes(moveType))) return 0.5;
    return 1;
  };

  const simulateBattle = async () => {
    let currentHP1 = pokemon1HP;
    let currentHP2 = pokemon2HP;
    let turn = 1;
    let log = [];

    while (currentHP1 > 0 && currentHP2 > 0) {
      const attacker = turn % 2 !== 0 ? pokemonData1 : pokemonData2;
      const defender = turn % 2 !== 0 ? pokemonData2 : pokemonData1;

      if (!attacker || !defender) {
        log.push('Erro: Dados do Pokémon estão incompletos.');
        break;
      }

      const attackerName = attacker.name?.toUpperCase() || 'Desconhecido';

      const randomMove = await fetch(attacker.moves[Math.floor(Math.random() * attacker.moves.length)].move.url)
        .then((res) => res.json())
        .catch((error) => console.error('Erro ao buscar movimento:', error));

      const damage = calculateDamage(attacker, defender, randomMove);

      if (turn % 2 !== 0) {
        currentHP2 = Math.max(0, currentHP2 - damage);
        log.push(`${attackerName} usou ${randomMove.name}! Causou ${damage} de dano.`);
        if (currentHP2 === 0) {
          log.push(`${defender.name.toUpperCase()} foi derrotado!`);
          setPokemon2Status('Lose');
          setPokemon1Status('Win');
        }
      } else {
        currentHP1 = Math.max(0, currentHP1 - damage);
        log.push(`${attackerName} usou ${randomMove.name}! Causou ${damage} de dano.`);
        if (currentHP1 === 0) {
          log.push(`${defender.name.toUpperCase()} foi derrotado!`);
          setPokemon1Status('Lose');
          setPokemon2Status('Win');
        }
      }

      turn++;
      setPokemon1HP(currentHP1);
      setPokemon2HP(currentHP2);
      setBattleLog([...log]);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleCloseModal = () => {
    setModal({ show: false, message: '' }); 
  };

  return (
    <div className='simulador-container'>
      <h3>⚔️ Simulador de Batalha Pokémon ⚔️</h3>

      <div>
        <input
          type='text'
          placeholder='Nome ou ID do Pokémon 1'
          value={pokemon1}
          onChange={(e) => setPokemon1(e.target.value)}
        />
        <input
          type='text'
          placeholder='Nome ou ID do Pokémon 2'
          value={pokemon2}
          onChange={(e) => setPokemon2(e.target.value)}
        />
        <button className='carregar-batalha' onClick={handleFetchPokemon}>Carregar Pokémon</button>
      </div>

      {pokemonData1 && pokemonData2 && (
        <div className='batalha-area'>
          <div className='pokemon-batalha-container'>
            <div className='pokemon-card-batalha'>
              <h4>{pokemonData1.name?.toUpperCase() || 'Desconhecido'} HP: {pokemon1HP}</h4>
              <div className='hp-bar'>
                <div
                  className='hp-fill'
                  style={{ width: `${(pokemon1HP / pokemonData1.stats[0]?.base_stat) * 100}%` }}
                ></div>
              </div>
              <img src={pokemonData1.sprites.front_default} alt={pokemonData1.name} />
              <p>{pokemon1Status}</p>
            </div>

            <div className='vs'>VS</div>

            <div className='pokemon-card-batalha'>
              <h4>{pokemonData2.name?.toUpperCase() || 'Desconhecido'} HP: {pokemon2HP}</h4>
              <div className='hp-bar'>
                <div
                  className='hp-fill'
                  style={{ width: `${(pokemon2HP / pokemonData2.stats[0]?.base_stat) * 100}%` }}
                ></div>
              </div>
              <img src={pokemonData2.sprites.front_default} alt={pokemonData2.name} />
              <p>{pokemon2Status}</p>
            </div>
          </div>

          <button className='batalha-button' onClick={simulateBattle}>Iniciar Batalha</button>

          <div className='batalha-registro'>
            <h4>Registro de Batalha:</h4>
            {battleLog.map((log, index) => (
              <p key={index}>{log}</p>
            ))}
          </div>
        </div>
      )}

      {modal.show && (
        <div className="modal-batalha">
          <div className="modal-batalha-content">
            <p>{modal.message}</p>
            <button onClick={handleCloseModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimuladorDeBatalha;
