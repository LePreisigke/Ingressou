// src/pages/Auth.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';
import { useNavigate } from 'react-router-dom';
// --- MUDANÇA: Importamos o axios ---
import axios from 'axios';
// --- MUDANÇA: A linha abaixo foi removida ---
// import { login as loginAPI, register as registerAPI } from '../utils/auth';

// --- (Todos os seus Styled Components permanecem iguais) ---
const AuthContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.primaryDark};
  padding: 50px 20px;
`;
const AuthFormContainer = styled.div`
  background-color: ${colors.white};
  padding: 40px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;
const AuthTitle = styled.h3`
  font-size: 2rem;
  color: ${colors.textDarker};
  margin-bottom: 10px;
  text-align: center;
`;
const AuthSubtitle = styled.p`
  font-size: 1rem;
  color: ${colors.purpleMedium};
  margin-bottom: 25px;
  text-align: center;
`;
const TabsBar = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 24px;
`;
const TabButton = styled.button`
  min-width: 260px;
  padding: 14px 24px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: 2px solid ${colors.purpleLight};
  background: ${({ active }) => (active ? colors.primaryDark : colors.white)};
  color: ${({ active }) => (active ? colors.white : colors.primaryDark)};
  transition: all .2s ease;
  &:hover {
    border-color: ${colors.purpleMedium};
    ${({ active }) =>
      !active &&
      `
        background: ${colors.purpleVeryLight};
      `}
  }
`;
const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  &.one-col {
    grid-template-columns: 1fr;
  }
`;
const FormSectionTitle = styled.h4`
  grid-column: 1 / -1;
  font-size: 1.1rem;
  color: ${colors.primaryDark};
  border-bottom: 1px solid ${colors.purpleLight};
  padding-bottom: 8px;
  margin: 10px 0 0 0;
`;
const FormField = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: ${({ fullWidth }) => (fullWidth ? '1 / -1' : 'auto')};
`;
const FormLabel = styled.label`
  font-size: 0.9rem;
  color: ${colors.textDark};
  margin-bottom: 5px;
`;
const FormInput = styled.input`
  padding: 10px;
  border: 1px solid ${colors.purpleLight};
  border-radius: 5px;
  background-color: ${colors.offWhite};
  font-size: 1rem;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: ${colors.textDark};
  margin-bottom: 20px;
  
  input {
    margin-right: 10px;
  }
`;
const FormSelect = styled.select`
  padding: 10px;
  border: 1px solid ${colors.purpleLight};
  border-radius: 5px;
  background-color: ${colors.offWhite};
  font-size: 1rem;
`;
const FormFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  grid-column: 1 / -1;
`;
const FooterText = styled.p`
  font-size: 1.2rem;
  color: ${colors.textDarker};
  font-weight: 600;
`;
const SubmitButton = styled.button`
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  border: none;
  padding: 10px 30px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${colors.purpleMedium};
  }
  &:disabled {
    background-color: ${colors.purpleLight};
    cursor: not-allowed;
  }
`;
const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${colors.purpleMedium};
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  text-decoration: underline;
  &:hover {
    color: ${colors.primaryDark};
  }
`;
const Message = styled.p`
  grid-column: 1 / -1;
  margin: 0 0 10px 0;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.95rem;
  ${({ type }) =>
    type === 'error'
      ? `
    color: #c0392b;
    background: #fdecea;
    border: 1px solid #f5c6cb;
  `
      : `
    color: #1e7e34;
    background: #e7f6ec;
    border: 1px solid #c3e6cb;
  `}
