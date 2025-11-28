import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';
import { FaBuilding, FaFutbol, FaStore, FaUsers, FaSignOutAlt, FaPlus, FaTrash, FaEdit, FaArrowLeft, FaSave, FaUserShield, FaEye, FaChartPie } from 'react-icons/fa';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- MUDANÇA: Importar o toast ---
import { toast } from 'react-toastify';

// --- Styled Components (Geral) ---
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.offWhite};
`;
const Sidebar = styled.aside`
  width: 250px;
  background-color: ${colors.primaryDark};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
const SidebarHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 40px;
  text-align: center;
  border-bottom: 1px solid ${colors.purpleMedium};
  padding-bottom: 20px;
`;
const MenuButton = styled.button`
  background: ${(props) => (props.active ? colors.purpleMedium : 'transparent')};
  color: ${colors.white};
  border: none;
  padding: 15px;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
  &:hover { background: ${colors.purpleLight}; }
`;
const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;
const SectionTitle = styled.h1`
  color: ${colors.textDarker};
  margin-bottom: 30px;
`;
const PlaceholderBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  text-align: center;
  color: ${colors.textDark};
`;

// --- Styled Components (Dashboard Home) ---
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;
const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 5px solid ${colors.primaryDark};
  h3 {
    font-size: 0.9rem;
    color: ${colors.textDark};
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  strong {
    font-size: 2rem;
    color: ${colors.textDarker};
  }
`;

// --- Styled Components (Tabelas e Botões) ---
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;
const Th = styled.th`
  background: ${colors.purpleVeryLight};
  color: ${colors.primaryDark};
  padding: 15px;
  text-align: left;
`;
const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #eee;
  color: ${colors.textDark};
`;
const ActionButton = styled.button`
  background: ${(props) => props.bg || colors.primaryDark};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
  &:hover { opacity: 0.9; }
`;
const AddButton = styled.button`
  background: #35c96b; 
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { background: #2ab55e; }
`;

// --- Styled Components (Formulário) ---
const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  max-width: 800px;
`;
const FormGroup = styled.div`
  margin-bottom: 15px;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: ${colors.textDarker};
`;
const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
`;
const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

// --- Helper Auth ---
function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get('http://localhost:8080/api/admin/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        toast.error("Erro ao carregar dados do dashboard.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <p>Carregando indicadores...</p>;
  if (!stats) return <p>Erro ao carregar dados.</p>;

  return (
    <div>
      <StatsGrid>
        <StatCard style={{ borderLeftColor: '#2ecc71' }}>
          <h3>Total R$ Ingressos Vendidos</h3>
          <strong>R$ {stats.faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
        </StatCard>
        <StatCard style={{ borderLeftColor: '#3498db' }}>
          <h3>Ingressos Vendidos</h3>
          <strong>{stats.totalIngressos}</strong>
        </StatCard>
        <StatCard style={{ borderLeftColor: '#9b59b6' }}>
          <h3>Usuários Cadastrados</h3>
          <strong>{stats.totalUsuarios}</strong>
        </StatCard>
        <StatCard style={{ borderLeftColor: '#f1c40f' }}>
          <h3>Jogos Ativos</h3>
          <strong>{stats.totalJogos}</strong>
        </StatCard>
      </StatsGrid>

      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginBottom: '20px', color: colors.textDarker }}>Vendas por Estádio</h3>
        <div style={{ height: 300, width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={stats.graficoEstadios}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill={colors.primaryDark} name="Ingressos Vendidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// =        GERENCIADOR DE ESTÁDIOS         =
// ==========================================
const EstadiosManager = () => {
  const [estadios, setEstadios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome: '', slug: '', apelido: '', cidade: '', estado: '', capacidade_total: '', descricao: '', imagem_url: '', mapa_detalhado_url: '', mapa_rotas_url: '', setores: [] });

  const fetchEstadios = async () => { try { setIsLoading(true); const response = await axios.get('http://localhost:8080/api/estadios'); setEstadios(response.data); } catch (error) { console.error(error); toast.error("Erro ao carregar estádios."); } finally { setIsLoading(false); } };
  useEffect(() => { fetchEstadios(); }, []);

  const addSector = () => { setFormData({ ...formData, setores: [...formData.setores, { nome_setor: '', preco: '', capacidade_setor: '' }] }); };
  const removeSector = (index) => { const newSectors = [...formData.setores]; newSectors.splice(index, 1); setFormData({ ...formData, setores: newSectors }); };
  const updateSector = (index, field, value) => { const newSectors = [...formData.setores]; newSectors[index][field] = value; setFormData({ ...formData, setores: newSectors }); };

  const handleNewClick = () => { setEditingId(null); setFormData({ nome: '', slug: '', apelido: '', cidade: '', estado: '', capacidade_total: '', descricao: '', imagem_url: '', mapa_detalhado_url: '', mapa_rotas_url: '', setores: [] }); setIsFormOpen(true); };
  const handleEditClick = (estadio) => { setEditingId(estadio.id_estadio || estadio.id); setFormData({ nome: estadio.nome || estadio.name, slug: estadio.slug, apelido: estadio.apelido || estadio.nickname || '', cidade: estadio.cidade, estado: estadio.estado, capacidade_total: estadio.capacidade_total, descricao: estadio.descricao || estadio.description || '', imagem_url: estadio.imagem_url || estadio.imageUrl || '', mapa_detalhado_url: estadio.mapa_detalhado_url || '', mapa_rotas_url: estadio.mapa_rotas_url || '', setores: [] }); setIsFormOpen(true); };
  const handleCancel = () => { setIsFormOpen(false); setEditingId(null); };
  
  const handleDelete = async (id) => { 
    if (!window.confirm("Tem certeza que deseja excluir este estádio?")) return; 
    try { 
      await axios.delete(`http://localhost:8080/api/estadios/${id}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); 
      toast.success("Estádio removido!"); 
      fetchEstadios(); 
    } catch (error) { 
      toast.error(error.response?.data?.message || "Erro ao deletar.");
    } 
  };
  
  const handleSave = async () => { 
    if (!formData.nome || !formData.slug) return toast.warning("Preencha os campos obrigatórios.");
    try { 
      if (editingId) { 
        await axios.put(`http://localhost:8080/api/estadios/${editingId}`, formData, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); 
        toast.success("Estádio atualizado!");
      } else { 
        await axios.post('http://localhost:8080/api/estadios', formData, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); 
        toast.success("Estádio criado!");
      } 
      handleCancel(); fetchEstadios(); 
    } catch (error) { 
      toast.error(error.response?.data?.message || "Erro ao salvar.");
    } 
  };

  if (isFormOpen) {
    return (<div><div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}><ActionButton onClick={handleCancel} style={{ marginRight: 10 }}><FaArrowLeft /> Voltar</ActionButton><h2>{editingId ? "Editar Estádio" : "Novo Estádio"}</h2></div><FormContainer><FormGroup><Label>Nome *</Label><Input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} /></FormGroup><FormGroup><Label>Slug *</Label><Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></FormGroup><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}><FormGroup><Label>Cidade</Label><Input value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} /></FormGroup><FormGroup><Label>Estado</Label><Input value={formData.estado} maxLength={2} onChange={e => setFormData({...formData, estado: e.target.value.toUpperCase()})} /></FormGroup></div><FormGroup><Label>Capacidade</Label><Input type="number" value={formData.capacidade_total} onChange={e => setFormData({...formData, capacidade_total: e.target.value})} /></FormGroup><FormGroup><Label>Imagem URL</Label><Input value={formData.imagem_url} onChange={e => setFormData({...formData, imagem_url: e.target.value})} /></FormGroup><FormGroup><Label>Mapa Detalhado URL</Label><Input value={formData.mapa_detalhado_url} onChange={e => setFormData({...formData, mapa_detalhado_url: e.target.value})} /></FormGroup><FormGroup><Label>Mapa Rotas URL</Label><Input value={formData.mapa_rotas_url} onChange={e => setFormData({...formData, mapa_rotas_url: e.target.value})} /></FormGroup><FormGroup><Label>Apelido</Label><Input value={formData.apelido} onChange={e => setFormData({...formData, apelido: e.target.value})} /></FormGroup><FormGroup><Label>Descrição</Label><TextArea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} /></FormGroup>{!editingId && (<div style={{ marginTop: 30, borderTop: '2px dashed #eee', paddingTop: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}><h3 style={{fontSize: '1.1rem', color: colors.primaryDark}}>Setores do Estádio</h3><button onClick={addSector} style={{ background: colors.purpleLight, color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem' }}>+ Adicionar Setor</button></div>{formData.setores.map((setor, index) => (<div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, marginBottom: 10, alignItems: 'end' }}><FormGroup style={{marginBottom:0}}><Label style={{fontSize:'0.8rem'}}>Nome</Label><Input value={setor.nome_setor} onChange={e => updateSector(index, 'nome_setor', e.target.value)} /></FormGroup><FormGroup style={{marginBottom:0}}><Label style={{fontSize:'0.8rem'}}>Preço</Label><Input type="number" value={setor.preco} onChange={e => updateSector(index, 'preco', e.target.value)} /></FormGroup><FormGroup style={{marginBottom:0}}><Label style={{fontSize:'0.8rem'}}>Capacidade</Label><Input type="number" value={setor.capacidade_setor} onChange={e => updateSector(index, 'capacidade_setor', e.target.value)} /></FormGroup><button onClick={() => removeSector(index)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', height: '42px' }}><FaTrash /></button></div>))}</div>)}<ButtonRow><AddButton onClick={handleSave}><FaSave /> Salvar</AddButton><ActionButton bg="#e74c3c" onClick={handleCancel}>Cancelar</ActionButton></ButtonRow></FormContainer></div>);
  }
  return (<div><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2>Gerenciar Estádios</h2><AddButton onClick={handleNewClick}><FaPlus /> Novo Estádio</AddButton></div>{isLoading ? <p>Carregando...</p> : (<Table><thead><tr><Th>ID</Th><Th>Nome</Th><Th>Cidade</Th><Th>Ações</Th></tr></thead><tbody>{estadios.map((est) => (<tr key={est.id_estadio || est.id}><Td>{est.id_estadio || est.id}</Td><Td>{est.nome || est.name}</Td><Td>{est.cidade}</Td><Td><ActionButton bg="#f39c12" onClick={() => handleEditClick(est)}><FaEdit /></ActionButton><ActionButton bg="#e74c3c" onClick={() => handleDelete(est.id_estadio || est.id)}><FaTrash /></ActionButton></Td></tr>))}</tbody></Table>)}</div>);
};

