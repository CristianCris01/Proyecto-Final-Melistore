import './App.css'
import Home from './views/Home'
import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import ProductosView from '../src/views/ProductosView';
import { UserContext } from './context/UserContext';
import GestionProductosView from './views/GestionProductosView';







function App() {
  const {token} = useContext(UserContext);
  return (
    
    
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/Login" element={<LoginView/>} />
      <Route path="/Register" element={<RegisterView/>} />
      <Route path="/Productos" element={<ProductosView/>} />
      <Route path="/GestionProductosView" element={ token ? <GestionProductosView/> : <Navigate to="/Login" replace />}/>
    



    </Routes>
    
  )
}

export default App
