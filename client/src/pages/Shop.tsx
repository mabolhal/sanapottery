import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailDialog } from '@/components/ProductDetailDialog';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Shop() {
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceLowToHigh':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'priceHighToLow':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [products, selectedCategory, inStockOnly, sortBy]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">{t('filters.category')}</Label>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={category} data-testid={`radio-category-${category}`} />
              <Label htmlFor={category} className="cursor-pointer capitalize">
                {category === 'all' ? t('filters.all') : category}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="inStock" className="cursor-pointer">{t('filters.inStockOnly')}</Label>
        <Switch
          id="inStock"
          checked={inStockOnly}
          onCheckedChange={setInStockOnly}
          data-testid="switch-in-stock-only"
        />
      </div>

      <div>
        <Label className="text-base font-medium mb-4 block">{t('filters.sortBy')}</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger data-testid="select-sort-by">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" data-testid="option-sort-newest">{t('filters.newest')}</SelectItem>
            <SelectItem value="priceLowToHigh" data-testid="option-sort-price-low">{t('filters.priceLowToHigh')}</SelectItem>
            <SelectItem value="priceHighToLow" data-testid="option-sort-price-high">{t('filters.priceHighToLow')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-light" data-testid="text-shop-title">{t('nav.shop')}</h1>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden" data-testid="button-open-filters">
                <Filter className="w-4 h-4 mr-2" />
                {t('filters.category')}
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{t('filters.category')}</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <Card className="hidden md:block p-6 h-fit sticky top-24">
            <FilterContent />
          </Card>

          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-muted rounded-lg mb-4" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground" data-testid="text-no-products">No products found</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductDetailDialog
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  );
}
