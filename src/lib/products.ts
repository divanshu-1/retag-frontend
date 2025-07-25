
export type Category = 'Women' | 'Men' | 'Kids';

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string; // Sub-category
  mainCategory: Category;
  price: string;
  originalPrice: string;
  condition: string;
  images: string[];
  imageHints: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
};

export const products: Product[] = [

];
    