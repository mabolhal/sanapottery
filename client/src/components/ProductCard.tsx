import { useTranslation } from 'react-i18next';
import { Product } from '@shared/schema';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
  onViewDetails?: (product: Product) => void;
};

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const currentLang = i18n.language;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: t('product.addToCart'),
      description: currentLang === 'en' ? product.nameEn : product.nameFr,
    });
  };

  return (
    <Card
      className="group overflow-hidden border hover-elevate transition-all duration-300 cursor-pointer"
      onClick={() => onViewDetails?.(product)}
      data-testid={`product-card-${product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={currentLang === 'en' ? product.nameEn : product.nameFr}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <Badge className="absolute top-4 left-4" data-testid={`badge-featured-${product.id}`}>
            {t('product.featured')}
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <Badge variant="destructive" data-testid={`badge-out-of-stock-${product.id}`}>{t('product.outOfStock')}</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-lg" data-testid={`text-product-name-${product.id}`}>
            {currentLang === 'en' ? product.nameEn : product.nameFr}
          </h3>
          <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-medium" data-testid={`text-product-price-${product.id}`}>${product.price}</span>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={!product.inStock}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('product.addToCart')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
