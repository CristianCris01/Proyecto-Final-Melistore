import { FaRegHeart } from 'react-icons/fa';
import './Card.css';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { CarritoContext } from '../context/CartContext';



function Card({ product }) {
  const { token } = useContext(UserContext);
const { agregarProducto } = useContext(CarritoContext);
const navigate = useNavigate();

const handleAgregar = async () => {
  if (!token) {
    navigate('/Login');
    return;
  }

  try {
    await agregarProducto(product.id);
  } catch (error) {
    alert(error.message);
  }
};
  return (
    <article className="productItemCard">
      <div className="productItemImage">
        <img src={product.imagen_url} alt={product.titulo} loading="lazy" />
     
        <span className="productItemFavorite" aria-hidden="true">
          <FaRegHeart />
        </span>
      </div>

      <div className="productItemInfo">
      
        <h2>{product.titulo}</h2>
        <p className="productItemDescription">{product.description}</p>
      
         
         
        <div className="productItemBottom">
          <p className="productItemPrice">${product.precio.toLocaleString('es-CL')} <span>CLP</span></p>
          <span className="productItemAvailability">Disponible</span>
          <button className="productItemAdd" type="button" onClick={handleAgregar}>
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
    
  );
};

export default Card;