// ... (JogosManager - ATUALIZADO COM TOASTS) ...
const JogosManager = () => {
  const [jogos, setJogos] = useState([]);
  const [estadios, setEstadios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ time_casa: '', time_visitante: '', data_jogo: '', horario: '', campeonato: '', rodada: '', id_estadio: '' });
  
  const fetchData = async () => { try { setIsLoading(true); const [jogosRes, estadiosRes] = await Promise.all([ axios.get('http://localhost:8080/api/jogos'), axios.get('http://localhost:8080/api/estadios') ]); setJogos(jogosRes.data); setEstadios(estadiosRes.data); } catch (error) { console.error(error); toast.error("Erro ao carregar dados."); } finally { setIsLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  
  const handleNewClick = () => { setEditingId(null); setFormData({ time_casa: '', time_visitante: '', data_jogo: '', horario: '', campeonato: '', rodada: '', id_estadio: '' }); setIsFormOpen(true); };
  const handleEditClick = (jogo) => { try { setEditingId(jogo.id); let dataFormatada = jogo.data_jogo ? String(jogo.data_jogo).split('T')[0] : ''; let estadioId = jogo.id_estadio || ''; if (!estadioId && jogo.estadio) { const estadioEncontrado = estadios.find(e => (e.nome || e.name) === jogo.estadio.nome); estadioId = estadioEncontrado ? (estadioEncontrado.id_estadio || estadioEncontrado.id) : ''; } let rodadaFormatada = jogo.round ? String(jogo.round).replace(/[^\d]/g, '') : ''; setFormData({ time_casa: jogo.time_casa || '', time_visitante: jogo.time_visitante || '', data_jogo: dataFormatada, horario: jogo.horario || '', campeonato: jogo.category || '', rodada: rodadaFormatada, id_estadio: estadioId }); setIsFormOpen(true); } catch (error) { console.error(error); } };
  
  const handleDelete = async (id) => { 
    if (!window.confirm("Apagar este jogo?")) return; 
    try { await axios.delete(`http://localhost:8080/api/jogos/${id}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); 
    toast.success("Jogo removido!"); fetchData(); 
    } catch (error) { toast.error("Erro ao deletar."); } 
  };
  
  const handleSave = async () => { 
    if (!formData.time_casa || !formData.time_visitante || !formData.id_estadio) return toast.warning("Preencha Time Casa, Visitante e Estádio."); 
    try { 
      if (editingId) { await axios.put(`http://localhost:8080/api/jogos/${editingId}`, formData, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); toast.success("Jogo atualizado!"); } 
      else { await axios.post('http://localhost:8080/api/jogos', formData, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); toast.success("Jogo criado!"); } 
      setIsFormOpen(false); fetchData(); 
    } catch (error) { toast.error("Erro ao salvar."); } 
  };

  if (isFormOpen) { return (<div><div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}><ActionButton onClick={() => setIsFormOpen(false)} style={{ marginRight: 10 }}><FaArrowLeft /> Voltar</ActionButton><h2>{editingId ? "Editar Jogo" : "Novo Jogo"}</h2></div><FormContainer><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}><FormGroup><Label>Time Casa *</Label><Input value={formData.time_casa} onChange={e => setFormData({...formData, time_casa: e.target.value})} /></FormGroup><FormGroup><Label>Time Visitante *</Label><Input value={formData.time_visitante} onChange={e => setFormData({...formData, time_visitante: e.target.value})} /></FormGroup></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}><FormGroup><Label>Data *</Label><Input type="date" value={formData.data_jogo} onChange={e => setFormData({...formData, data_jogo: e.target.value})} /></FormGroup><FormGroup><Label>Horário *</Label><Input type="time" value={formData.horario} onChange={e => setFormData({...formData, horario: e.target.value})} /></FormGroup></div><FormGroup><Label>Estádio *</Label><Select value={formData.id_estadio} onChange={e => setFormData({...formData, id_estadio: e.target.value})}><option value="">Selecione um estádio...</option>{estadios.map(est => (<option key={est.id_estadio || est.id} value={est.id_estadio || est.id}>{est.nome || est.name}</option>))}</Select></FormGroup><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}><FormGroup><Label>Campeonato</Label><Input value={formData.campeonato} onChange={e => setFormData({...formData, campeonato: e.target.value})} /></FormGroup><FormGroup><Label>Rodada</Label><Input type="number" value={formData.rodada} onChange={e => setFormData({...formData, rodada: e.target.value})} /></FormGroup></div><ButtonRow><AddButton onClick={handleSave}><FaSave /> Salvar</AddButton><ActionButton bg="#e74c3c" onClick={() => setIsFormOpen(false)}>Cancelar</ActionButton></ButtonRow></FormContainer></div>); }
  return (<div><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2>Gerenciar Jogos</h2><AddButton onClick={handleNewClick}><FaPlus /> Novo Jogo</AddButton></div>{isLoading ? <p>Carregando...</p> : (<Table><thead><tr><Th>ID</Th><Th>Confronto</Th><Th>Data</Th><Th>Estádio</Th><Th>Ações</Th></tr></thead><tbody>{jogos.map((jogo) => (<tr key={jogo.id}><Td>{jogo.id}</Td><Td>{jogo.time_casa} x {jogo.time_visitante}</Td><Td>{jogo.data_jogo} às {jogo.horario}</Td><Td>{jogo.estadio?.nome}</Td><Td><ActionButton bg="#f39c12" onClick={() => handleEditClick(jogo)}><FaEdit /></ActionButton><ActionButton bg="#e74c3c" onClick={() => handleDelete(jogo.id)}><FaTrash /></ActionButton></Td></tr>))}</tbody></Table>)}</div>);
};

