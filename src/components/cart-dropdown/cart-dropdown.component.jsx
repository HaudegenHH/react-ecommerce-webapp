import { useContext } from 'react';

// import { CartContext } from '../../contexts/cart.context';

import Button from '../button/button.component';
// import CartItem from '../cart-item/cart-item.component';

import './cart-dropdown.styles.scss';

const CartDropdown = () => {
//   const { cartItems } = useContext(CartContext);

  return (
    <div className='cart-dropdown-container'>
      <div className='cart-items'>
        
      </div>
      <Button>CHECKOUT</Button>
    </div>
  );
};

export default CartDropdown;