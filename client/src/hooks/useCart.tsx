import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem as CartItemType } from '@shared/schema';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

export type CartItem = {
  product: Product;
  quantity: number;
  cartItemId?: string; // Backend cart item ID for mutations
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  total: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Get or create session ID
function getSessionId(): string {
  let sessionId = localStorage.getItem('cartSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('cartSessionId', sessionId);
  }
  return sessionId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const sessionId = getSessionId();

  // Fetch all products first
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Fetch cart items from backend only after products are loaded
  const { data: backendCartItems = [], isLoading: cartLoading } = useQuery<CartItemType[]>({
    queryKey: [`/api/cart/${sessionId}`],
    enabled: !productsLoading, // Only fetch cart after products are loaded
  });

  // Merge backend cart items with product data - stable mapping
  const cartItems: CartItem[] = backendCartItems
    .map((cartItem) => {
      const product = products.find((p) => p.id === cartItem.productId);
      if (!product) return null;
      return {
        product,
        quantity: cartItem.quantity,
        cartItemId: cartItem.id, // Keep backend ID for mutations
      };
    })
    .filter((item): item is CartItem & { cartItemId: string } => item !== null);

  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await apiRequest('POST', '/api/cart', {
        sessionId,
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      const response = await apiRequest('PATCH', `/api/cart/${cartItemId}`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      await apiRequest('DELETE', `/api/cart/${cartItemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/cart/session/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/cart/${sessionId}`] });
    },
  });

  const addItem = (product: Product, quantity: number = 1) => {
    addItemMutation.mutate({ productId: product.id, quantity });
  };

  const removeItem = (productId: string) => {
    const cartItem = cartItems.find((item) => item.product.id === productId);
    if (cartItem?.cartItemId) {
      removeItemMutation.mutate(cartItem.cartItemId);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const cartItem = cartItems.find((item) => item.product.id === productId);
    if (cartItem?.cartItemId) {
      if (quantity <= 0) {
        removeItemMutation.mutate(cartItem.cartItemId);
      } else {
        updateItemMutation.mutate({ cartItemId: cartItem.cartItemId, quantity });
      }
    }
  };

  const clearCart = () => {
    clearCartMutation.mutate();
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  const isLoading = productsLoading || cartLoading;

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        toggleCart,
        total,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
