import React, { useState, useEffect } from 'react';

const imagensTipos = {
  normal: 'https://img.quizur.com/f/img64390f0dc68122.91415002.png?lastEdited=1681461007',
  fire: 'https://sounintendista.com.br/wp-content/uploads/2024/03/Top-5-revelado-o-inicial-de-fogo-que-domina-a-franquia-Pokemon-1140x641.jpg.webp',
  electric: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiy4NTH9k1XA32N4b4v5kJeCqhrqto4L6QyUY9vDZtf0oB0NoIA-79IWGTUeerJbBiR7j7jy-SuWhG9MhcEZejaGIYYTfoaBBvVFRo3FH8ELErBHVq5jOn0So7SedsleMedZxyGlzntGLMC/s16000-rw/pokemon-tipo-eletrico.png',
  water: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsRODByum20Qwlc7UEXHL_0LZzd0VCJylOVQ&s',
  grass: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOY5gFwJTFjbYOHeyy6-JVsV0KIQ_h3sl5Fw&s',
  psychic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReL2ooloLqv1vRLHUZ6-jJo3WWGItGFUX5HA&s',
  fighting: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrr_9spksWYZiHVVvnfMfjAfcFzSii9xxTCg&s',
  ice: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTi5g20aFMtadYamkSPXeqWE9BOPr3ZSXLkKg&s',
  poison: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8JwGQrsB2yIWMxwyLlfb8R6MRdeYlmGm7sBuT_F7DcMGb-mIMsSTLMvBhmEY8pqKspBgj6CY2XwV9m0wiMJGGdHPmHnt0FzOIIHSKNDfMKWyYA6X6l0A2JAOfOpmDgOLvsXoxIwodueQs/w1200-h675-p-k-no-nu/capa-venenoso.png',
  bug: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHoKZgdZyWiMPkqKnZrKtq__dOUC6xW36jFQ&s',
  ghost: 'https://pt.quizur.com/_image?href=https://img.quizur.com/f/img63dd0ca5520fa0.07429692.jpg?lastEdited=1675431080&w=600&h=600&f=webp',
  dragon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR57c8dsKURBSHrjb9etisbEhUHQfmRK_c7jA&s',
  dark: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2W21CHQgs99hTG_LLr5h7UYudaaR-KRsWXA&s',
  steel: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpk-9dPqSdbj3xLuRB67DM55c8nPKIAx2Lpw&s',
  fairy: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwwQmCxT-vOPKc5qzfePYGDKLHBHiJhBZvxg&s',
  flying: 'https://1.bp.blogspot.com/-5CYmRmeZ9lU/YF56TYa6f1I/AAAAAAAARrg/yQivVqEfkVcUlOhn0bJv9KIcnVceywJ7gCLcBGAsYHQ/s16000/capa-voador.png',
  ground: 'https://1.bp.blogspot.com/-txY30VfqDnk/YF6BcYLyrbI/AAAAAAAARr4/yt7ZF-zgEaQyhPwnW3HWVvmlO1c3CLdPACLcBGAsYHQ/s776/capa-terrestre.png',
  rock: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjnm9LeN3X-0IVvb8OFr05og3dIA42Nt5BnFCAP-Q0Ek3p8j4OyNLyBcCPa3IQ_FVQ0N1iQH0AZ0twDAFO7RP0RWBXWPJHRJ_cDLFKViLje22mdiLZlpL1kt2ImSDarBzbvId1fp0otkCIT/s16000-rw/capa-pedra.png',
};

const fundosTipos = {
  normal: '#dcdcdc',
  fire: '#f8b7b5',
  electric: '#ffed8d',
  water: '#9dd9f0',
  grass: '#b7f6b2',
  psychic: '#f7bbf5',
  fighting: '#f2baba',
  ice: '#d4f7f7',
  poison: '#e0c8f7',
  bug: '#d4e057',
  ghost: '#b3b3cc',
  dragon: '#f4b0b0',
  dark: '#333',
  steel: '#b8b8b8',
  fairy: '#f0c8ff',
  flying: '#a8d1f3',
  ground: '#d9b89a',
  rock: '#b5b573',
};

const App = () => {
  const [movimentos, setMovimentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);

  useEffect(() => {
    const fetchMovimentos = async () => {
      try {
        setCarregando(true);
        const response = await fetch('https://pokeapi.co/api/v2/move?limit=50');
        const data = await response.json();

        const detalhesMovimentos = await Promise.all(
          data.results.map(async (movimento) => {
            const resp = await fetch(movimento.url);
            const detalhes = await resp.json();
            return {
              nome: movimento.name,
              tipo: detalhes.type.name,
              efeito:
                detalhes.effect_entries.find((e) => e.language.name === 'en')?.effect ||
                'Descrição não disponível',
              poder: detalhes.power || 'N/A',
              ataque: detalhes.accuracy || 'N/A',
              precisao: detalhes.pp || 'N/A',
              imagemUrl: imagensTipos[detalhes.type.name] || '',
              fundo: fundosTipos[detalhes.type.name] || '#fff',
            };
          })
        );

        setMovimentos(detalhesMovimentos);
      } catch (error) {
        console.error('Erro ao carregar movimentos:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchMovimentos();
  }, []);

  const abrirModal = (movimento) => {
    setMovimentoSelecionado(movimento);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setMovimentoSelecionado(null);
  };

  if (carregando) return <p>Carregando movimentos...</p>;

  return (
    <div className="container-ataques">
      <div className="lista-ataques">
        {movimentos.map((movimento) => (
          <div
            key={movimento.nome}
            className="movimento-container"
            style={{ backgroundColor: movimento.fundo, cursor: 'pointer' }}
            onClick={() => abrirModal(movimento)}
          >
            {movimento.imagemUrl && (
              <img
                src={movimento.imagemUrl}
                alt={movimento.tipo}
                style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 8 }}
              />
            )}
            <div className="movimento-texto">{movimento.nome}</div>
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
        ))}
      </div>

      {modalVisivel && movimentoSelecionado && (
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
            <h2>{movimentoSelecionado.nome}</h2>
            {movimentoSelecionado.imagemUrl && (
              <img
                src={movimentoSelecionado.imagemUrl}
                alt={movimentoSelecionado.nome}
                style={{ width: 150, height: 150, objectFit: 'contain', marginBottom: 10 }}
              />
            )}
            <p className="efeito-texto">
              <strong>Efeito:</strong> {movimentoSelecionado.efeito}
            </p>
            <p className="efeito-texto">
              <strong>Tipo:</strong> {movimentoSelecionado.tipo}
            </p>
            <p className="efeito-texto">
              <strong>Poder:</strong> {movimentoSelecionado.poder}
            </p>
            <p className="efeito-texto">
              <strong>Precisão:</strong> {movimentoSelecionado.precisao}
            </p>
            <p className="efeito-texto">
              <strong>Ataque:</strong> {movimentoSelecionado.ataque}
            </p>
            <button
              onClick={fecharModal}
              style={{ marginTop: 20, padding: '10px 20px', cursor: 'pointer', borderRadius: 5 }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
