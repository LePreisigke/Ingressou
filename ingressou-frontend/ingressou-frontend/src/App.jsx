// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Stadiums from './pages/Stadiums';
import BuyTicket from './pages/BuyTicket';
import StadiumMap from './pages/StadiumMap';
import Cart from './pages/Cart';
import Kiosks from './pages/Kiosks';
import Auth from './pages/Auth';
import KioskMenus from './pages/KioskMenus';
import Checkout from './pages/Checkout';
import PurchaseSuccess from './pages/PurchaseSuccess';
import AdminDashboard from './pages/AdminDashboard';

// ⬇️ ADICIONE ESTE IMPORT
import Profile from './pages/Profile';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Layout>
      {/* --- MUDANÇA 2: O Container fica aqui, disponível p/ todo o app --- */}
      <ToastContainer 
        position="top-right"
        autoClose={3000} // Fecha em 3 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // Fica bonito com cores sólidas (Verde/Vermelho)
      />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingressos" element={<Tickets />} />
        <Route path="/estadios" element={<Stadiums />} />
        <Route path="/estadios/mapa/:stadiumSlug" element={<StadiumMap />} />
        <Route path="/quiosques" element={<Kiosks />} />
        <Route path="/quiosques/cardapios/:id" element={<KioskMenus />} />
        <Route path="/ingressos/comprar/:id" element={<BuyTicket />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/finalizar/sucesso" element={<PurchaseSuccess />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;