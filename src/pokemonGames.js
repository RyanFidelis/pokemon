import React, { useState } from 'react';
import './App.css';

const jogos = [
    {
        nome: "Pokémon Fire Red",
        link: "https://www.emulatorgames.net/roms/gameboy-advance/pokemon-fire-red-version-v11/",
        descricao: "Reviva a aventura de Red e explore a famosa região de Kanto com o remake de Pokémon Fire Red.",
        imagem: "https://images.emulatorgames.net/gameboy-advance/pokemon-fire-red-version-v1-1.webp"
    },
    {
        nome: "Pokémon Emerald",
        link: "https://www.emulatorgames.net/roms/gameboy-advance/pokemon-emerald-version/",
        descricao: "Enfrente a batalha definitiva e participe da intensa competição na região de Hoenn com Pokémon Emerald.",
        imagem: "https://images.emulatorgames.net/gameboy-advance/pokemon-emerald-version.webp"
    },
    {
        nome: "Pokémon Heart Gold",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-heartgold-version/",
        descricao: "Redescubra Johto com Pokémon Heart Gold e sua jornada ao lado do Pokémon lendário Ho-Oh.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/4787-pokemon-heartgold-version.webp"
    },
    {
        nome: "Pokémon Platinum",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-platinum-version-us/",
        descricao: "Explore Sinnoh em uma versão expandida e melhore suas habilidades com Pokémon Platinum.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/3541-pokemon-platinum-version-us.webp"
    },
    {
        nome: "Pokémon Ultra Violet",
        link: "https://www.emulatorgames.net/roms/gameboy-advance/pokemon-ultra-violet-122-lsa-fire-red-hack/",
        descricao: "Viaje pelo mundo dos jogos de Fire Red, mas com uma nova e emocionante aventura em Pokémon Ultra Violet.",
        imagem: "https://images.emulatorgames.net/gameboy-advance/pokemon-ultra-violet.webp"
    },
    {
        nome: "Pokémon Ruby",
        link: "https://www.emulatorgames.net/roms/gameboy-advance/pokemon-ruby-version-v11/",
        descricao: "Explore a região de Hoenn e viva a luta contra a Team Aqua em Pokémon Ruby.",
        imagem: "https://images.emulatorgames.net/gameboy-advance/pokemon-ruby-version-v1-1.webp"
    },
    {
        nome: "Pokémon Sapphire",
        link: "https://www.emulatorgames.net/roms/gameboy-advance/pokemon-sapphire-version-v11/",
        descricao: "Participe de uma jornada épica enfrentando a Team Magma em Pokémon Sapphire na região de Hoenn.",
        imagem: "https://images.emulatorgames.net/gameboy-advance/pokemon-sapphire-version-v1-1.webp"
    },
    {
        nome: "Pokémon Leaf Green",
        link: "https://www.emulatorgames.net/roms/gameboy-advance/pokemon-leaf-green-version-v11/",
        descricao: "O remake de Pokémon Green que introduz novas mecânicas e aventuras na região de Kanto.",
        imagem: "https://images.emulatorgames.net/gameboy-advance/pokemon-leaf-green-version-v1-1.webp"
    },
    {
        nome: "Pokémon Black",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-black-version/",
        descricao: "Explore Unova e descubra uma história única com Pokémon Black, focada em novas experiências e batalhas.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/5585-pokemon-black-version.webp"
    },
    {
        nome: "Pokémon Black 2",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-black-version-2-friends/",
        descricao: "Uma sequência direta de Pokémon Black, onde novas aventuras e desafios esperam em Unova.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/6149-pokemon-black-version-2-friends.webp"
    },
    {
        nome: "Pokémon White",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-white-version/",
        descricao: "Uma jornada paralela a Pokémon Black, mas com diferentes versões de história e Pokémon para capturar.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/5584-pokemon-white-version.webp"
    },
    {
        nome: "Pokémon White 2",
        link: "https://images.emulatorgames.net/nintendo-ds/6043-pokemon-white-2-patched-and-exp-fixed.webp",
        descricao: "Continuando a história de Pokémon White, você verá novos lugares e novos Pokémon para explorar em White 2.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/6043-pokemon-white-2-patched-and-exp-fixed.webp"
    },
    {
        nome: "Pokémon Soul Silver",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-soulsilver-version/",
        descricao: "Aventura em Johto com a versão Soul Silver, uma das mais amadas com o retorno de Suicune e outros Pokémon lendários.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/4788-pokemon-soulsilver-version.webp"
    },
    {
        nome: "Pokémon Jupiter",
        link: "https://www.emulatorgames.net/roms/gameboy-advance/pokemon-jupiter-604-ruby-hack/",
        descricao: "Uma versão hackeada de Ruby, onde você viajará por novas aventuras com novos personagens e Pokémon em Pokémon Jupiter.",
        imagem: "https://images.emulatorgames.net/gameboy-advance/pokemon-jupiter-6-04-ruby-hack.webp"
    },
    {
        nome: "Pokémon Diamond",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-diamond/",
        descricao: "Explore a região de Sinnoh com Pokémon Diamond, um dos jogos de maior sucesso da franquia.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/1015-pokemon-diamond.webp"
    },
    {
        nome: "Pokémon Pearl",
        link: "https://www.emulatorgames.net/roms/nintendo-ds/pokemon-pearl/",
        descricao: "Pokémon Pearl leva você a uma jornada épica em Sinnoh, onde você enfrentará novos desafios e encontrará Pokémon raros.",
        imagem: "https://images.emulatorgames.net/nintendo-ds/1016-pokemon-pearl.webp"
    },
];

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredJogos = jogos.filter((jogo) =>
        jogo.nome.toLowerCase().includes(searchTerm)
    );

    return (
        <div>
            <div>
                <h1 >PokéGames - Download de Jogos Pokémon</h1>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Pesquise por jogo..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pesquisa"
                />
                <div className="jogos-container">
                    {filteredJogos.map((jogo, index) => (
                        <div key={index} className="jogo-item">
                            <h3>{jogo.nome}</h3>
                            <p>{jogo.descricao}</p>
                            <img src={jogo.imagem} alt={jogo.nome} className="jogo-image" />
                            <a href={jogo.link} target="_blank" rel="noopener noreferrer" className="download-button">
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