// ... (QuiosquesManager - ATUALIZADO COM TOASTS) ...
const QuiosquesManager = () => {
  const [quiosques, setQuiosques] = useState([]);
  const [estadios, setEstadios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ nome_quiosque: '', slogan: '', localizacao: '', phone: '', email: '', category: '', logo_url: '', menu_link: '', id_estadio: '' });
  
  const fetchData = async () => { try { setIsLoading(true); const [quiosquesRes, estadiosRes] = await Promise.all([ axios.get('http://localhost:8080/api/quiosques'), axios.get('http://localhost:8080/api/estadios') ]); setQuiosques(quiosquesRes.data); setEstadios(estadiosRes.data); } catch (error) { console.error(error); toast.error("Erro ao carregar quiosques."); } finally { setIsLoading(false); } };
  useEffect(() => { fetchData(); }, []);
  const handleNewClick = () => { setEditingId(null); setFormData({ nome_quiosque: '', slogan: '', localizacao: '', phone: '', email: '', category: '', logo_url: '', menu_link: '', id_estadio: '' }); setIsFormOpen(true); };
  const handleEditClick = (kiosk) => { try { setEditingId(kiosk.id); let estadioId = ''; if (kiosk.stadiumShort) { const estadioEncontrado = estadios.find(e => (e.nome || e.name) === kiosk.stadiumShort); estadioId = estadioEncontrado ? (estadioEncontrado.id_estadio || estadioEncontrado.id) : ''; } setFormData({ nome_quiosque: kiosk.name || '', slogan: kiosk.slogan || '', localizacao: kiosk.location || '', phone: kiosk.phone || '', email: kiosk.email || '', category: kiosk.category || '', logo_url: kiosk.logo || '', menu_link: kiosk.menuLink || '', id_estadio: estadioId }); setIsFormOpen(true); } catch (error) { console.error(error); } };
  
  const handleDelete = async (id) => { 
    if (!window.confirm("Apagar este quiosque?")) return; 
    try { await axios.delete(`http://localhost:8080/api/quiosques/${id}`, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); toast.success("Removido!"); fetchData(); } catch (error) { toast.error("Erro ao deletar."); } 
  };
  const handleSave = async () => { 
    if (!formData.nome_quiosque || !formData.localizacao || !formData.id_estadio) return toast.warning("Preencha Nome, Localização e Estádio."); 
    try { 
      if (editingId) { await axios.put(`http://localhost:8080/api/quiosques/${editingId}`, formData, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); toast.success("Quiosque atualizado!"); } 
      else { await axios.post('http://localhost:8080/api/quiosques', formData, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } }); toast.success("Quiosque criado!"); } 
      setIsFormOpen(false); fetchData(); 
    } catch (error) { toast.error("Erro ao salvar."); } 
  };

  if (isFormOpen) { return (<div><div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}><ActionButton onClick={() => setIsFormOpen(false)} style={{ marginRight: 10 }}><FaArrowLeft /> Voltar</ActionButton><h2>{editingId ? "Editar Quiosque" : "Novo Quiosque"}</h2></div><FormContainer><FormGroup><Label>Nome *</Label><Input value={formData.nome_quiosque} onChange={e => setFormData({...formData, nome_quiosque: e.target.value})} /></FormGroup><FormGroup><Label>Slogan</Label><Input value={formData.slogan} onChange={e => setFormData({...formData, slogan: e.target.value})} /></FormGroup><FormGroup><Label>Localização *</Label><Input value={formData.localizacao} onChange={e => setFormData({...formData, localizacao: e.target.value})} /></FormGroup><FormGroup><Label>Estádio *</Label><Select value={formData.id_estadio} onChange={e => setFormData({...formData, id_estadio: e.target.value})}><option value="">Selecione um estádio...</option>{estadios.map(est => (<option key={est.id_estadio || est.id} value={est.id_estadio || est.id}>{est.nome || est.name}</option>))}</Select></FormGroup><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}><FormGroup><Label>Categoria</Label><Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Ex: Fast Food" /></FormGroup><FormGroup><Label>Logo URL</Label><Input value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} /></FormGroup></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}><FormGroup><Label>Telefone</Label><Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></FormGroup><FormGroup><Label>Email</Label><Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></FormGroup></div><ButtonRow><AddButton onClick={handleSave}><FaSave /> Salvar</AddButton><ActionButton bg="#e74c3c" onClick={() => setIsFormOpen(false)}>Cancelar</ActionButton></ButtonRow></FormContainer></div>); }
  return (<div><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2>Gerenciar Quiosques</h2><AddButton onClick={handleNewClick}><FaPlus /> Novo Quiosque</AddButton></div>{isLoading ? <p>Carregando...</p> : (<Table><thead><tr><Th>ID</Th><Th>Nome</Th><Th>Categoria</Th><Th>Estádio</Th><Th>Ações</Th></tr></thead><tbody>{quiosques.map((k) => (<tr key={k.id}><Td>{k.id}</Td><Td>{k.name}</Td><Td>{k.category}</Td><Td>{k.stadiumShort}</Td><Td><ActionButton bg="#f39c12" onClick={() => handleEditClick(k)}><FaEdit /></ActionButton><ActionButton bg="#e74c3c" onClick={() => handleDelete(k.id)}><FaTrash /></ActionButton></Td></tr>))}</tbody></Table>)}</div>);
};

