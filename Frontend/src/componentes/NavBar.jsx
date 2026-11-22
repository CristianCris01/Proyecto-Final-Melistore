import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/Logo2.png';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';



function NavBar() {
  
  const {token, logout} = useContext(UserContext)
  return (
    <Navbar className="NavBar" expand="lg">
      <div className="NavBarInner">
        <Navbar.Brand className="brandLogo">
          <a href='/'>
          <img className="ImgLogo" src={Logo} alt="Meli"/>
          </a>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" className="menuToggle" />
        <Navbar.Collapse id="main-navbar" className="menuCollapse">
          <nav className="navLinks" aria-label="Menu principal">
            {!token && <Link to="/Login">Iniciar sesion</Link>}
            {!token && <Link to="/Register">Registro</Link>}
            <Link to="/Productos">Productos</Link>
            {token && <Link to="/GestionProductosView">Agregar</Link>}
            <Link to="#contacto">Contacto</Link>
            {token && <Link onClick={()=>logout()}  to="#contacto">Cerrar Sesion</Link>}

          </nav>
        </Navbar.Collapse>

        <div className="navActions" aria-hidden="true">
          <span className="searchIcon"></span>
          <span className="bagIcon">
            <span className="bagCount">0</span>
          </span>
        </div>
      </div>
    </Navbar>
  );
}

export default NavBar;
