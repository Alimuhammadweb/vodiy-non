'use client';

import { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onDelete: (productId: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden border-2 border-border hover:border-primary transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{product.name}</CardTitle>
        <p className="text-xs text-muted-foreground">{product.category}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="text-2xl font-bold text-primary">
          {product.price.toLocaleString()} so'm
        </div>

        <Button
          variant="destructive"
          size="sm"
          className="w-full"
          onClick={() => onDelete(product._id)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Oʻchirish
        </Button>
      </CardContent>
    </Card>
  );
}
