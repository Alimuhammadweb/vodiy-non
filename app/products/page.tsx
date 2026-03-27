'use client';

import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/app/actions';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProductForm } from '@/components/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadProducts();
    // Auto-refresh every 5 seconds for multi-worker sync
    const interval = setInterval(loadProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddProduct(productData: { name: string; price: number; category: string; tandirName?: string; tandirCapacity?: number }) {
    try {
      console.log('[v0] handleAddProduct called with:', productData);
      const result = await addProduct(productData.name, productData.price, productData.category, productData.tandirName, productData.tandirCapacity);
      console.log('[v0] addProduct returned:', result);
      
      if (!result) {
        alert('Mahsulot qo\'shishda xato yuz berdi');
        return;
      }
      
      console.log('[v0] reloading products list');
      await loadProducts();
      setDialogOpen(false);
    } catch (error) {
      console.error('[v0] Error in handleAddProduct:', error);
      alert('Mahsulot qo\'shishda xato yuz berdi: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async function handleDelete(productId: string) {
    if (confirm('Bu mahsulotni oʻchirishga ishonchingiz komilmi?')) {
      const success = await deleteProduct(productId);
      if (success) {
        await loadProducts();
      }
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories = Array.from(new Set(products.map((p) => p.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Yuklash...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Mahsulotlar</h1>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Yangi mahsulot
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yangi mahsulot qoʻshish</DialogTitle>
                <DialogDescription>Mahsulot ma'lumotlarini kiriting</DialogDescription>
              </DialogHeader>
              <ProductForm onSubmit={handleAddProduct} onCancel={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Mahsulot nomi yoki kategoriya bo'yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        {categories.length > 0 && filteredProducts.length > 0 && (
          <div className="mb-8">
            {categories
              .filter((category) => filteredProducts.some((p) => p.category === category))
              .map((category, idx) => {
                const categoryProducts = filteredProducts.filter((p) => p.category === category);

                return (
                  <div key={`category-${category}-${idx}`} className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold text-foreground">{category}</h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {categoryProducts.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Mahsulotlar topilmadi</p>
          </div>
        )}
      </div>
    </main>
  );
}
