/**
 * Utility Functions for ReTag Marketplace
 *
 * This module contains common utility functions used throughout the application.
 * Currently includes className merging utilities for Tailwind CSS.
 *
 * @author ReTag Team
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Conditional className utility function
 *
 * Combines clsx for conditional classes with tailwind-merge for
 * intelligent Tailwind CSS class merging. This prevents conflicts
 * when multiple Tailwind classes target the same CSS property.
 *
 * Example:
 * cn("px-2 py-1", condition && "px-4", "text-red-500")
 *
 * @param inputs - Array of class values (strings, objects, arrays)
 * @returns Merged and deduplicated className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
