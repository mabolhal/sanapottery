import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/hooks/useCart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { AdminLayout } from "@/components/AdminLayout";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import About from "@/pages/About";
import Checkout from "@/pages/Checkout";
import Dashboard from "@/pages/admin/Dashboard";
import Products from "@/pages/admin/Products";
import Orders from "@/pages/admin/Orders";
import NotFound from "@/pages/not-found";
import "./lib/i18n";
import CheckoutSuccess from '@/pages/CheckoutSuccess';
import CheckoutCancel from '@/pages/CheckoutCancel';

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');

  if (isAdmin) {
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/products" component={Products} />
          <Route path="/admin/orders" component={Orders} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <>
      <Header />
      <CartDrawer />
      <TooltipProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/shop" component={Shop} />
              <Route path="/about" component={About} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/checkout/success" component={CheckoutSuccess} />
              <Route path="/checkout/cancel" component={CheckoutCancel} />
              <Route component={NotFound} />
            </Switch>
            <Toaster />
          </QueryClientProvider>
        </ThemeProvider>
      </TooltipProvider>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
