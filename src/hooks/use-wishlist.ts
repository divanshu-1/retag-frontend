"use client";

import type { Product } from "@/lib/products";
import { createContext, useContext } from "react";

export type WishlistState = {
  items: Product[];
};

export type WishlistAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_WISHLIST" };

export const initialState: WishlistState = {
  items: [],
};

export const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM":
      console.log('WishlistReducer: Removing item with ID:', action.payload);
      console.log('Items before removal:', state.items.map(item => item.id));
      const filteredItems = state.items.filter((item) => item.id !== action.payload);
      console.log('Items after removal:', filteredItems.map(item => item.id));
      return {
        ...state,
        items: filteredItems,
      };
    case "CLEAR_WISHLIST":
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

export const WishlistContext = createContext<{
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  isItemInWishlist: (id: string) => boolean;
} | null>(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
