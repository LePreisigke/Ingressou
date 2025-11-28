// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { colors } from "../styles/GlobalStyles";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTicketAlt, FaHeart, FaRegStar, FaStore, FaBell,
  FaCommentDots, FaShieldAlt, FaPlus, FaPencilAlt,
  FaSave, FaTimes, FaLock, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';

// --- (Todos os seus Styled Components permanecem iguais) ---
const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: ${colors.offWhite};
  display: flex;
  justify-content: center;
  padding: 40px 15px 80px;
`;
const Content = styled.div`
  width: 100%;
  max-width: 1180px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;
const PageTitle = styled.h1`
  font-size: 2.1rem;
  color: ${colors.primaryDark};
`;
const SmallMuted = styled.p`
  color: ${colors.textDark};
  margin-top: 6px;
  max-width: 450px;
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;
const EditButton = styled.button`
  background: ${colors.primaryDark};
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  height: fit-content;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  &:hover {
    background: ${colors.purpleMedium};
  }
  &:disabled {
    background: ${colors.purpleLight};
  }
`;
const CancelButton = styled(EditButton)`
  background: ${colors.white};
  color: ${colors.textDark};
  border: 1px solid ${colors.purpleLight};
  &:hover {
    background: ${colors.offWhite};
  }
`;
const ProfileHeader = styled.div`
  background: ${colors.white};
  border-radius: 18px;
  padding: 22px 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  
  /* Borda roxa para destacar */
  border: 1px solid ${colors.purpleMedium};
  
  box-shadow: 0 6px 26px rgba(0, 0, 0, 0.03);
`;
const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 999px;
  background: ${colors.primaryDark};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.6rem;
  flex-shrink: 0;
`;
const UserInfo = styled.div`
  flex: 1;
  h2 {
    color: ${colors.textDarker};
    font-size: 1.4rem;
    margin: 0;
  }
  span {
    color: ${colors.textDark};
    font-size: 0.95rem;
  }
`;
const EditInput = styled.input`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${colors.textDarker};
  border: none;
  border-bottom: 2px solid ${colors.purpleMedium};
  padding: 2px 5px;
  width: 90%;
  font-family: inherit;
  margin: 0;
  &:focus {
    outline: none;
    border-bottom-color: ${colors.primaryDark};
  }
`;
const MemberSince = styled.div`
  text-align: right;
  font-size: 0.9rem;
  color: ${colors.textDark};
  flex-shrink: 0;
`;
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 25px;
  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;
const Card = styled.div`
  background: ${colors.white};
  border-radius: 18px;
  padding: 25px;
  
  /* ADICIONADO: Borda roxa média para contornar o card */
  border: 1px solid ${colors.purpleMedium}; 
  
  /* Sombra suave para dar profundidade */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    /* Ao passar o mouse, a borda fica roxa escura para destaque */
    border-color: ${colors.primaryDark};
  }
`;

const CardTitle = styled.h3`
  font-size: 1.15rem;
  color: ${colors.textDarker};
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const PrefGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;
const Chip = styled.span`
  position: relative;
  background: ${(p) =>
    p.selected ? colors.primaryDark : colors.purpleVeryLight};
  color: ${(p) => (p.selected ? "#fff" : colors.primaryDark)};
  border: none;
  padding: 5px 24px 5px 10px;
  border-radius: 999px;
  font-weight: 500;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
`;
const ChipRemove = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  line-height: 16px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.85);
  color: ${colors.primaryDark};
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #fff;
  }
`;
const ClearAll = styled.button`
  background: none;
  border: none;
  color: ${colors.textDark};
  text-decoration: underline;
  font-size: 0.85rem;
  margin-top: 8px;
  cursor: pointer;
  &:hover {
    color: ${colors.primaryDark};
  }
`;
const AddChipButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${colors.purpleVeryLight};
  color: ${colors.primaryDark};
  border: 1px dashed ${colors.purpleMedium};
  padding: 5px 12px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${colors.offWhite};
    border-style: solid;
    color: ${colors.primaryDark};
  }
`;
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;
const ModalBox = styled.div`
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 16px;
  padding: 18px;
`;
const ModalTitle = styled.h4`
  margin: 0 0 10px;
  color: ${colors.textDarker};
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${colors.purpleLight};
  background: ${colors.offWhite};
  margin-bottom: 10px;
  font-size: 0.95rem;
