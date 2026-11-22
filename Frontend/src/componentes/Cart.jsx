import { useContext, useState } from 'react';
import { CarritoContext } from '../context/CartContext';
import NavBar from './NavBar';
import Footer from './Footer';
import './Productos.css';
import './Cart.css';

const moneda = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' });

export default function Cart() {
  const { items, cambiarCantidad, comprarCarrito } = useContext(CarritoContext);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState('');
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  const ejecutar = async (accion) => {
    setError('');
    setProcesando(true);
    try {
      await accion();
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setProcesando(false);
    }
  };

  const handleComprar = () => ejecutar(async () => {
    await comprarCarrito();
    alert('Gracias por comprar');
  });

  return (
    <>
      <NavBar />
      <main className="productosPage">
        <header className="productosIntro">
          <h1>Carrito</h1>
        </header>
        <section className="cartContenido" aria-label="Productos del carrito">
          {error && <p className="cartError" role="alert">{error}</p>}
          {items.length === 0 ? (
            <p>Tu carrito está vacío.</p>
          ) : (
            <ul className="cartLista">
              {items.map((item) => (
                <li className="cartFila" key={item.id}>
                  <div className="cartProducto">
                    <img src={item.imagen_url} alt="" loading="lazy" />
                    <strong>{item.titulo}</strong>
                  </div>
                  <div className="cartImporte">
                    <small>Precio unitario</small>
                    {moneda.format(item.precio)}
                  </div>
                  <div className="cartCantidad">
                    <button
                      type="button"
                      aria-label={`Bajar cantidad de ${item.titulo}`}
                      disabled={procesando || item.cantidad <= 1}
                      onClick={() => ejecutar(() => cambiarCantidad(item.id, -1))}
                    >−</button>
                    <span aria-live="polite">{item.cantidad}</span>
                    <button
                      type="button"
                      aria-label={`Sumar cantidad de ${item.titulo}`}
                      disabled={procesando}
                      onClick={() => ejecutar(() => cambiarCantidad(item.id, 1))}
                    >+</button>
                  </div>
                  <div className="cartImporte cartSubtotal">
                    <small>Subtotal</small>
                    <strong>{moneda.format(item.precio * item.cantidad)}</strong>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="cartResumen">
            <div className="cartImporte">
              <small>Total</small>
              <strong>{moneda.format(total)}</strong>
            </div>
            <button
              className="cartCompra"
              type="button"
              disabled={procesando || items.length === 0}
              onClick={handleComprar}
            >
              Finalizar compra
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
