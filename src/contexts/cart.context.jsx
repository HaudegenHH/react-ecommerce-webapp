import { createContext, useReducer } from 'react';

import { createAction } from '../utils/reducer/reducer.utils';

export const addCartItem = (cartItems, productToAdd) => {

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

const removeCartItem = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );
  
  // check if quantity is equal to 1, if it is remove that item from the cart
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }

  // return back cartitems with matching cart item with reduced quantity
  return cartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);


/* ------------------------- CartContext --------------------------- */

export const CartContext = createContext({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
});

const INITIAL_STATE = {
  isCartOpen: false,
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
}

const CART_ACTION_TYPES = {
  SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
}

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch(type) {
    case CART_ACTION_TYPES.SET_CART_ITEMS:
      return {
        ...state,
        ...payload
      }
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
      return {
        ...state,
        isCartOpen: payload 
      }
    default:
      throw new Error(`Unhandled type of ${type} in cartReducer`);
  }
}

/* ------------------------- CartProvider --------------------------- */

export const CartProvider = ({ children }) => {
  const [ { cartItems, cartCount, cartTotal, isCartOpen }, dispatch ]   = useReducer(cartReducer, INITIAL_STATE);

  const updateCartItemsReducer = (newCartItems) => {
    /* 
    By separating out this fn will allow to dispatch the appropriate payload, 
    so that you can update the reducer with the correct value.
    in the end of this fn you have to:
    dispatch an action object with a payload like:

    { 
      cartItems: newCartItems, 
      cartCount: newCartCount, 
      cartTotal: newCartTotal
    } 
    
    So based on the newCartItems you need to write 2 fn, which re-calculate
    the new cartCount and the new cartTotal: 
    */

    const newCartCount = newCartItems.reduce((total, cartItem) => 
      total + cartItem.quantity, 0
    );
    const newCartTotal = newCartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );

    dispatch(
      createAction(
        CART_ACTION_TYPES.SET_CART_ITEMS,
        {
          newCartItems,      
          cartCount: newCartCount,
          cartTotal: newCartTotal
        }
      )
    );
  }

  /*  "action" creator functions */
  // where you utilize the helper function (addCartItem, removeCartItem, clearCartItem)
  // from which you know that they all return the newCartItems object
  // and can then be passed to the reducer via updateCartItemsReducer fn or rather
  // the dispatch fn (which dispatches an action object to the reducer)

  const addItemToCart = (product) => {
    const newCartItems = addCartItem(cartItems, product);
    updateCartItemsReducer(newCartItems);
  }  

  const removeItemToCart = (cartItemToRemove) => {
    const newCartItems = removeCartItem(cartItems, cartItemToRemove);
    updateCartItemsReducer(newCartItems);
  };
  
  const clearItemFromCart = (cartItemToClear) => {
    const newCartItems = clearCartItem(cartItems, cartItemToClear);
    updateCartItemsReducer(newCartItems);
  };

  const setIsCartOpen = (bool) => {
    dispatch(
      createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool)
    );
  }

  /*  ------------------------------ */
  
  const value = { 
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemToCart,
    clearItemFromCart,
    cartItems,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;

};

/* 
Migrate over from using useState and useEffect to useReducer

The initial situation with context is that you have inside of the CartProvider
4 different useStates, that track 4 individual values, that is then read from the 
CartContext. (cartItems, cartCount, cartTotal, isCartOpen)

Additionally what i ve determined is that i am exporting out from this CartContext 
different methods (like addItemToCart, removeItemToCart, etc), that you can fire
in order to update the current cartItems. And whenever these get updated you also
derive newCartCount and newCartTotal and set them with their setter functions.

Instead with a Reducer you want to extrapolate out these 4 readable values into a 
reducer, because reducers only store readable values. 

First thing when migrating the code is to think about the shape of the final output.
And the easiest way to do that is to create 
- the INITIAL_STATE object first, which includes all the readable values that you 
currently have in your CartContext

- 2nd step is to create the cartReducer, which is a fn that gets the (prev) state 
as well as the action object
- and after destructuring the action you can determine what needs to be returned as
the updated state based on action.type and action.payload
- inside the switch case you can boilerplate the default case with throwing an 
error which tells what type it is and where its thrown
- and then you need to think about all the possible cases..
- BUT there is a very important destinction about the reducer and a best practice 
as well: Your Reducer should not handle any business logic!
meaning that: the payload that gets passed into should already be whatever you need
to update. So you want to dispatch an action that already includes all of the values
that it needs.

note: createAction is just a helper fn to shorten a bit the code and to point out, 
that the dispatch fn creates an action (with the type as the 1st and payload as 2nd
argument)

*/