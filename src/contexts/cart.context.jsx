import { createContext, useState, useEffect } from 'react';

/*
product:
{ id, name, price, imageUrl }  

cartItem:
{ id, name, price, imageUrl, quantity }  
*/

export const addCartItem = (cartItems, productToAdd) => {

  // check if cartItems contains productToAdd
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === productToAdd.id
  );

  
  if (existingCartItem) {
    return cartItems.map((cartItem) =>
      cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
  }

  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  cartCount: 0,
  countCartItems: () => {},
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // every time cartItems changes, the useEffect should run and 
  // recalculate the cartCount
  useEffect(() => {
    const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    setCartCount(newCartCount);
  }, [cartItems])
  
  // you could simply use a fn as well instead of useEffect
  // const countCartItems = () => {
  //   return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  // }

  const addItemToCart = (product) =>
    setCartItems(addCartItem(cartItems, product));

  const value = { isCartOpen, setIsCartOpen, cartItems, addItemToCart, cartCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};