/**
 * Shopping Cart Hook for ReTag Marketplace
 *
 * This hook provides cart functionality for the marketplace including:
 * - Adding/removing items from cart
 * - Persistent cart state using localStorage
 * - Cart item management with unique IDs
 * - Integration with checkout process
 *
 * Note: In this marketplace, each item has a quantity of 1 since
 * we're dealing with unique second-hand items.
 *
 * @author ReTag Team
 */

"use client";

import type { Product } from "@/lib/products";
import { createContext, useContext } from "react";

/**
 * Generate unique cart item ID
 * Creates a unique identifier for each cart item to handle duplicates
 *
 * @returns Unique cart item ID string
 */
const generateCartItemId = () => `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Cart Item Type
 * Extends Product with cart-specific properties
 */
export type CartItem = Product & {
  quantity: number;     // Always 1 for our marketplace (unique items)
  cartItemId: string;   // Unique identifier for cart management
};

/**
 * Cart State Interface
 * Defines the structure of cart state
 */
export interface CartState {
  items: CartItem[];    // Array of items in the cart
}

/**
 * Cart Action Types
 * Defines all possible cart actions for the reducer
 */
export type CartAction =
  | { type: "ADD_ITEM"; payload: Product }                                    // Add new item to cart
  | { type: "REMOVE_ITEM"; payload: string }                                  // Remove item by ID
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } } // Update item quantity
  | { type: "CLEAR_CART" }                                                    // Clear all items
  | { type: "LOAD_CART"; payload: CartState };                               // Load cart from storage

/**
 * Initial Cart State
 * Default empty cart state
 */
export const initialState: CartState = {
  items: [],
};

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      // Check if item already exists in cart (prevent duplicates since quantity is always 1)
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        // Item already in cart, don't add duplicate
        return state;
      }

      const newItem = { ...action.payload, quantity: 1, cartItemId: generateCartItemId() };
      return {
        ...state,
        items: [...state.items, newItem],
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.cartItemId !== action.payload),
      };
    case "UPDATE_QUANTITY":
      // Quantity updates are not supported in our marketplace
      // This case is kept for compatibility but does nothing
      return state;
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
};

export const CartContext = createContext<{
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
