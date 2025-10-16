import { useTranslation } from 'react-i18next';
import { Product } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ProductDetailDialogProps = {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailDialogProps) {
  const { t, i18n } = useTranslation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const currentLang = i18n.language;

  if (!product) return null;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: t('product.addToCart'),
      description: `${quantity}x ${currentLang === 'en' ? product.nameEn : product.nameFr}`,
    });
    onOpenChange(false);
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.imageUrl}
                alt={currentLang === 'en' ? product.nameEn : product.nameFr}
                className="w-full h-full object-cover"
              />
            </div>
            {product.imageUrls && product.imageUrls.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.imageUrls.map((url, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md bg-muted">
                    <img src={url} alt={`${product.nameEn} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="font-serif text-3xl font-light" data-testid="text-product-detail-name">
                {currentLang === 'en' ? product.nameEn : product.nameFr}
              </DialogTitle>
              <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-medium" data-testid="text-product-detail-price">${product.price}</span>
                {product.inStock ? (
                  <Badge data-testid="badge-in-stock">{t('product.inStock')}</Badge>
                ) : (
                  <Badge variant="destructive" data-testid="badge-out-of-stock">{t('product.outOfStock')}</Badge>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {currentLang === 'en' ? product.descriptionEn : product.descriptionFr}
              </p>

              {product.inStock && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {/* <span className="text-sm font-medium">{t('product.quantity')}:</span> */}
                    <div className="hidden">
                      {/* <div className="flex items-center gap-2"> */}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        data-testid="button-decrease-quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center" data-testid="text-quantity">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        data-testid="button-increase-quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleAddToCart} data-testid="button-add-to-cart">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {t('product.addToCart')}
                  </Button>
                </div>
              )}

              <Accordion type="single" collapsible className="w-full">
                {product.dimensions && (
                  <AccordionItem value="dimensions">
                    <AccordionTrigger>{t('product.dimensions')}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{product.dimensions}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {product.materials && (
                  <AccordionItem value="materials">
                    <AccordionTrigger>{t('product.materials')}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{product.materials}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {product.careInstructions && (
                  <AccordionItem value="care">
                    <AccordionTrigger>{t('product.care')}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{product.careInstructions}</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
