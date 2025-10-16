import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';

export function CartDrawer() {
  const { t, i18n } = useTranslation();
  const { items, removeItem, updateQuantity, isCartOpen, toggleCart, total } = useCart();
  const currentLang = i18n.language;

  // Group items by product ID and sum quantities
  const groupedItems = Object.values(
    items.reduce((acc, item) => {
      const id = item.product.id;
      if (!acc[id]) {
        acc[id] = { ...item };
      } else {
        acc[id].quantity += item.quantity;
      }
      return acc;
    }, {} as Record<string, typeof items[0]>)
  );

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-light">{t('cart.title')}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground" data-testid="text-cart-empty">{t('cart.empty')}</p>
            <Button
              className="mt-6"
              onClick={toggleCart}
              asChild
              data-testid="button-continue-shopping"
            >
              <Link href="/shop">{t('cart.continueShopping')}</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {groupedItems.map((item) => (
                <div key={item.product.id} className="flex gap-4" data-testid={`cart-item-${item.product.id}`}>
                  <img
                    src={item.product.imageUrl}
                    alt={currentLang === 'en' ? item.product.nameEn : item.product.nameFr}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium" data-testid={`text-cart-item-name-${item.product.id}`}>
                      {currentLang === 'en' ? item.product.nameEn : item.product.nameFr}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.product.id}`}>
                      ${item.product.price}
                    </p>
                    <div className="hidden">
                      {/* flex items-center gap-2 mt-2 */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        data-testid={`button-decrease-quantity-${item.product.id}`}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center" data-testid={`text-quantity-${item.product.id}`}>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        data-testid={`button-increase-quantity-${item.product.id}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>

                    </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto"
                        onClick={() => removeItem(item.product.id)}
                        data-testid={`button-remove-item-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-lg font-medium">
                <span>{t('cart.subtotal')}</span>
                <span data-testid="text-cart-total">${total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={toggleCart}
                asChild
                data-testid="button-checkout"
              >
                <Link href="/checkout">{t('cart.checkout')}</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