`;

// --- Componente Principal ---
const Auth = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  // --- MUDANÇA: Adicionamos estado de loading ---
  const [isLoading, setIsLoading] = useState(false);

  // State de cadastro (mantido)
  const [reg, setReg] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    telefone: '', 
    country: 'Brasil',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    complemento: '',
    promo: false,
  });

  // State de login (mantido)
  const [log, setLog] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const clearMessages = () => {
    setError('');
    setOk('');
  };

  const switchTo = (mode) => {
    clearMessages();
    setIsRegister(mode === 'register');
  };

  // --- MUDANÇA: Função de Cadastro atualizada ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    
    // Validação (mantida)
    const requiredFields = [
      'firstName', 'lastName', 'email', 'password', 'telefone',
      'country', 'cep', 'rua', 'numero', 'bairro', 'cidade'
    ];
    for (const field of requiredFields) {
      if (!reg[field] || !reg[field].trim()) {
        let fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        if (field === 'firstName') fieldName = 'Primeiro nome';
        if (field === 'lastName') fieldName = 'Sobrenome';
        if (field === 'cep') fieldName = 'CEP';
        setError(`O campo "${fieldName}" é obrigatório.`);
        return;
      }
    }

    // Ativa o loading
    setIsLoading(true);

    // Monta o 'payload' (carga de dados) EXATAMENTE como o backend espera
    const payload = {
      nome: `${reg.firstName.trim()} ${reg.lastName.trim()}`,
      email: reg.email.trim(),
      senha: reg.password, // O backend espera 'senha'
      telefone: reg.telefone.trim(),
      pais: reg.country.trim(), // O backend espera 'pais'
      cep: reg.cep.trim(),
      rua: reg.rua.trim(),
      numero: reg.numero.trim(),
      bairro: reg.bairro.trim(),
      cidade: reg.cidade.trim(),
      complemento: reg.complemento.trim(),
    };

    try {
      // Chama a API do backend
      await axios.post('http://localhost:8080/api/auth/registrar', payload);

      // Sucesso!
      setOk('Cadastro realizado com sucesso! Por favor, faça o login.');
      setIsRegister(false); // Muda para a aba de login
      setReg({ ...reg, password: '' }); // Limpa a senha
      
    } catch (apiError) {
      // Trata erros da API (ex: email já existe)
      if (apiError.response && apiError.response.data) {
        setError(apiError.response.data.message);
      } else {
        setError('Erro de rede. Não foi possível conectar ao servidor.');
      }
    } finally {
      // Desativa o loading, independente de sucesso ou erro
      setIsLoading(false);
    }
  };

  // --- MUDANÇA: Função de Login atualizada ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    
    if (!log.email.trim() || !log.password) {
      setError('Informe e-mail e senha.');
      return;
    }
    
    setIsLoading(true);

    // Monta o payload
    const payload = {
      email: log.email.trim(),
      senha: log.password // O backend espera 'senha'
    };

    try {
      // Chama a API
      const response = await axios.post('http://localhost:8080/api/auth/login', payload);

      // Pega o token e o usuário da resposta
      const { token, usuario } = response.data;

      // Salva no localStorage (ou sessionStorage)
      const storage = log.remember ? localStorage : sessionStorage;
      storage.setItem('authToken', token);
      storage.setItem('loggedUser', JSON.stringify(usuario));

      // Sucesso!
      setOk('Login efetuado! Redirecionando…');

      // Dispara o evento e navega
      setTimeout(() => {
        window.dispatchEvent(new Event('auth:changed')); // Atualiza o Navbar, etc.
        navigate('/');
      }, 400);

    } catch (apiError) {
      if (apiError.response && apiError.response.data) {
        // Ex: "Usuário não encontrado" ou "Senha incorreta"
        setError(apiError.response.data.message);
      } else {
        setError('Erro de rede. Não foi possível conectar ao servidor.');
      }
      setIsLoading(false); // Só desativa o loading em caso de erro
    }
    // Não desativamos o loading em caso de sucesso, pois a página vai redirecionar
  };

  return (
    <AuthContainer>
      <AuthFormContainer>
        <AuthTitle>{isRegister ? 'Crie sua Conta' : 'Acesse sua Conta'}</AuthTitle>
        <AuthSubtitle>
          {isRegister
            ? 'Se cadastre para ter a melhor experiência nos jogos!'
            : 'Bem-vindo de volta! Faça login para continuar.'}
        </AuthSubtitle>

        {/* Abas */}
        <TabsBar>
          <TabButton
            type="button"
            active={!isRegister}
            onClick={() => switchTo('login')}
            disabled={isLoading} // --- MUDANÇA ---
          >
            Entrar
          </TabButton>
          <TabButton
            type="button"
            active={isRegister}
            onClick={() => switchTo('register')}
            disabled={isLoading} // --- MUDANÇA ---
          >
            Cadastrar
          </TabButton>
        </TabsBar>

        {/* Formulário de Login */}
        {!isRegister ? (
          <FormGrid className="one-col" onSubmit={handleLoginSubmit}>
            {error && <Message type="error">{error}</Message>}
            {ok && <Message type="ok">{ok}</Message>}

            <FormField fullWidth>
              <FormLabel>Email *</FormLabel>
              <FormInput
                type="email"
                value={log.email}
                onChange={(e) => setLog({ ...log, email: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField fullWidth>
              <FormLabel>Senha *</FormLabel>
              <FormInput
                type="password"
                value={log.password}
                onChange={(e) => setLog({ ...log, password: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField fullWidth>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={log.remember}
                  onChange={(e) => setLog({ ...log, remember: e.target.checked })}
                  disabled={isLoading} // --- MUDANÇA ---
                />
                Lembrar de mim
              </CheckboxLabel>
            </FormField>
            <FormFooter style={{ justifyContent: 'flex-end' }}>
              <SubmitButton type="submit" disabled={isLoading}>
                {/* --- MUDANÇA --- */}
                {isLoading ? 'Carregando...' : 'Entrar'}
              </SubmitButton>
            </FormFooter>
          </FormGrid>
        
        ) : (
          // Formulário de Cadastro
          <FormGrid onSubmit={handleRegisterSubmit}>
            {error && <Message type="error">{error}</Message>}
            {ok && <Message type="ok">{ok}</Message>}

            <FormSectionTitle>Dados da Conta</FormSectionTitle>

            <FormField>
              <FormLabel>Primeiro nome *</FormLabel>
              <FormInput
                type="text"
                value={reg.firstName}
                onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField>
              <FormLabel>Sobrenome *</FormLabel>
              <FormInput
                type="text"
                value={reg.lastName}
                onChange={(e) => setReg({ ...reg, lastName: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField fullWidth>
              <FormLabel>Email *</FormLabel>
              <FormInput
                type="email"
                value={reg.email}
                onChange={(e) => setReg({ ...reg, email: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField>
              <FormLabel>Senha *</FormLabel>
              <FormInput
                type="password"
                value={reg.password}
                onChange={(e) => setReg({ ...reg, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField>
              <FormLabel>Telefone *</FormLabel>
              <FormInput
                type="tel"
                value={reg.telefone}
                onChange={(e) => setReg({ ...reg, telefone: e.target.value })}
                placeholder="(XX) 9XXXX-XXXX"
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>

            <FormSectionTitle>Endereço</FormSectionTitle>

            <FormField fullWidth>
              <FormLabel>País/Região *</FormLabel>
              <FormSelect
                value={reg.country}
                onChange={(e) => setReg({ ...reg, country: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              >
                <option>Brasil</option>
                <option>Argentina</option>
                <option>Uruguai</option>
              </FormSelect>
            </FormField>
            <FormField>
              <FormLabel>CEP *</FormLabel>
              <FormInput
                type="text"
                value={reg.cep}
                onChange={(e) => setReg({ ...reg, cep: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField>
              <FormLabel>Cidade *</FormLabel>
              <FormInput
                type="text"
                value={reg.cidade}
                onChange={(e) => setReg({ ...reg, cidade: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField fullWidth>
              <FormLabel>Bairro *</FormLabel>
              <FormInput
                type="text"
                value={reg.bairro}
                onChange={(e) => setReg({ ...reg, bairro: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField fullWidth>
              <FormLabel>Rua (Endereço) *</FormLabel>
              <FormInput
                type="text"
                value={reg.rua}
                onChange={(e) => setReg({ ...reg, rua: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField>
              <FormLabel>Número *</FormLabel>
              <FormInput
                type="text"
                value={reg.numero}
                onChange={(e) => setReg({ ...reg, numero: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>
            <FormField>
              <FormLabel>Complemento (Opcional)</FormLabel>
              <FormInput
                type="text"
                value={reg.complemento}
                onChange={(e) => setReg({ ...reg, complemento: e.target.value })}
                disabled={isLoading} // --- MUDANÇA ---
              />
            </FormField>

            <FormSectionTitle>Notificações</FormSectionTitle>
            <FormField fullWidth>
              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={reg.promo}
                  onChange={(e) => setReg({ ...reg, promo: e.target.checked })}
                  disabled={isLoading} // --- MUDANÇA ---
                />
                Gostaria de receber promoções no email (Opcional)
              </CheckboxLabel>
            </FormField>

            <FormFooter>
              <FooterText>Invista em seu lazer</FooterText>
              <SubmitButton type="submit" disabled={isLoading}>
                {/* --- MUDANÇA --- */}
                {isLoading ? 'Cadastrando...' : 'Concluir Cadastro'}
              </SubmitButton>
            </FormFooter>
          </FormGrid>
        )}

        <ToggleButton 
          onClick={() => switchTo(isRegister ? 'login' : 'register')}
          disabled={isLoading} // --- MUDANÇA ---
        >
          {isRegister
            ? 'Já tem uma conta? Clique para fazer Login'
            : 'Não tem uma conta? Clique para se Cadastrar'}
        </ToggleButton>
      </AuthFormContainer>
    </AuthContainer>
  );
};

export default Auth;