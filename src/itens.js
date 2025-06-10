import React, { useState, useEffect } from 'react';
import './App.css';

const Itens = () => {
  const [itens, setItens] = useState([]);
  const [filteredItens, setFilteredItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(50);

  // Estado para modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(null);

  const fetchItemDetails = async (url) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return {
        name: data.name,
        category: data.category.name,
        imageUrl: data.sprites.default,
        description: data.flavor_text_entries.find(entry => entry.language.name === 'en')?.text || 'Descrição não disponível',
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes do item:', error);
      return null;
    }
  };

  const fetchItens = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/item?limit=1400');
      const data = await response.json();
      const itensWithDetails = await Promise.all(
        data.results.map(async (item) => {
          const details = await fetchItemDetails(item.url);
          return details;
        })
      );
      const validItens = itensWithDetails.filter(Boolean);
      setItens(validItens);
      setFilteredItens(validItens);

      const uniqueCategories = [...new Set(validItens.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItens();
  }, []);

  useEffect(() => {
    filterItens();
  }, [searchTerm, selectedCategory, itens]);

  const filterItens = () => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = itens.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(lowerCaseSearchTerm);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredItens(filtered);
    setVisibleCount(50);
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 50);
  };

  const abrirModal = (item) => {
    setItemSelecionado(item);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setItemSelecionado(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando itens...</p>
      </div>
    );
  }

  return (
    <div className="container-itens">
      <h1>Itens de Pokémon</h1>

      <div className="filtros-container">
        <input
          type="text"
          placeholder="Pesquisar item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pesquisa"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filtro"
        >
          <option value="all">Todas as Categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="lista-itens">
        {filteredItens.slice(0, visibleCount).map((item) => (
          <div
            key={item.name}
            className="item-container"
            style={{ cursor: 'pointer' }}
            onClick={() => abrirModal(item)}
          >
            <img src={item.imageUrl} alt={item.name} className="item-imagem" />
            <div>
              <h2 className="item-nome">{item.name}</h2>
              <div
                style={{
                  fontSize: 14,
                  color: 'rgba(0,0,0,0.4)',
                  marginTop: 4,
                  fontStyle: 'italic',
                }}
              >
                saiba mais
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredItens.length && (
        <button onClick={handleLoadMore} className="carregarMais">
          Carregar Mais
        </button>
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
            <h2>{itemSelecionado.name}</h2>
            {itemSelecionado.imageUrl && (
              <img
                src={itemSelecionado.imageUrl}
                alt={itemSelecionado.name}
                style={{ width: 150, height: 150, objectFit: 'contain', marginBottom: 10 }}
              />
            )}
            <p className="efeito-texto">
              <strong>Categoria:</strong> {itemSelecionado.category}
            </p>
            <p className="efeito-texto" style={{ marginTop: 10 }}>
              {itemSelecionado.description}
            </p>
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

export default Itens;
