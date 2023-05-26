import { useContext } from 'react';

import { CartContext } from '../../contexts/cart.context';

import Button from '../button/button.component';
import './product-card.styles.scss';

const ProductCard = ({ product }) => {
    const { name, price, imageUrl } = product;
    const { addItemToCart } = useContext(CartContext);
  
    // easier to read and later on: easier to optimize if you
    // separate this fn here (instead of the anonym. fn commented out below)
    const addProductToCart = () => addItemToCart(product);
  
    return (
      <div className='product-card-container'>
        <img src={imageUrl} alt={`${name}`} />
        <div className='footer'>
          <span className='name'>{name}</span>
          <span className='price'>{price}</span>
        </div>
        {/*<Button buttonType='inverted' onClick={() => addItemToCart(product)}>
          Add to card
        </Button>*/}
        <Button buttonType='inverted' onClick={addProductToCart}>
          Add to card
        </Button>
      </div>
    );
  };

export default ProductCard;