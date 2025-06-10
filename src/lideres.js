import React, { useState, useEffect } from 'react';
import './App.css';

const gymLeaders = [
  { id: '1', name: 'Brock', city: 'Cidade de Pewter', type: 'Pedra', badge: 'Insígnia da Rocha', image: '/brock.png' },
  { id: '2', name: 'Misty', city: 'Cidade de Cerulean', type: 'Água', badge: 'Insígnia da Água', image: '/misty.png' },
  { id: '3', name: 'St. Surge', city: 'Cidade de Vermilion', type: 'Elétrico', badge: 'Insígnia do Trovão', image: '/stsurge.png' },
  { id: '4', name: 'Erika', city: 'Cidade de Celadon', type: 'Planta', badge: 'Insígnia do Arco-Íris', image: '/erika.png' },
  { id: '5', name: 'Koga', city: 'Cidade de Fuchsia', type: 'Venenoso', badge: 'Insígnia da Alma', image: '/koga.png' },
  { id: '6', name: 'Sabrina', city: 'Cidade de Saffron', type: 'Psíquico', badge: 'Insígnia do Pântano', image: '/sabrina.png' },
  { id: '7', name: 'Blaine', city: 'Ilha Cinnabar', type: 'Fogo', badge: 'Insígnia do Vulcão', image: '/blaine.png' },
  { id: '8', name: 'Giovanni', city: 'Cidade de Viridian', type: 'Terra', badge: 'Insígnia da Terra', image: '/giovanni.png' },
  { id: '9', name: 'Morty', city: 'Cidade de Ecruteak', type: 'Fantasma', badge: 'Insígnia da Névoa', image: '/morty.png' },
  { id: '10', name: 'Chuck', city: 'Cidade de Olivine', type: 'Lutador', badge: 'Insígnia da Força', image: '/chuck.png' },
  { id: '11', name: 'Jasmine', city: 'Cidade de Olivine', type: 'Metal', badge: 'Insígnia Mineral', image: '/jasmine.png' },
  { id: '12', name: 'Pryce', city: 'Cidade de Mahogany', type: 'Gelo', badge: 'Insígnia da Geada', image: '/pryce.png' },
  { id: '13', name: 'Clair', city: 'Cidade de Blackthorn', type: 'Dragão', badge: 'Insígnia do Dragão', image: '/clair.png' },
  { id: '14', name: 'Roxanne', city: 'Cidade de Rustboro', type: 'Pedra', badge: 'Insígnia da Rocha', image: '/roxanne.png' },
  { id: '15', name: 'Brawly', city: 'Cidade de Dewford', type: 'Lutador', badge: 'Insígnia do Punho', image: '/brawly.png' },
  { id: '16', name: 'Wattson', city: 'Cidade de Mauville', type: 'Elétrico', badge: 'Insígnia Dínamo', image: '/wattson.png' },
  { id: '17', name: 'Flannery', city: 'Cidade de Lavaridge', type: 'Fogo', badge: 'Insígnia Calor', image: '/flannery.png' },
  { id: '18', name: 'Norman', city: 'Cidade de Petalburg', type: 'Normal', badge: 'Insígnia Balanço', image: '/norman.png' },
  { id: '19', name: 'Winona', city: 'Cidade de Fortree', type: 'Voador', badge: 'Insígnia Pena', image: '/winona.png' },
  { id: '20', name: 'Tate & Liza', city: 'Cidade de Mossdeep', type: 'Psíquico', badge: 'Insígnia Mente', image: '/tate_liza.png' },
  { id: '21', name: 'Falkner', city: 'Cidade de Violet', type: 'Voador', badge: 'Insígnia Zephyr', image: '/falkner.png' },
  { id: '22', name: 'Bugsy', city: 'Cidade de Azaléia', type: 'Inseto', badge: 'Insígnia Colmeia', image: '/bugsy.png' },
  { id: '23', name: 'Whitney', city: 'Cidade de Goldenrod', type: 'Normal', badge: 'Insígnia Planície', image: '/whitney.png' },
];

const typeColors = {
  água: '#6390F0',
  elétrico: '#F7D02C',
  planta: '#7AC74C',
  venenoso: '#A33EA1',
  psíquico: '#F95587',
  fogo: '#EE8130',
  terra: '#E2BF65',
  voador: '#A98FF3',
  inseto: '#A6B91A',
  normal: '#A8A77A',
  fantasma: '#735797',
  lutador: '#C22E28',
  metal: '#D1D1E0',
  gelo: '#B7B7CE',
  dragão: '#6F35FC',
  pedra: '#B6A136',
};

function App() {
  const [selectedType, setSelectedType] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 500) setColumns(1);
      else if (width < 750) setColumns(2);
      else if (width < 1000) setColumns(3);
      else if (width < 1250) setColumns(4);
      else setColumns(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredLeaders = gymLeaders.filter(
    leader =>
      (selectedType === 'Todos' || leader.type === selectedType) &&
      leader.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Líderes de Ginásio</h1>
      <div className="filterContainer">
        <input
          type="text"
          placeholder="Buscar por nome"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pesquisa"
        />
        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="filtro"
        >
          <option value="Todos">Todos</option>
          {Object.keys(typeColors).map((type) => (
            <option key={type} value={capitalize(type)}>{capitalize(type)}</option>
          ))}
        </select>
      </div>
      <div className="listContainer" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {filteredLeaders.map(item => {
          const bg = typeColors[item.type.toLowerCase()] || '#f9f9f9';
          return (
            <div key={item.id} className="item" style={{ backgroundColor: bg }}>
              <div className="imageContainer">
                <img src={item.image} alt={item.name} className="image" />
              </div>
              <div className="infoContainer">
                <p className="nome">{item.name}</p>
                <p className="info">{item.city}</p>
                <p className="info">{item.type}</p>
                <p className="info">{item.badge}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default App;
