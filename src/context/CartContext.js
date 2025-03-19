import { createContext, useContext, useReducer } from 'react';

// Create Cart Context
const CartContext = createContext();

// Initial state
const initialState = {
  items: [],
  total: 0
};

// Reducer for cart actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        
        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.price
        };
      } else {
        // Add new item with quantity 1
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
          total: state.total + action.payload.price
        };
      }
      
    case 'REMOVE_ITEM':
      const updatedItems = state.items.filter(item => item.id !== action.payload.id);
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
      
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: action.payload.quantity } 
            : item
        ),
        total: state.items.reduce((total, item) => 
          total + (item.id === action.payload.id 
            ? item.price * action.payload.quantity 
            : item.price * item.quantity), 0)
      };
      
    case 'CLEAR_CART':
      return initialState;
      
    default:
      return state;
  }
};

// CartProvider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Utility functions
  const addToCart = (item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeFromCart = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart: state.items, 
      cartCount: getItemCount(),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.warn('useCart must be used within a CartProvider');
    // Return a dummy implementation so the app doesn't crash
    return { 
      cart: [], 
      cartCount: 0,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getItemCount: () => 0
    };
  }
  return context;
};

// Default export for easier importing
export default useCart; 