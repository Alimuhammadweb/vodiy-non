'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Package,
  Plus,
  Cake,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DesktopNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="hidden border-b border-border bg-card md:block">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <Cake className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Vodiy Non</h1>
        </div>

        <div className="flex gap-2">
          <Link href="/orders">
            <Button
              variant={isActive('/orders') ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Buyurtmalar
            </Button>
          </Link>

          <Link href="/products">
            <Button
              variant={isActive('/products') ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Mahsulotlar
            </Button>
          </Link>

          <Link href="/reports">
            <Button
              variant={isActive('/reports') ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Hisobot
            </Button>
          </Link>

          <Link href="/new-order">
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Yangi buyurtma
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