`;
const OptionList = styled.div`
  max-height: 280px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const OptionItem = styled.button`
  width: 100%;
  text-align: left;
  border: 1px solid ${colors.purpleVeryLight};
  background: #fff;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  &:hover {
    background: ${colors.purpleVeryLight};
  }
`;
const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
`;
const Secondary = styled.button`
  border: 1px solid ${colors.primaryDark};
  color: ${colors.primaryDark};
  background: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
`;
const Primary = styled.button`
  border: none;
  background: ${colors.primaryDark};
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
`;
const SectionDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.04);
  margin: 15px 0;
`;
const PurchasesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const PurchaseItem = styled.div`
  background: ${colors.offWhite};
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const PurchaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  strong {
    color: ${colors.textDarker};
  }
  small {
    color: ${colors.textDark};
  }
`;
const ViewTicketButton = styled(Link)`
  background: ${colors.primaryDark};
  color: #fff;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    background: ${colors.purpleMedium};
  }
`;
const EmptyState = styled.div`
  background: ${colors.offWhite};
  border-radius: 14px;
  padding: 16px;
  color: ${colors.textDark};
`;
const FeedbackTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  border-radius: 10px;
  border: 1px solid rgba(100, 89, 168, 0.25);
  padding: 10px 12px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.95rem;
  margin-top: 10px;
  &:focus {
    outline: 2px solid rgba(100, 89, 168, 0.35);
  }
`;
const SendButton = styled.button`
  margin-top: 10px;
  background: ${colors.primaryDark};
  color: #fff;
  border: none;
  padding: 8px 22px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${colors.purpleMedium};
  }
  &:disabled {
    background: ${colors.purpleLight};
    cursor: not-allowed;
  }
`;
const ToggleRow = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: ${colors.textDark};
  font-weight: 500;
`;
const ToggleInput = styled.input`
  width: 50px;
  height: 26px;
`;
const DangerButton = styled.button`
  background: #fff0f0;
  color: #b90000;
  border: 1px solid rgba(185, 0, 0, 0.15);
  padding: 7px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #ffe2e2;
  }
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
`;
const FormLabel = styled.label`
  font-weight: 500;
  color: ${colors.textDarker};
  font-size: 0.9rem;
`;
const FormInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid ${colors.purpleLight};
  background: ${colors.offWhite};
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: ${colors.primaryDark};
    background: ${colors.white};
  }
`;
const PasswordError = styled.small`
  color: #b90000;
  font-weight: 600;
  margin-top: 4px;
`;

// --- MUDANÇA: Styled component para o botão "Ver Mais" ---
const ShowMoreButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  border-top: 1px solid rgba(0,0,0,0.05);
  padding-top: 12px;
  margin-top: 5px;
  color: ${colors.primaryDark};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  &:hover {
    color: ${colors.purpleMedium};
  }
`;

/* ---------- helpers ---------- */
function readLoggedUser() {
  try {
    let raw = localStorage.getItem('loggedUser');
    if (!raw) {
      raw = sessionStorage.getItem('loggedUser');
    }
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  } catch (e) { return dateString; }
};
const formatTime = (timeString) => {
  try {
    return timeString.substring(0, 5); 
  } catch (e) { return timeString; }
};

