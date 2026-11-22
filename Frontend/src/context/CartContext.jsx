import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

export const CarritoContext = createContext();

const API_URL = 'http://localhost:3000';

export default function CarritoProvider({ children }) {
  const { token } = useContext(UserContext);
  const [items, setItems] = useState([]);

  const cargarCarrito = useCallback(async (signal) => {
    const respuesta = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo cargar el carrito');
    }

    const datos = await respuesta.json();
    setItems(datos);
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const controller = new AbortController();

    cargarCarrito(controller.signal).catch((error) => {
      if (error.name !== 'AbortError') {
        console.error(error);
      }
    });

    return () => controller.abort();
  }, [token, cargarCarrito]);

  const agregarProducto = async (productoId) => {
    const respuesta = await fetch(`${API_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ publication_id: productoId }),
    });

    if (!respuesta.ok) {
      throw new Error('No se pudo agregar el producto');
    }

    await cargarCarrito();
  };

  return (
    <CarritoContext.Provider value={{ items, agregarProducto }}>
      {children}
    </CarritoContext.Provider>
  );
}