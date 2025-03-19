// This is a temporary file to verify imports
import { useCart, CartProvider } from '@/context/CartContext';

export const testCartContext = () => {
  // This function does nothing, it's just to verify the imports work
  console.log('Cart imports verified:', useCart, CartProvider);
}; 