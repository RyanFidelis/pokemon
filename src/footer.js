import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import './App.css';

const Footer = ({
    email,
    setEmail,
    birthDate,
    setBirthDate,
    isSelected,
    setSelection,
    isTermsAccepted,
    setIsTermsAccepted,
    handleCreateAccount
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccessModal, setIsSuccessModal] = useState(false);

    const handleFormSubmit = () => {
        if (!email || !birthDate) {
            setModalMessage('Por favor, preencha todos os campos.');
            setIsSuccessModal(false);
            setModalVisible(true);
        } else if (!isTermsAccepted) {
            setModalMessage('Você precisa aceitar os Termos de Uso para continuar.');
            setIsSuccessModal(false);
            setModalVisible(true);
        } else if (!isSelected) {
            setModalMessage('Você precisa concordar com os e-mails sobre Pokémon para continuar.');
            setIsSuccessModal(false);
            setModalVisible(true);
        } else {
            handleCreateAccount();
            console.log(`Conta criada com sucesso! E-mail: ${email}`);
        }
    };

    return (
        <div className="footer">
            <h2 className="titulo-footer">Inscreva-se para receber os e-mails da Pokémon!</h2>
            <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
                type="email"
            />
            <InputMask
                className="input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Data de nascimento (dd/mm/aaaa)"
                mask="99/99/9999" 
            />
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => setSelection(e.target.checked)}
                />
                <text>Eu desejo receber e-mails sobre: Jogos de videogame Pokémon, aplicativos e muito mais</text>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                />
                <text>Eu aceito os Termos de Uso e o Aviso de Privacidade do site da Pokémon</text>
            </div>
            <button onClick={handleFormSubmit} className="button">Crie sua conta</button>

            <div className="social-icons-container">
                <img src="/instagram.png" alt="Instagram" className="social-icon" />
                <img src="/facebook.png" alt="Facebook" className="social-icon" />
                <img src="/youtube.png" alt="YouTube" className="social-icon" />
                <img src="/twitter.png" alt="Twitter" className="social-icon" />
            </div>

            {/* Modal de Erro */}
            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <p>{modalMessage}</p>
                        <button 
                            onClick={() => setModalVisible(false)} 
                            className="button-close"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Footer;
