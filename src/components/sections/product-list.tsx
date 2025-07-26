
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Category, Product } from '@/lib/products';
import Breadcrumb from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ProductCard from '@/components/product-card';
import type { View } from '@/app/page';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUser } from '@/hooks/use-user';
import { apiRequest } from '@/lib/api';
import { getConsistentColors, getColorHex } from '@/lib/product-colors';
import { getBackendUrl } from '@/lib/backend-url';

const FilterSidebar = ({ 
  products,
  onFilterChange,
  isMobile,
  closeSheet
}: { 
  products: Product[], 
  onFilterChange: (filters: any) => void,
  isMobile?: boolean,
  closeSheet?: () => void
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);

  const availableSubCategories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const availableSizes = useMemo(() => [...new Set(products.flatMap(p => p.sizes))], [products]);
  const availableBrands = useMemo(() => [...new Set(products.map(p => p.brand))], [products]);

  const handleFilterChange = (filterType: string, value: string) => {
    let newFilters = {};
    if (filterType === 'category') {
      const newSelected = selectedCategories.includes(value)
        ? selectedCategories.filter(c => c !== value)
        : [...selectedCategories, value];
      setSelectedCategories(newSelected);
      newFilters = { categories: newSelected, sizes: selectedSizes, brands: selectedBrands, priceRange };
    } else if (filterType === 'size') {
      const newSelected = selectedSizes.includes(value)
        ? selectedSizes.filter(s => s !== value)
        : [...selectedSizes, value];
      setSelectedSizes(newSelected);
      newFilters = { categories: selectedCategories, sizes: newSelected, brands: selectedBrands, priceRange };
    } else if (filterType === 'brand') {
      const newSelected = selectedBrands.includes(value)
        ? selectedBrands.filter(b => b !== value)
        : [...selectedBrands, value];
      setSelectedBrands(newSelected);
      newFilters = { categories: selectedCategories, sizes: selectedSizes, brands: newSelected, priceRange };
    }
    onFilterChange(newFilters);
  };
  
  const handlePriceChange = (newRange: number[]) => {
    setPriceRange(newRange);
    onFilterChange({ categories: selectedCategories, sizes: selectedSizes, brands: selectedBrands, priceRange: newRange });
  }

  const applyFilters = () => {
    onFilterChange({ categories: selectedCategories, sizes: selectedSizes, brands: selectedBrands, priceRange });
    closeSheet?.();
  };
  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedBrands([]);
    setPriceRange([0, 5000]);
    onFilterChange({ categories: [], sizes: [], brands: [], priceRange: [0, 5000] });
  }

  return (
    <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 px-1 lg:px-0">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
        </div>
        <div className="flex-grow overflow-y-auto">
            <Accordion type="multiple" defaultValue={['category', 'size', 'brand', 'price']} className="w-full">
            <AccordionItem value="category">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent>
                <div className="space-y-2">
                    {availableSubCategories.map(cat => (
                    <div key={cat} className="flex items-center space-x-2">
                        <Checkbox id={`cat-${cat}`} onCheckedChange={() => handleFilterChange('category', cat)} checked={selectedCategories.includes(cat)} />
                        <Label htmlFor={`cat-${cat}`}>{cat}</Label>
                    </div>
                    ))}
                </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="size">
                <AccordionTrigger>Size</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2">
                        {availableSizes.map(size => (
                            <div key={size} className="flex items-center space-x-2">
                            <Checkbox id={`size-${size}`} onCheckedChange={() => handleFilterChange('size', size)} checked={selectedSizes.includes(size)}/>
                            <Label htmlFor={`size-${size}`}>{size}</Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="brand">
                <AccordionTrigger>Brand</AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2">
                        {availableBrands.map(brand => (
                            <div key={brand} className="flex items-center space-x-2">
                            <Checkbox id={`brand-${brand}`} onCheckedChange={() => handleFilterChange('brand', brand)} checked={selectedBrands.includes(brand)}/>
                            <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
                <AccordionTrigger>Price</AccordionTrigger>
                <AccordionContent>
                    <div className="p-2">
                    <Slider
                        value={priceRange}
                        max={5000}
                        step={100}
                        onValueChange={handlePriceChange}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                    </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            </Accordion>
        </div>
        {isMobile && (
          <SheetFooter className="mt-4">
            <Button className="w-full" onClick={applyFilters}>Apply Filters</Button>
          </SheetFooter>
        )}
    </div>
  );
};

export default function ProductList({ category, onBackToCategories, onNavigate }: { category: Category; onBackToCategories: () => void; onNavigate: (view: View) => void; }) {
  const { user } = useUser();
  const isAdmin = user?.email === 'retagcontact00@gmail.com';
  const [sortOption, setSortOption] = useState('price_asc');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    sizes: [] as string[],
    brands: [] as string[],
    priceRange: [0, 5000]
  });
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [backendProducts, setBackendProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const endpoint = isAdmin
      ? '/sell/admin/listed'
      : '/sell/listed-public';
    const fetchOptions = isAdmin
      ? {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      : {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        };
    apiRequest(endpoint, fetchOptions)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products)) {


          // Map backend products to Product type
          const mapped = data.products.map((p: any) => {
            const lp = p.listed_product || {};
            const mainCategory = lp.mainCategory || 'Unisex';
            if ((mainCategory === 'Men' && category === 'Men') ||
                (mainCategory === 'Women' && category === 'Women') ||
                (mainCategory === 'Kids' && category === 'Kids') ||
                (mainCategory === 'Unisex' && (category === 'Men' || category === 'Women'))
            ) {
              return {
                id: p._id,
                name: lp.title || p.article,
                brand: p.brand,
                category: lp.category || '',
                mainCategory,
                price: `₹${lp.price || ''}`,
                originalPrice: lp.mrp ? `₹${lp.mrp}` : '',
                condition: p.ai_analysis?.image_analysis?.quality || '',
                images: (p.images || []).map((img: string) => img.startsWith('http') ? img : `${getBackendUrl()}/${img.replace(/^uploads\//, 'uploads/')}`),
                imageHints: lp.tags || [],
                sizes: p.size ? [p.size] : [],
                colors: (p.ai_analysis?.image_analysis?.colors_detected || []).length > 0
                  ? (p.ai_analysis.image_analysis.colors_detected || []).map((colorName: string) => ({
                      name: colorName,
                      hex: getColorHex(colorName)
                    }))
                  : getConsistentColors(p._id, p.category || 'Other', p.article || '', p.brand || ''),
              };
            }
            return null;
          }).filter(Boolean);
          setBackendProducts(mapped as Product[]);
        } else {
          setBackendProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products from backend.');
        setBackendProducts([]);
        setLoading(false);
      });
  }, [category, isAdmin]);

  const categoryProducts = useMemo(() => {
    return backendProducts;
  }, [backendProducts]);
  
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = categoryProducts;

    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category));
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p => p.sizes.some(s => filters.sizes.includes(s)));
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }
    filtered = filtered.filter(p => {
        const price = parseFloat(p.price.replace('₹', ''));
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    switch (sortOption) {
      case 'price_desc':
        return filtered.sort((a, b) => parseFloat(b.price.replace('₹', '')) - parseFloat(a.price.replace('₹', '')));
      case 'price_asc':
      default:
        return filtered.sort((a, b) => parseFloat(a.price.replace('₹', '')) - parseFloat(b.price.replace('₹', '')));
    }
  }, [categoryProducts, filters, sortOption]);

  const breadcrumbItems = [
    { label: 'Home', onClick: () => onNavigate('home') },
    { label: 'Shop', onClick: onBackToCategories },
    { label: category },
  ];

  return (
    <>
      <section className="bg-[#18181B] text-foreground pt-16 sm:pt-20 pb-28 lg:pb-12">
        <div className="container max-w-7xl mx-auto">
            <div className="px-4 md:px-0">
              <Breadcrumb items={breadcrumbItems} />
              <div className="mt-4 mb-6">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Buy {category}'s Collection Online</h1>
                  <p className="text-sm text-muted-foreground mt-1">{filteredAndSortedProducts.length} items</p>
              </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="hidden lg:block">
                <FilterSidebar products={categoryProducts} onFilterChange={setFilters} isMobile={false} />
            </div>
            
            <main className="lg:col-span-3">
              <div className="hidden lg:flex justify-end items-center mb-6">
                  <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px]">
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="price_asc">Price: Low to High</SelectItem>
                          <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 px-4 md:px-0">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {filteredAndSortedProducts.length === 0 && (
                  <div className="text-center col-span-full py-20">
                      <h2 className="text-2xl font-bold">No Products Found</h2>
                      <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
                  </div>
              )}
            </main>
          </div>
        </div>
      </section>

       {/* Mobile Sticky Footer */}
       <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-background border-t p-2 flex gap-2 z-40">
          <Button variant="outline" className="flex-1 justify-center gap-2" onClick={() => setIsSortSheetOpen(true)}>
              <ArrowUpDown className="h-4 w-4" /> SORT
          </Button>
          <Button variant="outline" className="flex-1 justify-center gap-2" onClick={() => setIsFilterSheetOpen(true)}>
              <SlidersHorizontal className="h-4 w-4" /> FILTER
          </Button>
      </div>

      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
            <div className="p-6 h-full">
              <FilterSidebar 
                products={categoryProducts}
                onFilterChange={setFilters}
                isMobile={true}
                closeSheet={() => setIsFilterSheetOpen(false)}
              />
            </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isSortSheetOpen} onOpenChange={setIsSortSheetOpen}>
        <SheetContent side="bottom" className="h-auto rounded-t-lg">
            <SheetHeader>
                <SheetTitle className="text-center">Sort By</SheetTitle>
            </SheetHeader>
            <div className="py-4">
                <RadioGroup value={sortOption} onValueChange={(val) => { setSortOption(val); setIsSortSheetOpen(false); }}>
                    <div className="flex items-center justify-between p-4" onClick={() => { setSortOption("price_asc"); setIsSortSheetOpen(false); }}>
                        <Label htmlFor="price_asc">Price: Low to High</Label>
                        <RadioGroupItem value="price_asc" id="price_asc" />
                    </div>
                     <div className="flex items-center justify-between p-4" onClick={() => { setSortOption("price_desc"); setIsSortSheetOpen(false); }}>
                        <Label htmlFor="price_desc">Price: High to Low</Label>
                        <RadioGroupItem value="price_desc" id="price_desc" />
                    </div>
                </RadioGroup>
            </div>
        </SheetContent>
    </Sheet>
    </>
    );
}
    
    