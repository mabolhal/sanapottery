import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { loadStripe } from '@stripe/stripe-js';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
  shippingAddress: z.string().min(5, 'Address is required'),
  shippingCity: z.string().min(2, 'City is required'),
  shippingPostalCode: z.string().min(3, 'Postal code is required'),
  shippingCountry: z.string().min(2, 'Country is required'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const stripePromise = loadStripe('pk_test_51SIrfJ0Owt2HqHqZEAlAEeK75saIMPENwe0Jg0J9WwBDfBj7pazaZ14kafcHY5hQEprkbDGKO1DbjZM302ThIHYo00sKmkp8cp'); // TODO: Replace with your real Stripe publishable key

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const currentLang = i18n.language;

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      shippingAddress: '',
      shippingCity: '',
      shippingPostalCode: '',
      shippingCountry: '',
    },
  });

  const createCheckoutSessionMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
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
      const orderItems = groupedItems.map(item => ({
        productId: item.product.id,
        productNameEn: item.product.nameEn,
        productNameFr: item.product.nameFr,
        quantity: item.quantity,
        price: item.product.price,
        imageUrl: item.product.imageUrl,
      }));
      console.log('data', data);
      console.log('orderItems', orderItems);
      const response = await apiRequest('POST', '/api/create-checkout-session', {
        ...data,
        total: total.toString(),
        items: orderItems,
      });
      if (!response.ok) throw new Error('Failed to create Stripe session');
      return response.json();
    },
    onSuccess: async (session) => {
      if (session.url) {
        window.location.href = session.url;
      } else {
        toast({
          title: 'Error',
          description: 'Stripe session error. Please try again.',
          variant: 'destructive',
        });
      }
    },
    onError: (error) => {
      console.error('Stripe Checkout Error:', error);
      toast({
        title: 'Error',
        description: typeof error === 'object' && error !== null ? (error.message || JSON.stringify(error)) : String(error),
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: CheckoutForm) => {
    createCheckoutSessionMutation.mutate(data);
  };

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

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-light mb-4" data-testid="text-empty-cart">Your cart is empty</h2>
          <Button asChild data-testid="button-continue-shopping">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6 md:px-8">
        <Link href="/shop">
          <Button variant="ghost" className="mb-8" data-testid="button-back-to-shop">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl font-light mb-12" data-testid="text-checkout-title">
          {t('checkout.title')}
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-medium mb-6">{t('checkout.shipping')}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('checkout.name')}</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-customer-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('checkout.email')}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} data-testid="input-customer-email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('checkout.phone')}</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-customer-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('checkout.address')}</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-shipping-address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.city')}</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-shipping-city" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingPostalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('checkout.postalCode')}</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-shipping-postal-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="shippingCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('checkout.country')}</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-shipping-country" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={createCheckoutSessionMutation.isPending}
                  data-testid="button-complete-order"
                >
                  {createCheckoutSessionMutation.isPending ? t('common.loading') : t('checkout.complete')}
                </Button>
              </form>
            </Form>
          </div>

          <div>
            <h2 className="text-2xl font-medium mb-6">{t('checkout.orderSummary')}</h2>
            <Card className="p-6 space-y-4">
              {groupedItems.map((item) => (
                <div key={item.product.id} className="flex gap-4" data-testid={`order-item-${item.product.id}`}>
                  <img
                    src={item.product.imageUrl}
                    alt={currentLang === 'en' ? item.product.nameEn : item.product.nameFr}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">
                      {currentLang === 'en' ? item.product.nameEn : item.product.nameFr}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × ${item.product.price}
                    </p>
                  </div>
                  <span className="font-medium">
                    ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>{t('checkout.total')}</span>
                  <span data-testid="text-checkout-total">${total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