/* ========================================================= */
const Profile = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(() => readLoggedUser());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [myOrders, setMyOrders] = useState([]);
  
  // --- MUDANÇA: State para controlar "Ver Mais" ---
  const [showAllOrders, setShowAllOrders] = useState(false);

  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [favoriteStadiums, setFavoriteStadiums] = useState([]); 
  const [favoriteKiosks, setFavoriteKiosks] = useState([]); 
  
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifWhats, setNotifWhats] = useState(false);
  
  const [comentario, setComentario] = useState(""); 
  const [feedbackJogoId, setFeedbackJogoId] = useState(""); 
  const [feedbackNota, setFeedbackNota] = useState(0); 
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  
  const [teamsOptions, setTeamsOptions] = useState(["Corinthians", "São Paulo", "Palmeiras", "Flamengo", "Vasco", "Botafogo"]);
  const [stadiumOptions, setStadiumOptions] = useState([]);
  const [kioskOptions, setKioskOptions] = useState([]);

  // --- EFEITOS (Ouvinte, Redirecionador, Buscador) ---
  useEffect(() => {
    const onAuthChanged = () => setUser(readLoggedUser());
    window.addEventListener('auth:changed', onAuthChanged);
    const onStorage = (e) => {
      if (e.key === 'loggedUser') setUser(readLoggedUser());
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('auth:changed', onAuthChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []); 

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchAllData = async () => {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        return; 
      }
      
      setIsLoading(true);
      setError('');

      try {
        const promises = [
          axios.get('http://localhost:8080/api/perfil', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('http://localhost:8080/api/ingressos/meus-ingressos', { headers: { 'Authorization': `Bearer ${token}` } }),
          axios.get('http://localhost:8080/api/estadios'),
          axios.get('http://localhost:8080/api/quiosques')
        ];

        const [perfilResponse, ingressosResponse, estadiosResponse, quiosquesResponse] = await Promise.all(promises);

        const apiUser = perfilResponse.data;
        setUser(apiUser);
        setEditedName(apiUser.nome);
        setFavoriteTeams(apiUser.timesFavoritos.map(t => t.nome_time));
        setFavoriteStadiums(apiUser.estadiosFavoritos);
        setFavoriteKiosks(apiUser.quiosquesFavoritos);

        setMyOrders(ingressosResponse.data);

        setStadiumOptions(estadiosResponse.data);
        setKioskOptions(quiosquesResponse.data);
        
      } catch (err) {
        console.error("Erro ao buscar dados do perfil:", err);
        setError('Erro ao carregar seus dados. Tente recarregar a página.');
        setUser(null); 
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchAllData();
    }
  }, []);

  // --- MUDANÇA: Lógica para cortar a lista de compras ---
  const VISIBLE_COUNT = 3; // Quantos itens mostrar inicialmente
  const displayedOrders = showAllOrders ? myOrders : myOrders.slice(0, VISIBLE_COUNT);

  const initials = useMemo(() => {
    const name = user?.nome?.trim();
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts.at(-1)[0]).toUpperCase();
  }, [user]);

  const memberYear = useMemo(() => {
    try {
      return user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();
    } catch {
      return new Date().getFullYear();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("loggedUser");
    sessionStorage.removeItem("authToken");
    setUser(null);
    window.dispatchEvent(new Event("auth:changed"));
  };

  const handleSave = async () => {
    const token = getAuthToken();
    if (!user || !token) return;
    
    setPasswordError("");
    setIsLoading(true);

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setPasswordError("As senhas não conferem.");
        setIsLoading(false);
        return; 
      }
      if (newPassword.length < 6) {
        setPasswordError("A nova senha deve ter no mínimo 6 caracteres.");
        setIsLoading(false);
        return; 
      }
    }

    const payload = {
      nome: editedName,
      newPassword: newPassword || undefined,
      timesFavoritos: favoriteTeams,
      estadiosFavoritos: favoriteStadiums.map(s => s.id_estadio),
      quiosquesFavoritos: favoriteKiosks.map(k => k.id_quiosque),
    };
    
    try {
      const response = await axios.put('http://localhost:8080/api/perfil', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUser(response.data.usuario);
      setIsEditing(false);
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error('Erro ao salvar:', err);
      toast.error(err.response?.data?.message || 'Erro ao salvar o perfil.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(user?.nome || ""); 
    setFavoriteTeams(user?.timesFavoritos.map(t => t.nome_time) || []);
    setFavoriteStadiums(user?.estadiosFavoritos || []);
    setFavoriteKiosks(user?.quiosquesFavoritos || []);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleSendFeedback = async () => {
    const token = getAuthToken();
    if (!token || !feedbackJogoId || feedbackNota === 0) return;

    setIsLoading(true);
    setFeedbackSuccess('');
    
    const payload = {
      id_jogo: feedbackJogoId,
      nota: feedbackNota,
      comentario: comentario,
    };

    try {
      await axios.post('http://localhost:8080/api/feedback', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setFeedbackSuccess('Feedback enviado com sucesso!');
      setComentario("");
      setFeedbackJogoId("");
      setFeedbackNota(0);
    } catch (err) {
      console.error('Erro ao enviar feedback:', err);
      setFeedbackSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => { setModal(null); setSearch(""); };
  const addTeam = (name) => {
    const value = name.trim();
    if (!value) return;
    setFavoriteTeams((prev) => (prev.includes(value) ? prev : [...prev, value]));
    closeModal();
  };
  const removeTeam = (name) => {
    setFavoriteTeams((prev) => prev.filter((t) => t !== name));
  };
  const filteredTeams = teamsOptions.filter((t) => !favoriteTeams.includes(t));

  const addStadium = (stadium) => {
    setFavoriteStadiums((prev) => [...prev, stadium]);
    closeModal();
  };
  const removeStadium = (id) => {
    setFavoriteStadiums((prev) => prev.filter((s) => s.id_estadio !== id));
  };
  const favoriteStadiumIds = favoriteStadiums.map(s => s.id_estadio);
  const filteredStadiums = stadiumOptions.filter((s) => !favoriteStadiumIds.includes(s.id_estadio));

  const addKiosk = (kiosk) => {
    setFavoriteKiosks((prev) => [...prev, kiosk]);
    closeModal();
  };
  const removeKiosk = (id) => {
    setFavoriteKiosks((prev) => prev.filter((k) => k.id_quiosque !== id));
  };
  const favoriteKioskIds = favoriteKiosks.map(k => k.id_quiosque);
  const filteredKiosks = kioskOptions.filter((k) => !favoriteKioskIds.includes(k.id_quiosque));


  if (isLoading && !user) {
    return <PageWrapper><p>Carregando...</p></PageWrapper>;
  }
  if (!user) {
    return null; 
  }

  return (
    <PageWrapper>
      <Content>
        <TopBar>
          <div>
            <PageTitle>Meu perfil</PageTitle>
            <SmallMuted>
              {isEditing
                ? "Edite seus dados pessoais abaixo."
                : "Personalize sua experiência no Ingressou e veja suas últimas compras."}
            </SmallMuted>
          </div>
          
          <ButtonRow>
            {isEditing ? (
              <>
                <CancelButton onClick={handleCancel} disabled={isLoading}>
                  <FaTimes /> Cancelar
                </CancelButton>
                <EditButton onClick={handleSave} disabled={isLoading}>
                  <FaSave /> {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </EditButton>
              </>
            ) : (
              <EditButton onClick={() => setIsEditing(true)}>
                <FaPencilAlt /> Editar dados
              </EditButton>
            )}
          </ButtonRow>
        </TopBar>

        <ProfileHeader>
          <Avatar>{initials}</Avatar>
          <UserInfo>
            {isEditing ? (
              <EditInput
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                autoFocus
              />
            ) : (
              <h2>{user.nome || "-"}</h2>
            )}
            <span>{user.email || "-"}</span>
          </UserInfo>
          <MemberSince>
            Membro desde:
            <br />
            <strong>{memberYear}</strong>
          </MemberSince>
        </ProfileHeader>
        
        {error && <Message type="error">{error}</Message>}

        <DashboardGrid>
          <Column>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <CardTitle style={{ marginBottom: 0 }}>
                  <FaTicketAlt /> Minhas compras
                </CardTitle>
                
                {/* --- MUDANÇA: Seus ingressos aparecerão aqui --- */}
                {myOrders.length > 0 && (
                  <span style={{ fontSize: '0.8rem', color: colors.textLight }}>
                    Total: {myOrders.length}
                  </span>
                )}
              </div>

              {myOrders.length === 0 ? (
                <EmptyState>Você ainda não tem compras.</EmptyState>
              ) : (
                <>
                  <PurchasesList>
                    {/* --- MUDANÇA: Usa a lista cortada --- */}
                    {displayedOrders.map((o) => {
                      const price = Number(o.setor?.preco ?? 0);
                      const priceLabel = `R$ ${price.toFixed(2).replace(".", ",")}`;
                      const dateLabel = `${formatDate(o.jogo?.data_jogo)} · ${formatTime(o.jogo?.horario)}`;
                      return (
                        <PurchaseItem key={o.id_ingresso}>
                          <PurchaseInfo>
                            <strong>{o.jogo?.time_casa} X {o.jogo?.time_visitante}</strong>
                            <small>{dateLabel}</small>
                            <small>{o.jogo?.estadio?.nome}</small>
                          </PurchaseInfo>
                          <div style={{ textAlign: "right" }}>
                            <strong>{priceLabel}</strong>
                            <br />
                          </div>
                        </PurchaseItem>
                      );
                    })}
                  </PurchasesList>

                  {/* --- MUDANÇA: Botão Ver Mais / Ver Menos --- */}
                  {myOrders.length > VISIBLE_COUNT && (
                    <ShowMoreButton onClick={() => setShowAllOrders(!showAllOrders)}>
                      {showAllOrders ? (
                        <>Ver menos <FaChevronUp size={10} /></>
                      ) : (
                        <>Ver todas as {myOrders.length} compras <FaChevronDown size={10} /></>
                      )}
                    </ShowMoreButton>
                  )}
                </>
              )}
            </Card>
          </Column>
          
          <Column>
            {/* ... (Cards de Preferências - sem mudanças) ... */}
            <Card>
              <CardTitle><FaHeart /> Times favoritos</CardTitle>
              <PrefGroup>
                {favoriteTeams.map((t) => (
                  <Chip key={t} selected>
                    {t}
                    {isEditing && <ChipRemove onClick={() => removeTeam(t)}>×</ChipRemove>}
                  </Chip>
                ))}
                {isEditing && <AddChipButton onClick={() => setModal("teams")}><FaPlus size={12} /> Adicionar</AddChipButton>}
              </PrefGroup>
            </Card>
            <Card>
              <CardTitle><FaRegStar /> Estádio favorito</CardTitle>
              <PrefGroup>
                {favoriteStadiums.map((s) => (
                  <Chip key={s.id_estadio} selected>
                    {s.nome}
                    {isEditing && <ChipRemove onClick={() => removeStadium(s.id_estadio)}>×</ChipRemove>}
                  </Chip>
                ))}
                {isEditing && <AddChipButton onClick={() => setModal("stadium")}><FaPlus size={12} /> Adicionar</AddChipButton>}
              </PrefGroup>
            </Card>
            <Card>
              <CardTitle><FaStore /> Quiosque favorito</CardTitle>
              <PrefGroup>
                {favoriteKiosks.map((k) => (
                  <Chip key={k.id_quiosque} selected>
                    {k.nome_quiosque}
                    {isEditing && <ChipRemove onClick={() => removeKiosk(k.id_quiosque)}>×</ChipRemove>}
                  </Chip>
                ))}
                {isEditing && <AddChipButton onClick={() => setModal("kiosk")}><FaPlus size={12} /> Adicionar</AddChipButton>}
              </PrefGroup>
            </Card>
          </Column>
          
          <Column>
            <Card>
              <CardTitle> <FaBell /> Notificações </CardTitle>
              <ToggleRow>
                Receber avisos por e-mail
                <ToggleInput type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} disabled={!isEditing} />
              </ToggleRow>
              <ToggleRow>
                Receber avisos por WhatsApp
                <ToggleInput type="checkbox" checked={notifWhats} onChange={(e) => setNotifWhats(e.target.checked)} disabled={!isEditing} />
              </ToggleRow>
            </Card>

            <Card>
              <CardTitle> <FaCommentDots /> Feedback </CardTitle>
              {feedbackSuccess && <EmptyState style={{color: 'green', marginBottom: 15}}>{feedbackSuccess}</EmptyState>}
              
              <FormGroup>
                <FormLabel htmlFor="feedbackJogo">Sobre qual jogo?</FormLabel>
                <FormInput
                  as="select" 
                  id="feedbackJogo"
                  value={feedbackJogoId}
                  onChange={(e) => setFeedbackJogoId(e.target.value)}
                >
                  <option value="">Selecione um jogo...</option>
                  {myOrders.map((o) => (
                    <option key={o.id_ingresso} value={o.id_jogo}> 
                      {o.jogo?.time_casa} X {o.jogo?.time_visitante} ({formatDate(o.jogo?.data_jogo)})
                    </option>
                  ))}
                </FormInput>
              </FormGroup>
              {/* ... (Resto do form de feedback) ... */}
              <FormGroup>
                <FormLabel htmlFor="feedbackNota">Qual sua nota?</FormLabel>
                <FormInput
                  as="select"
                  id="feedbackNota"
                  value={feedbackNota}
                  onChange={(e) => setFeedbackNota(Number(e.target.value))}
                >
                  <option value={0} disabled>Selecione uma nota...</option>
                  <option value={5}>⭐⭐⭐⭐⭐ (5 estrelas)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 estrelas)</option>
                  <option value={3}>⭐⭐⭐ (3 estrelas)</option>
                  <option value={2}>⭐⭐ (2 estrelas)</option>
                  <option value={1}>⭐ (1 estrela)</option>
                </FormInput>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="feedbackComentario">Comentário (Opcional)</FormLabel>
                <FeedbackTextarea
                  id="feedbackComentario"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Ex.: atendimento rápido, sinalização clara..."
                  style={{marginTop: 0}} 
                />
              </FormGroup>
              <SendButton 
                onClick={handleSendFeedback} 
                disabled={isLoading || !feedbackJogoId || feedbackNota === 0}
              >
                {isLoading ? 'Enviando...' : 'Enviar feedback'}
              </SendButton>
            </Card>

            <Card>
              <CardTitle>
                {isEditing ? <FaLock /> : <FaShieldAlt />}
                {isEditing ? "Alterar Senha" : "Conta"}
              </CardTitle>
              {isEditing ? (
                <>
                  <FormGroup>
                    <FormLabel htmlFor="newPass">Nova Senha</FormLabel>
                    <FormInput
                      type="password"
                      id="newPass"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormLabel htmlFor="confirmPass">Confirmar Nova Senha</FormLabel>
                    <FormInput
                      type="password"
                      id="confirmPass"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a nova senha"
                    />
                  </FormGroup>
                  {passwordError && (
                    <PasswordError>{passwordError}</PasswordError>
                  )}
                  <SectionDivider />
                  <DangerButton onClick={handleLogout}>
                    Encerrar sessão
                  </DangerButton>
                </>
              ) : (
                <>
                  <small style={{ color: colors.textDark }}>
                    Gerencie acesso e segurança da sua conta.
                  </small>
                  <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                    <DangerButton onClick={handleLogout}>
                      Encerrar sessão
                    </DangerButton>
                  </div>
                </>
              )}
            </Card>
          </Column>
        </DashboardGrid>
      </Content>

      {/* MODAIS */}
      {modal && (
        <ModalBackdrop onClick={closeModal}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            {modal === "teams" && (
              <>
                <ModalTitle>Adicionar time favorito</ModalTitle>
                <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar time..." />
                <OptionList>
                  {filteredTeams
                    .filter(t => t.toLowerCase().includes(search.toLowerCase()))
                    .map((t) => (
                    <OptionItem key={t} onClick={() => addTeam(t)}> {t} </OptionItem>
                  ))}
                </OptionList>
                <ModalActions><Secondary onClick={closeModal}>Cancelar</Secondary></ModalActions>
              </>
            )}
            {modal === "stadium" && (
              <>
                <ModalTitle>Adicionar estádio favorito</ModalTitle>
                <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar estádio..." />
                <OptionList>
                  {filteredStadiums
                    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
                    .map((s) => (
                    <OptionItem key={s.slug} onClick={() => addStadium({id_estadio: s.id_estadio, nome: s.name})}>
                      {s.name}
                    </OptionItem>
                  ))}
                </OptionList>
                <ModalActions><Secondary onClick={closeModal}>Cancelar</Secondary></ModalActions>
              </>
            )}
            {modal === "kiosk" && (
              <>
                <ModalTitle>Adicionar quiosque favorito</ModalTitle>
                <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar quiosque..." />
                <OptionList>
                  {filteredKiosks
                    .filter(k => k.name.toLowerCase().includes(search.toLowerCase()))
                    .map((k) => (
                    <OptionItem key={k.id} onClick={() => addKiosk({id_quiosque: k.id, nome_quiosque: k.name})}>
                      {k.name} ({k.stadiumShort})
                    </OptionItem>
                  ))}
                </OptionList>
                <ModalActions><Secondary onClick={closeModal}>Cancelar</Secondary></ModalActions>
              </>
            )}
          </ModalBox>
        </ModalBackdrop>
      )}
    </PageWrapper>
  );
};

export default Profile;