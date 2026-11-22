import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserProvider from './context/UserContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import CarritoProvider from './context/CartContext.jsx';
import { UserContext } from './context/UserContext.jsx';

function AppConCarrito() {
  const { token } = useContext(UserContext);

  return (
    <CarritoProvider key={token || 'sin-sesion'}>
      <App />
    </CarritoProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <AppConCarrito />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
