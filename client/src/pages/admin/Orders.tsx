import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Order, OrderItem } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function Orders() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const currentLang = i18n.language;

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest('PATCH', `/api/orders/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      toast({ title: 'Order status updated' });
    },
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'shipped':
        return 'default';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <h1 className="font-serif text-4xl font-light mb-8" data-testid="text-orders-title">{t('admin.orders')}</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground" data-testid="text-no-orders">No orders yet</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const orderItems: OrderItem[] = JSON.parse(order.items);
            return (
              <Card key={order.id} data-testid={`order-card-${order.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{order.customerName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{order.customerEmail}</p>
                      {order.customerPhone && (
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusVariant(order.status)} data-testid={`badge-status-${order.id}`}>
                        {t(`admin.status.${order.status}`)}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress}<br />
                      {order.shippingCity}, {order.shippingPostalCode}<br />
                      {order.shippingCountry}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                          <img
                            src={item.imageUrl}
                            alt={currentLang === 'en' ? item.productNameEn : item.productNameFr}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium">
                              {currentLang === 'en' ? item.productNameEn : item.productNameFr}
                            </p>
                            <p className="text-muted-foreground">
                              {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-lg font-medium">
                      Total: <span data-testid={`text-order-total-${order.id}`}>${order.total}</span>
                    </div>
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => updateOrderMutation.mutate({ id: order.id, status: 'shipped' })}
                        data-testid={`button-mark-shipped-${order.id}`}
                      >
                        {t('admin.markAsShipped')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
