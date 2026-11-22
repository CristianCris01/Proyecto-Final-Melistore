import { useEffect, useState } from "react";
import '../componentes/GestionProductos.css';

  const inicialForm = {
         titulo: '',
        description: '',
        precio: '',
        imagen_url: '',
    }

export default function GestionProductosView() {
    const [productos, setProductos] = useState([]);
    const [formData, setFormData] = useState(inicialForm)

  

    const url = "https://backend-r0ho.onrender.com"
    const cargarProductos = async () => {
        try{
            const respuesta = await fetch(url);
            if(!respuesta.ok) throw new Error ('Error al cargar los productos')
            const data = await respuesta.json();
            setProductos(data)

        }
        catch (error){
            console.error(error)
        }

    }

   

 useEffect(() => {
    cargarProductos();
}, [])


const handleChange = (event) => {

    const {name, value } = event.target;
    setFormData(anterior => ({...anterior, [name]: value}));
};

const handleCrearProducto = async (event) => {
    event.preventDefault();
    const precio = Number(formData.precio);

    if(!formData.titulo.trim() || !formData.description.trim() || !Number.isInteger(precio) || precio <= 0  || !formData.imagen_url.trim()){
        alert('Por favor rellena todos los campos');
        return;
    }


    const token = localStorage.getItem('token');
    const nuevoProducto = {...formData, precio }
    try{
        const respuesta = await fetch(url,{
            method:'POST',
            headers:{'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`},
            body: JSON.stringify(nuevoProducto),
            });
        

        if(respuesta.ok){
            setFormData(inicialForm);
            cargarProductos();
        }
        else{
            alert('Error a crear los productos. Inicia Sesion')
        }
        
    }catch (error){
        console.error('Error en POST: ', error)
    };

};

const handleEliminarProducto = async (id) => {
    const token = localStorage.getItem('token');
    try{
        const respuesta = await fetch(`${url}/${id}`, {
            method:'DELETE',
            headers:{Authorization: `Bearer ${token}`},
        });

        if(respuesta.status === (204)){
            cargarProductos();
        }
        else{
            alert('No se pudo eliminar el producto');
        }
    }
    catch (error){
        console.error('Error en DELETE: ', error);
    };
};

return (
    <div className="gestion-productos">
      <h2>Gestión de Productos</h2>

   
      <form onSubmit={handleCrearProducto}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Descripción:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>URL de Imagen:</label>
          <input
            type="text"
            name="imagen_url"
            value={formData.imagen_url}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Crear Producto</button>
      </form>

      <hr />

      <h3>Productos Existentes ({productos.length})</h3>
      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            <strong>{producto.titulo}</strong> - ${producto.precio}
            <button onClick={() => handleEliminarProducto(producto.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};