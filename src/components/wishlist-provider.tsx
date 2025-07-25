"use client";

import { useReducer, useCallback, useEffect } from "react";
import type { Product } from "@/lib/products";
import { WishlistContext, wishlistReducer, initialState, type WishlistState } from "@/hooks/use-wishlist";
import { useUser } from '@/hooks/use-user';

// Load wishlist from localStorage
const loadWishlistFromStorage = (): WishlistState => {
  if (typeof window === 'undefined') return initialState;
  try {
    const saved = localStorage.getItem('retag-wishlist');
    return saved ? JSON.parse(saved) : initialState;
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return initialState;
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist: WishlistState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('retag-wishlist', JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const userKey = user?.email || user?.id || 'guest';
  const storageKey = `retag-wishlist-${userKey}`;

  const loadWishlistFromStorage = (): WishlistState => {
    if (typeof window === 'undefined') return initialState;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : initialState;
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return initialState;
    }
  };

  const saveWishlistToStorage = (wishlist: WishlistState) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  const [state, dispatch] = useReducer(wishlistReducer, loadWishlistFromStorage());

  useEffect(() => {
    saveWishlistToStorage(state);
  }, [state, storageKey]);

  useEffect(() => {
    // Clear wishlist on logout
    if (!user) {
      dispatch({ type: 'CLEAR_WISHLIST' });
      localStorage.removeItem(storageKey);
    }
  }, [user]);

  const addToWishlist = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    console.log('WishlistProvider: Removing item with ID:', productId);
    console.log('Current wishlist items:', state.items.map(item => item.id));
    dispatch({ type: "REMOVE_ITEM", payload: productId });
    console.log('Dispatch called for REMOVE_ITEM');
  }, [state.items]);
  
  const isItemInWishlist = useCallback((productId: string) => {
    const result = state.items.some((item) => item.id === productId);
    console.log('isItemInWishlist check for ID:', productId, 'Result:', result, 'Current items:', state.items.map(item => item.id));
    return result;
  }, [state.items]);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        addToWishlist,
        removeFromWishlist,
        isItemInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
