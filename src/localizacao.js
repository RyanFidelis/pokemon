import React, { useEffect, useState } from 'react';
import './App.css';

const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [visibleLocations, setVisibleLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const fetchAllLocations = async () => {
    let allLocations = [];
    let nextPage = 'https://pokeapi.co/api/v2/location/';

    try {
      setLoading(true);
      while (nextPage) {
        const response = await fetch(nextPage);
        const data = await response.json();
        allLocations = [...allLocations, ...data.results];
        nextPage = data.next;
      }

      const detailedLocations = await Promise.all(
        allLocations.map(async (location) => {
          const locationDetails = await fetch(location.url);
          return await locationDetails.json();
        })
      );

      setLocations(detailedLocations);
      setFilteredLocations(detailedLocations);
      setVisibleLocations(detailedLocations.slice(0, 20));
    } catch (error) {
      console.error('Erro ao buscar localizações:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLocations = (text) => {
    setSearchText(text);
    const filtered = locations.filter((location) =>
      location.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLocations(filtered);
    setVisibleLocations(filtered.slice(0, 20));
    setVisibleCount(20);
  };

  const loadMore = () => {
    const newCount = visibleCount + 20;
    setVisibleCount(newCount);
    setVisibleLocations(filteredLocations.slice(0, newCount));
  };

  useEffect(() => {
    fetchAllLocations();
  }, []);

  const openLocationModal = (location) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLocation(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Localizações</h1>

      <input
        className="pesquisa"
        placeholder="Buscar localização..."
        value={searchText}
        onChange={(e) => filterLocations(e.target.value)}
      />

      <div className="listContainer">
        {visibleLocations.map((item) => (
          <div
            key={item.id}
            className="item"
            onClick={() => openLocationModal(item)}
          >
            <div className="infoContainer">
              <p className="nome">{capitalize(item.name)}</p>
              <p className="info">Região: {item.region?.name || 'Desconhecida'}</p>
              <p className="info">Áreas: {item.areas.length}</p>
              <p className="info">Jogos Relacionados: {item.game_indices.length}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleLocations.length < filteredLocations.length && (
        <div className="carregarContainer">
          <button className="carregarMais" onClick={loadMore}>
            Carregar mais
          </button>
        </div>
      )}

      {modalVisible && selectedLocation && (
        <div className="modalOverlay-loc" onClick={closeModal}>
          <div className="modalContent-loc" onClick={(e) => e.stopPropagation()}>
            <h2 className="modalTitulo-loc">Detalhes da Localização</h2>
            <p><strong>Nome:</strong> {capitalize(selectedLocation.name)}</p>
            <p><strong>Região:</strong> {selectedLocation.region?.name || 'Desconhecida'}</p>
            <p><strong>Áreas:</strong> {selectedLocation.areas.length}</p>
            <p><strong>Jogos Relacionados:</strong> {selectedLocation.game_indices.length}</p>

            <p><strong>Pokémons Encontrados:</strong></p>
            {selectedLocation.pokemon_encounters?.length ? (
              <ul>
                {selectedLocation.pokemon_encounters.map((encounter, index) => (
                  <li key={index}>{encounter.pokemon.name}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum Pokémon encontrado.</p>
            )}

            <p><strong>Itens Encontrados:</strong></p>
            {selectedLocation.items?.length ? (
              <ul>
                {selectedLocation.items.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <p>Nenhum item encontrado.</p>
            )}

            <button className="fecharModal-loc" onClick={closeModal}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsList;