// ... (UsuariosManager - ATUALIZADO COM TOASTS) ...
const UsuariosManager = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingUser, setViewingUser] = useState(null);

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8080/api/usuarios', { headers: { 'Authorization': `Bearer ${token}` } });
      setUsuarios(response.data);
    } catch (error) { console.error(error); toast.error("Erro ao carregar usuários."); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este usuário? Esta ação é irreversível.")) return;
    try {
      const token = getAuthToken();
      await axios.delete(`http://localhost:8080/api/usuarios/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success("Usuário removido.");
      fetchUsuarios();
      if (viewingUser && viewingUser.id === id) setViewingUser(null);
    } catch (error) { toast.error(error.response?.data?.message || "Erro ao excluir."); }
  };

  const handleToggleAdmin = async (id) => {
    if (!window.confirm("Tem certeza que deseja alterar as permissões de administrador deste usuário?")) return;
    try {
      const token = getAuthToken();
      const response = await axios.put(`http://localhost:8080/api/usuarios/${id}/toggle-admin`, {}, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success(response.data.message);
      fetchUsuarios();
      if (viewingUser && viewingUser.id === id) {
        setViewingUser(prev => ({ ...prev, is_admin: !prev.is_admin }));
      }
    } catch (error) { toast.error(error.response?.data?.message || "Erro ao alterar status."); }
  };

  if (viewingUser) {
    return (<div><div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}><ActionButton onClick={() => setViewingUser(null)} style={{ marginRight: 10 }}><FaArrowLeft /> Voltar</ActionButton><h2>Detalhes do Usuário</h2></div><FormContainer><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}><FormGroup><Label>ID</Label><Input value={viewingUser.id} readOnly /></FormGroup><FormGroup><Label>Data Cadastro</Label><Input value={viewingUser.data_cadastro ? new Date(viewingUser.data_cadastro).toLocaleDateString('pt-BR') : '-'} readOnly /></FormGroup></div><FormGroup><Label>Nome</Label><Input value={viewingUser.nome} readOnly /></FormGroup><FormGroup><Label>Email</Label><Input value={viewingUser.email} readOnly /></FormGroup><FormGroup><Label>Status de Administrador</Label><div style={{ padding: '10px', borderRadius: '5px', background: viewingUser.is_admin ? '#d4edda' : '#f8d7da', color: viewingUser.is_admin ? '#155724' : '#721c24', fontWeight: 'bold' }}>{viewingUser.is_admin ? "ESTE USUÁRIO É ADMINISTRADOR" : "USUÁRIO COMUM"}</div></FormGroup><div style={{ marginTop: 30, borderTop: '1px solid #eee', paddingTop: 20 }}><h3 style={{ fontSize: '1.1rem', marginBottom: 15, color: colors.textDarker }}>Ações Administrativas</h3><div style={{ display: 'flex', gap: 15 }}><ActionButton bg={viewingUser.is_admin ? "#95a5a6" : "#3498db"} onClick={() => handleToggleAdmin(viewingUser.id)} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}><FaUserShield /> {viewingUser.is_admin ? "Remover Permissão de Admin" : "Tornar Administrador"}</ActionButton><ActionButton bg="#e74c3c" onClick={() => handleDelete(viewingUser.id)} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8 }}><FaTrash /> Excluir Usuário</ActionButton></div></div></FormContainer></div>);
  }

  return (<div><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2>Gerenciar Usuários</h2></div>{isLoading ? <p>Carregando...</p> : (<Table><thead><tr><Th>ID</Th><Th>Nome</Th><Th>Email</Th><Th>Admin</Th><Th>Ações</Th></tr></thead><tbody>{usuarios.map((user) => (<tr key={user.id}><Td>{user.id}</Td><Td>{user.nome}</Td><Td>{user.email}</Td><Td>{user.is_admin ? (<span style={{ color: 'green', fontWeight: 'bold' }}>SIM</span>) : (<span style={{ color: 'gray' }}>NÃO</span>)}</Td><Td><ActionButton bg="#3498db" onClick={() => setViewingUser(user)} title="Ver Detalhes"><FaEye /></ActionButton><ActionButton bg="#e74c3c" onClick={() => handleDelete(user.id)} title="Excluir Usuário"><FaTrash /></ActionButton></Td></tr>))}</tbody></Table>)}</div>);
};

