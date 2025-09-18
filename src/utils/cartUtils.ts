import { CartItem } from '../context/CartContext';


export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

export const calculateGst = (subtotal: number, gstRate = 0.18): number => {
  return subtotal * gstRate;
};

export const calculateShipping = (subtotal: number, freeShippingThreshold = 1000, shippingCost = 99): number => {
  return subtotal >= freeShippingThreshold ? 0 : shippingCost;
};

export const calculateTotal = (items: CartItem[]): { subtotal: number; gst: number; shipping: number; total: number } => {
  const subtotal = calculateCartTotal(items);
  const gst = calculateGst(subtotal);
  const shipping = calculateShipping(subtotal);
  
  return {
    subtotal,
    gst,
    shipping,
    total: subtotal + gst + shipping
  };
};
