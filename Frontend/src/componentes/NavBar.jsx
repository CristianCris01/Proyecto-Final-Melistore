import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/Logo2.png';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { CarritoContext } from '../context/CartContext';

function NavBar() {
  const { items } = useContext(CarritoContext);
  const { token, logout } = useContext(UserContext);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0);
  const cerrarMenu = () => setMenuAbierto(false);

  const cerrarSesion = () => {
    cerrarMenu();
    logout();
  };

  return (
    <Navbar className="barra-navegacion" expand="lg" expanded={menuAbierto} onToggle={setMenuAbierto}>
      <div className="barra-contenido">
        <Navbar.Brand as={Link} to="/" onClick={cerrarMenu} className="marca-nav">
          <img className="logo-nav" src={Logo} alt="Meli" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-principal" aria-label="Abrir o cerrar menu" className="boton-menu" />
        <Navbar.Collapse id="menu-principal" className="menu-desplegable">
          <nav className="enlaces-menu" aria-label="Menu principal">
            {!token && <Link to="/Login" onClick={cerrarMenu}>Iniciar sesión</Link>}
            {!token && <Link to="/Register" onClick={cerrarMenu}>Registro</Link>}
            <Link to="/Productos" onClick={cerrarMenu}>Productos</Link>
            {token && <Link to="/GestionProductosView" onClick={cerrarMenu}>Agregar</Link>}
            <a href="#contacto" onClick={cerrarMenu}>Contacto</a>
            {token && <button type="button" onClick={cerrarSesion}>Cerrar sesión</button>}
          </nav>
        </Navbar.Collapse>

        <div className="acciones-nav">
          <span className="searchIcon" aria-hidden="true"></span>
          <Link to="/carrito" onClick={cerrarMenu} className="bagIcon" aria-label={`Carrito, ${cantidadTotal} unidades`}>
            <span className="bagCount" aria-hidden="true">{cantidadTotal}</span>
          </Link>
        </div>
      </div>
    </Navbar>
  );
}

export default NavBar;
