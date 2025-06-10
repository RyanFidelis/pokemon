import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

const Header = () => (
    <div className="titulo-container">
        <h1 className="titulo">Pokémon</h1>
        <div className="container-links">
            <Link className="pages-link" to="/body">HOME</Link>
            <Link className="pages-link" to="/pokedex">POKEDEX</Link>
            <Link className="pages-link" to="/ataques">ATAQUES</Link>
            <Link className="pages-link" to="/itens">ITENS</Link>
            <Link className="pages-link" to="/personagens">PERSONAGENS</Link>
            <Link className="pages-link" to="/lideres">LÍDERES DE GINÁSIO</Link>
            <Link className="pages-link" to="/localizacao">LOCALIZAÇÕES</Link>
            <Link className="pages-link" to="/comparador">COMPARADOR</Link>
            <Link className="pages-link" to="/battle_simulator">SIMULADOR DE BATALHAS</Link>
            <Link className="pages-link" to="/pokemonGames">JOGOS</Link>
            <Link className="pages-link" to="/historia">HISTÓRIA</Link>
            
        </div>
    </div>
);

export default Header;
