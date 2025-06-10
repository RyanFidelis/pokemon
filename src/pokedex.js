import React, { useEffect, useState } from 'react';
import PokemonCard from './PokemonCard';
import './App.css';

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [pokemonData, setPokemonData] = useState({});
  const [visibleCount, setVisibleCount] = useState(100);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [modalData, setModalData] = useState(null);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1200');
      const data = await response.json();
      setPokemonList(data.results);
      setFilteredPokemon(data.results.slice(0, 100));

      const batchSize = 50;
      const detailedData = [];

      for (let i = 0; i < 100; i += batchSize) {
        const batch = data.results.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(async (pokemon) => {
            const res = await fetchWithRetry(pokemon.url, 3);
            return res ? res.json() : null;
          })
        );

        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            detailedData.push(result.value);
          }
        });
      }

      const pokemonDataMap = {};
      detailedData.forEach((pokemon) => {
        pokemonDataMap[pokemon.name] = {
          height: pokemon.height,
          weight: pokemon.weight,
          id: pokemon.id,
          types: pokemon.types.map((t) => t.type.name),
          image: pokemon.sprites.front_default,
        };
      });

      setPokemonData(pokemonDataMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithRetry = async (url, retries) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.ok) return response;
      } catch (error) {
        if (i === retries - 1) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredPokemon(filtered.slice(0, visibleCount));
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedData = [...filteredPokemon];

    switch (option) {
      case 'alphabetical':
        sortedData.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'weight':
        sortedData.sort(
          (a, b) => (pokemonData[a.name]?.weight || 0) - (pokemonData[b.name]?.weight || 0)
        );
        break;
      case 'height':
        sortedData.sort(
          (a, b) => (pokemonData[a.name]?.height || 0) - (pokemonData[b.name]?.height || 0)
        );
        break;
      case 'reverse-id':
        sortedData.sort((a, b) => {
          const idA = parseInt(a.url.split('/')[6]);
          const idB = parseInt(b.url.split('/')[6]);
          return idB - idA;
        });
        break;
      default:
        sortedData.sort((a, b) => {
          const idA = parseInt(a.url.split('/')[6]);
          const idB = parseInt(b.url.split('/')[6]);
          return idA - idB;
        });
        break;
    }

    setFilteredPokemon(sortedData.slice(0, visibleCount));
  };

  const handleLoadMore = async () => {
    const newVisibleCount = visibleCount + 100;
    setVisibleCount(newVisibleCount);
    setFilteredPokemon(pokemonList.slice(0, newVisibleCount));

    const batchSize = 50;
    const newBatchStart = visibleCount;
    const newBatchEnd = Math.min(newVisibleCount, pokemonList.length);
    const detailedData = [];

    for (let i = newBatchStart; i < newBatchEnd; i += batchSize) {
      const batch = pokemonList.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map(async (pokemon) => {
          const res = await fetchWithRetry(pokemon.url, 3);
          return res ? res.json() : null;
        })
      );

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          detailedData.push(result.value);
        }
      });
    }

    const updatedData = { ...pokemonData };
    detailedData.forEach((pokemon) => {
      updatedData[pokemon.name] = {
        height: pokemon.height,
        weight: pokemon.weight,
        id: pokemon.id,
        types: pokemon.types.map((t) => t.type.name),
        image: pokemon.sprites.front_default,
      };
    });

    setPokemonData(updatedData);
  };

  const abrirModal = async (pokemon) => {
    setItemSelecionado({
      name: pokemon.name,
      imageUrl: pokemonData[pokemon.name]?.image || '',
      id: pokemonData[pokemon.name]?.id,
      height: pokemonData[pokemon.name]?.height,
      weight: pokemonData[pokemon.name]?.weight,
      types: pokemonData[pokemon.name]?.types,
    });
    setModalVisivel(true);

    try {
      const speciesRes = await fetchWithRetry(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`,
        3
      );
      const speciesData = await speciesRes.json();

      const evolutionRes = await fetchWithRetry(speciesData.evolution_chain.url, 3);
      const evolutionData = await evolutionRes.json();

      const description = speciesData.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      )?.flavor_text.replace(/\f/g, ' ') || 'Descrição não disponível';

      // Carregar imagens da linha evolutiva
      const evolutionNames = getEvolutionNames(evolutionData.chain);
      const evolutionImgs = await Promise.all(
        evolutionNames.map(async (name) => {
          try {
            const res = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${name}`, 3);
            const data = await res.json();
            return { name, image: data.sprites.front_default };
          } catch {
            return { name, image: null };
          }
        })
      );

      setModalData({
        description,
        evolutionChain: evolutionData,
        evolutionImages: evolutionImgs,
      });
    } catch (error) {
      console.error('Erro ao buscar descrição ou evolução:', error);
    }
  };

  const fecharModal = () => {
    setItemSelecionado(null);
    setModalData(null);
    setModalVisivel(false);
  };

  const getEvolutionNames = (chain) => {
    const evolutions = [];
    let current = chain;

    while (current) {
      evolutions.push(current.species.name);
      if (current.evolves_to.length > 0) {
        current = current.evolves_to[0];
      } else {
        current = null;
      }
    }
    return evolutions;
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  if (loading) {
    return <div className="loading-container">Carregando pokémons...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-itens">
      <h1>Pokedex</h1>
      <div>
        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pesquisa"
        />
        <select
          id="sort-select"
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
          className="filtro"
        >
          <option value="default">ID (Crescente)</option>
          <option value="reverse-id">ID (Decrescente)</option>
          <option value="alphabetical">Nome (Alfabética)</option>
          <option value="weight">Peso</option>
          <option value="height">Altura</option>
        </select>
      </div>

      <div className="lista-itens" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {filteredPokemon.map((pokemon) => (
          <div
            key={pokemon.name}
            className="item-container"
            style={{
              cursor: 'pointer',
              width: 150,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              padding: '10px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              transition: 'transform 0.2s',
              ':hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }
            }}
            onClick={() => abrirModal(pokemon)}
          >
            <PokemonCard
              name={pokemon.name}
              url={pokemon.url}
              pokemonData={pokemonData[pokemon.name]}
            />
            <div
              style={{
                fontSize: 14,
                color: 'rgba(0,0,0,0.4)',
                fontStyle: 'italic',
                userSelect: 'none',
                marginTop: '8px'
              }}
            >
              saiba mais
            </div>
          </div>
        ))}
      </div>

      {visibleCount < pokemonList.length && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <button onClick={handleLoadMore} className="carregarMais">
            Carregar Mais
          </button>
        </div>
      )}

      {modalVisivel && itemSelecionado && (
        <div
          onClick={fecharModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 20,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}
          >
            <h2>{itemSelecionado.name.charAt(0).toUpperCase() + itemSelecionado.name.slice(1)}</h2>
            {itemSelecionado.imageUrl && (
              <img
                src={itemSelecionado.imageUrl}
                alt={itemSelecionado.name}
                style={{ width: 150, height: 150, objectFit: 'contain', marginBottom: 10 }}
              />
            )}

            <p style={{ margin: 5 }}>
              <strong>ID:</strong> {itemSelecionado.id}
            </p>
            <p style={{ margin: 5 }}>
              <strong>Altura:</strong> {itemSelecionado.height}
            </p>
            <p style={{ margin: 5 }}>
              <strong>Peso:</strong> {itemSelecionado.weight}
            </p>
            <p style={{ margin: 5 }}>
              <strong>Tipos:</strong>{' '}
              {itemSelecionado.types ? itemSelecionado.types.join(', ') : 'Desconhecido'}
            </p>

            {modalData?.description && (
              <p style={{ marginTop: 10, fontStyle: 'italic' }}>{modalData.description}</p>
            )}

            
            {modalData?.evolutionImages && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 10,
                  marginTop: 15,
                  flexWrap: 'wrap',
                }}
              >
                {modalData.evolutionImages.map(({ name, image }) => (
                  <div key={name} style={{ textAlign: 'center' }}>
                    {image ? (
                      <img
                        src={image}
                        alt={name}
                        style={{ width: 70, height: 70, objectFit: 'contain' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 70,
                          height: 70,
                          backgroundColor: '#eee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#888',
                        }}
                      >
                        ?
                      </div>
                    )}
                    <div
                      style={{
                        marginTop: 5,
                        fontSize: 12,
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                      }}
                    >
                      {name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={fecharModal}
              style={{
                marginTop: 20,
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: 5,
                border: 'none',
                backgroundColor: '#007bff',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pokedex;