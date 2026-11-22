import { useContext } from 'react';
import { CarritoContext } from '../context/CartContext';
import NavBar from './NavBar';
import Footer from './Footer';
import './Productos.css';

export default function Cart() {
  const { items } = useContext(CarritoContext);

  return (
    <>
      <NavBar />
      <main className="productosPage">
        <header className="productosIntro">
          <h1>Carrito</h1>
        </header>
        <section className="productosCatalog" aria-label="Productos del carrito">
          {items.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>{item.titulo} · Cantidad: {item.cantidad}</li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
