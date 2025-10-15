import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  const [location] = useLocation();

  const navItems = [
    {
      path: '/admin',
      label: t('admin.dashboard'),
      icon: LayoutDashboard,
    },
    {
      path: '/admin/products',
      label: t('admin.products'),
      icon: Package,
    },
    {
      path: '/admin/orders',
      label: t('admin.orders'),
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background">
        <div className="flex items-center h-16 px-6">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-to-site">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Site
            </Button>
          </Link>
          <h2 className="ml-6 font-serif text-xl font-light">Admin Panel</h2>
        </div>
      </div>

      <div className="flex">
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r bg-background p-6">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 rounded-md transition-colors cursor-pointer',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover-elevate'
                    )}
                    data-testid={`link-admin-${item.label.toLowerCase()}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
