import { API_URL } from '../api';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

export const CarritoContext = createContext();


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

  const cambiarCantidad = async (itemId, cambio) => {
    const respuesta = await fetch(`${API_URL}/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cambio }),
    });

    if (!respuesta.ok) throw new Error('No se pudo cambiar la cantidad');

    const actualizado = await respuesta.json();
    setItems((actuales) => actuales.map((item) => (
      item.id === actualizado.id ? { ...item, cantidad: actualizado.cantidad } : item
    )));
  };

  const comprarCarrito = async () => {
    const respuesta = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!respuesta.ok) {
      const datos = await respuesta.json().catch(() => null);
      throw new Error(datos?.error || 'No se pudo finalizar la compra');
    }

    const { items_comprados } = await respuesta.json();
    setItems((actuales) => actuales.filter((item) => !items_comprados.includes(item.id)));
  };

  return (
    <CarritoContext.Provider value={{ items, agregarProducto, cambiarCantidad, comprarCarrito }}>
      {children}
    </CarritoContext.Provider>
  );
}
