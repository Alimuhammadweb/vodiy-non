'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  Plus,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/orders', label: 'Buyurtmalar', icon: LayoutGrid },
    { href: '/products', label: 'Mahsulotlar', icon: Package },
    { href: '/reports', label: 'Hisobot', icon: BarChart3 },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex justify-center"
              >
                <Button
                  variant={isActive(item.href) ? 'default' : 'ghost'}
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-2"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <Link href="/new-order">
          <Button
            size="lg"
            className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          >
            <Plus className="h-8 w-8" />
          </Button>
        </Link>
      </div>

      {/* Mobile spacing to prevent content hiding */}
      <div className="h-24 md:hidden" />
    </>
  );
}
