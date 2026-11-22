import { FaRegHeart } from 'react-icons/fa';
import './Card.css';

function Card({ product }) {
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
      
         
         
        </div>
        <div className="productItemBottom">
          <p className="productItemPrice">${product.precio.toLocaleString('es-CL')} <span>CLP</span></p>
          <span className="productItemAvailability">Disponible</span>
        </div>
    </article>
    
  );
};

export default Card;
