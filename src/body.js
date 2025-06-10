import React from 'react';
import './App.css';

const Body = () => {
    return (
        <div className='bem-vindo-container'>
            <h3>🎉 Bem-vindo ao nosso site Pokémon! 🎉</h3>
            <p className='bem-vindo-subtext'>
                Estamos muito felizes em ter você aqui! Este site foi criado para todos os fãs de Pokémon que, como nós, amam explorar e
                conhecer mais sobre esse universo incrível. Navegue, descubra e aproveite o conteúdo especial que preparamos para você.
                Divirta-se e que a sua jornada seja cheia de aventuras! 🌟
            </p>
        <img src={`${process.env.PUBLIC_URL}/Pokemons.png`} alt="pokemon" className="bem-vindo-img" />

        </div>
    );
};

export default Body;
