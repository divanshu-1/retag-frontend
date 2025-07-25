/**
 * Utility functions for generating default product colors
 * Used when backend doesn't provide color information
 */

export interface ProductColor {
  name: string;
  hex: string;
}

// Color name to hex mapping for AI-detected colors
const COLOR_HEX_MAP: { [key: string]: string } = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Gray': '#6B7280',
  'Red': '#EF4444',
  'Blue': '#3B82F6',
  'Navy': '#1E3A8A',
  'Green': '#10B981',
  'Yellow': '#F59E0B',
  'Orange': '#F97316',
  'Purple': '#8B5CF6',
  'Pink': '#EC4899',
  'Brown': '#92400E',
  'Beige': '#D2B48C',
  'Khaki': '#BDB76B'
};

/**
 * Get hex color code for a color name
 * @param colorName The name of the color
 * @returns Hex color code
 */
export function getColorHex(colorName: string): string {
  return COLOR_HEX_MAP[colorName] || '#6B7280'; // Default to gray if color not found
}

/**
 * Generate default colors based on product category
 * @param category Product category (Tops, Bottoms, etc.)
 * @param article Product article type (optional, for future use)
 * @param brand Product brand (optional, for future use)
 * @returns Array of color objects with name and hex values
 */
export function generateDefaultColors(
  category: string, 
  article?: string, 
  brand?: string
): ProductColor[] {
  const colorSets = {
    // Clothing colors
    'Tops': [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Gray', hex: '#6B7280' }
    ],
    'Bottoms': [
      { name: 'Blue Denim', hex: '#4F46E5' },
      { name: 'Black', hex: '#000000' },
      { name: 'Khaki', hex: '#92400E' },
      { name: 'Gray', hex: '#6B7280' }
    ],
    'Dresses': [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Burgundy', hex: '#7C2D12' },
      { name: 'Floral', hex: '#EC4899' }
    ],
    'Footwear': [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Tan', hex: '#D97706' }
    ],
    'Accessories': [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'Silver', hex: '#9CA3AF' },
      { name: 'Gold', hex: '#F59E0B' }
    ],
    'Bags': [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'Tan', hex: '#D97706' },
      { name: 'Navy', hex: '#1E3A8A' }
    ],
    'Jewelry': [
      { name: 'Gold', hex: '#F59E0B' },
      { name: 'Silver', hex: '#9CA3AF' },
      { name: 'Rose Gold', hex: '#F97316' },
      { name: 'Black', hex: '#000000' }
    ],
    'Activewear': [
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    'Formal': [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    'Casual': [
      { name: 'Blue', hex: '#3B82F6' },
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6B7280' }
    ],
    'Outerwear': [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'Gray', hex: '#6B7280' }
    ]
  };

  // Get colors for category, fallback to general colors
  const categoryColors = colorSets[category as keyof typeof colorSets] || [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Navy', hex: '#1E3A8A' }
  ];

  // Return 1-3 colors randomly for variety
  const numColors = Math.floor(Math.random() * 3) + 1;
  return categoryColors.slice(0, numColors);
}

/**
 * Get a consistent set of colors for a specific product ID
 * This ensures the same product always shows the same colors
 * @param productId Unique product identifier
 * @param category Product category
 * @param article Product article type (optional)
 * @param brand Product brand (optional)
 * @returns Array of color objects
 */
export function getConsistentColors(
  productId: string,
  category: string,
  article?: string,
  brand?: string
): ProductColor[] {
  // Use product ID to seed the random selection for consistency
  const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const numColors = (seed % 3) + 1; // 1-3 colors based on product ID
  
  const colorSets = {
    'Tops': [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Gray', hex: '#6B7280' }
    ],
    'Bottoms': [
      { name: 'Blue Denim', hex: '#4F46E5' },
      { name: 'Black', hex: '#000000' },
      { name: 'Khaki', hex: '#92400E' },
      { name: 'Gray', hex: '#6B7280' }
    ],
    'Dresses': [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Burgundy', hex: '#7C2D12' },
      { name: 'Floral', hex: '#EC4899' }
    ],
    'Footwear': [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Tan', hex: '#D97706' }
    ],
    'Accessories': [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'Silver', hex: '#9CA3AF' },
      { name: 'Gold', hex: '#F59E0B' }
    ],
    'Bags': [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'Tan', hex: '#D97706' },
      { name: 'Navy', hex: '#1E3A8A' }
    ],
    'Jewelry': [
      { name: 'Gold', hex: '#F59E0B' },
      { name: 'Silver', hex: '#9CA3AF' },
      { name: 'Rose Gold', hex: '#F97316' },
      { name: 'Black', hex: '#000000' }
    ],
    'Activewear': [
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    'Formal': [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Gray', hex: '#6B7280' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    'Casual': [
      { name: 'Blue', hex: '#3B82F6' },
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Gray', hex: '#6B7280' }
    ],
    'Outerwear': [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1E3A8A' },
      { name: 'Brown', hex: '#92400E' },
      { name: 'Gray', hex: '#6B7280' }
    ]
  };

  // Get colors for category, fallback to general colors
  const categoryColors = colorSets[category as keyof typeof colorSets] || [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Navy', hex: '#1E3A8A' }
  ];

  return categoryColors.slice(0, numColors);
}
