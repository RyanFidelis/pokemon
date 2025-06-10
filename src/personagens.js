import React, { useState, useEffect } from 'react';
import './App.css';

const charactersData = [
  { id: '1', name: 'Ash Ketchum', image: '/ash.png' },
  { id: '2', name: 'Misty', image: '/misty.png' },
  { id: '3', name: 'Brock', image: '/brock.png' },
  { id: '4', name: 'Gary Oak', image: '/gary.png' },
  { id: '5', name: 'May', image: '/may.png' },
  { id: '6', name: 'Dawn', image: '/dawn.png' },
  { id: '7', name: 'Serena', image: '/serena.png' },
  { id: '8', name: 'Clemont', image: '/clemont.png' },
  { id: '9', name: 'Iris', image: '/iris.png' },
  { id: '10', name: 'Tracy', image: '/tracy.png' },
  { id: '11', name: 'Paul', image: '/paul.png' },
  { id: '12', name: 'Cynthia', image: '/cynthia.png' },
  { id: '13', name: 'Professor Oak', image: '/professor_oak.png' },
  { id: '14', name: 'Professor Sycamore', image: '/professor_sycamore.png' },
  { id: '15', name: 'Jesse', image: '/jesse.png' },
  { id: '16', name: 'James', image: '/james.png' },
  { id: '17', name: 'Blaine', image: '/blaine.png' },
  { id: '18', name: 'Flint', image: '/flint.png' },
  { id: '19', name: 'Hop', image: '/hop.png' },
  { id: '20', name: 'Red', image: '/red.png' },
  { id: '21', name: 'Blue', image: '/blue.png' },
  { id: '22', name: 'Silver', image: '/silver.png' },
  { id: '23', name: 'Maylene', image: '/maylene.png' },
  { id: '24', name: 'Lyra', image: '/lyra.png' },
  { id: '25', name: 'Cheryl', image: '/cheryl.png' },
  { id: '26', name: 'N', image: '/n.png' },
  { id: '27', name: 'Brawly', image: '/brawly.png' },
  { id: '28', name: 'Gardenia', image: '/gardenia.png' },
  { id: '29', name: 'Flannery', image: '/flannery.png' },
  { id: '30', name: 'Elesa', image: '/elesa.png' },
  { id: '31', name: 'Korrina', image: '/korrina.png' },
];

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 350) {
        setNumColumns(1);
      } else if (screenWidth < 500) {
        setNumColumns(2);
      } else if (screenWidth < 750) {
        setNumColumns(3);
      } else if (screenWidth < 1000) {
        setNumColumns(4);
      } else {
        setNumColumns(5);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const filteredCharacters = charactersData.filter(character =>
    character.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columnWidth = `${100 / numColumns}%`;

  return (
    <div className="container-personagens">
      <h1>Personagens</h1>
      <div className="buscaContainer-personagens">
        <input
          className="pesquisa"
          type="text"
          placeholder="Buscar personagem..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="gridContainer-personagens">
        {filteredCharacters.map((item) => (
          <div
            key={item.id}
            className="item-personagens"
            style={{ width: columnWidth }}
          >
            <div className="imageContainer-personagens">
              <img src={item.image} alt={item.name} className="image-personagens" />
            </div>
            <p className="nomes-personagens">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
