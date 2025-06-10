import React, { useEffect, useState } from 'react';
import './App.css';

const PokemonCard = ({ name, url }) => {
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPokemonDetails = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPokemonData(data);
    } catch (err) {
      console.error("Erro ao buscar dados do Pokémon", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonDetails();
  }, [url]);

  if (loading) return <div>Carregando...</div>;

  if (!pokemonData) return null;

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A77A',
      fire: '#EE8130',
      water: '#6390F0',
      electric: '#F7D02C',
      grass: '#7AC74C',
      ice: '#96D9D6',
      fighting: '#C22E28',
      poison: '#A33EA1',
      ground: '#E2BF65',
      flying: '#A98FF3',
      psychic: '#F95587',
      bug: '#A6B91A',
      rock: '#B6A136',
      ghost: '#735797',
      dragon: '#6F35FC',
      dark: '#705746',
      steel: '#B7B7CE',
      fairy: '#D685AD',
    };
    return typeColors[type] || '#fff';
  };

  return (
    <div className="pokemon-card" style={{ backgroundColor: getTypeColor(pokemonData.types[0].type.name) }}>
      <h2>{pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
      <p>#{pokemonData.id}</p>
      <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
      <p>Altura: {pokemonData.height / 10}m</p>
      <p>Peso: {pokemonData.weight / 10}kg</p>
      <p>Tipos: {pokemonData.types.map(type => type.type.name).join(', ')}</p>
    </div>
  );
};

export default PokemonCard;
