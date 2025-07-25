"use client";

import { useReducer, useEffect, useState, useCallback } from "react";
import { CartContext, cartReducer, initialState, type CartState } from "@/hooks/use-cart";
import { useUser } from '@/hooks/use-user';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const userKey = user?.email || user?.id || 'guest';
  const storageKey = `retag-cart-${userKey}`;
  const [isInitialized, setIsInitialized] = useState(false);

  const loadCartFromStorage = (): CartState => {
    if (typeof window === 'undefined') return initialState;
    try {
      const savedCart = localStorage.getItem(storageKey);
      return savedCart ? JSON.parse(savedCart) : initialState;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return initialState;
    }
  };

  const saveCartToStorage = (cart: CartState) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart from localStorage on mount and user change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = loadCartFromStorage();
      if (savedCart.items.length > 0 || !isInitialized) {
        dispatch({ type: "LOAD_CART", payload: savedCart });
        setIsInitialized(true);
      }
    }
  }, [storageKey]);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(state);
    }
  }, [state, storageKey, isInitialized]);

  // Clear cart on logout (when user becomes null after being logged in)
  useEffect(() => {
    if (!user && isInitialized) {
      dispatch({ type: "CLEAR_CART" });
      // Clear all user-specific cart data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
      }
    }
  }, [user, storageKey, isInitialized]);

  const addToCart = useCallback((product: any) => {
    console.log('Adding to cart:', product);
    // In our marketplace, each product has only 1 quantity
    // The reducer will handle duplicate prevention
    dispatch({ type: "ADD_ITEM", payload: product });
    console.log('Cart state after add:', state.items);
  }, [state.items]);

  const removeFromCart = useCallback((itemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: itemId });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    // Quantity updates are not supported in our marketplace
    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_ITEM", payload: itemId });
    }
    // Otherwise, do nothing as quantity is always 1
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