// === Componente Principal ===
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        let storedUser = localStorage.getItem('loggedUser');
        if (!storedUser) storedUser = sessionStorage.getItem('loggedUser');
        if (!storedUser) { navigate('/login'); return; }
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.is_admin) { 
          toast.error("Acesso negado. Área restrita."); 
          navigate('/'); return; 
        }
        setUser(parsedUser);
      } catch (e) { 
        navigate('/login'); 
      } finally { setIsChecking(false); }
    };
    checkAuth();
  }, [navigate]);

  if (isChecking) return <div style={{padding: 40}}>Verificando...</div>;
  if (!user) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <DashboardHome />;
      case 'estadios': return <EstadiosManager />;
      case 'jogos': return <JogosManager />;
      case 'quiosques': return <QuiosquesManager />;
      case 'usuarios': return <UsuariosManager />;
      default: return null;
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>Painel Admin</SidebarHeader>
        <MenuButton active={activeTab === 'home'} onClick={() => setActiveTab('home')}><FaChartPie /> Visão Geral</MenuButton>
        <MenuButton active={activeTab === 'estadios'} onClick={() => setActiveTab('estadios')}><FaBuilding /> Estádios</MenuButton>
        <MenuButton active={activeTab === 'jogos'} onClick={() => setActiveTab('jogos')}><FaFutbol /> Jogos</MenuButton>
        <MenuButton active={activeTab === 'quiosques'} onClick={() => setActiveTab('quiosques')}><FaStore /> Quiosques</MenuButton>
        <MenuButton active={activeTab === 'usuarios'} onClick={() => setActiveTab('usuarios')}><FaUsers /> Usuários</MenuButton>
        <MenuButton onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.href='/'; }} style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.1)' }}><FaSignOutAlt /> Sair</MenuButton>
      </Sidebar>
      <MainContent>
        <SectionTitle>{activeTab === 'home' ? 'Visão Geral' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</SectionTitle>
        {renderContent()}
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;