import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Menu from './menu';
import Body from './body';
import Footer from './footer';
import Pokedex from './pokedex'; 
import Ataque from './ataques';
import Itens from './itens';
import Personagens from './personagens';
import Lideres from './lideres';
import Localizacao from './localizacao';
import Comparador from './comparador';
import Batalha from './battle_simulator';
import Jogos from './pokemonGames'; 
import Historia from './historia'; 

const App = () => {
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [isSelected, setSelection] = useState(false);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccessModal, setIsSuccessModal] = useState(false);

    const handleCreateAccount = () => {
        if (!email.trim() || !birthDate.trim()) {
            setModalMessage("Por favor, preencha todos os campos!");
            setIsSuccessModal(false);
            setModalVisible(true);
            return;
        }

        if (!isTermsAccepted) {
            setModalMessage("Você deve aceitar os Termos de Uso.");
            setIsSuccessModal(false);
            setModalVisible(true);
            return;
        }

        setModalMessage(`Conta criada com sucesso! E-mail: ${email}`);
        setIsSuccessModal(true);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    return (
        <Router>
            <div>
                <Menu />
                <Routes>
                    <Route path="/" element={<Navigate to="/body" replace />} />
                    <Route path="/body" element={<Body />} />
                    <Route path="/pokedex" element={<Pokedex />} />
                    <Route path="/ataques" element={<Ataque />} />
                    <Route path="/itens" element={<Itens />} />
                    <Route path="/personagens" element={<Personagens />} />
                    <Route path="/lideres" element={<Lideres />} />
                    <Route path="/localizacao" element={<Localizacao />} />
                    <Route path="/comparador" element={<Comparador />} />
                    <Route path="/battle_simulator" element={<Batalha />} />
                    <Route path="/pokemonGames" element={<Jogos />} />
                    <Route path="/historia" element={<Historia />} />
                </Routes>
                <Footer
                    email={email}
                    setEmail={setEmail}
                    birthDate={birthDate}
                    setBirthDate={setBirthDate}
                    isSelected={isSelected}
                    setSelection={setSelection}
                    isTermsAccepted={isTermsAccepted}
                    setIsTermsAccepted={setIsTermsAccepted}
                    handleCreateAccount={handleCreateAccount}
                />

                {modalVisible && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>{modalMessage}</p>
                            <button
                                onClick={closeModal}
                                className={isSuccessModal ? "button-success" : "button-close"}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    );
};

export default App;
