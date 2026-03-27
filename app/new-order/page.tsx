'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getProducts, createOrder } from '@/app/actions';
import { Product, OrderItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedProducts, setSelectedProducts] = useState<
    Map<string, { product: Product; quantity: number }>
  >(new Map());

  // Customer Information
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderDate, setOrderDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [orderTime, setOrderTime] = useState('12:00');

  const [advancePayment, setAdvancePayment] = useState(0);
  const [fullPaymentChecked, setFullPaymentChecked] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadProducts();
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

  function addProduct(product: Product) {
    const updated = new Map(selectedProducts);
    const current = updated.get(product._id);

    if (current) {
      current.quantity += 1;
    } else {
      updated.set(product._id, { product, quantity: 1 });
    }

    setSelectedProducts(updated);
  }

  function removeProduct(productId: string) {
    const updated = new Map(selectedProducts);
    updated.delete(productId);
    setSelectedProducts(updated);
  }

  function updateQuantity(productId: string, quantity: number) {
    const updated = new Map(selectedProducts);
    const current = updated.get(productId);

    if (current) {
      if (quantity <= 0) {
        updated.delete(productId);
      } else {
        current.quantity = quantity;
      }
      setSelectedProducts(updated);
    }
  }

  const totalPrice = Array.from(selectedProducts.values()).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const remainingAmount = totalPrice - advancePayment;

  useEffect(() => {
    if (fullPaymentChecked) {
      setAdvancePayment(totalPrice);
    }
  }, [fullPaymentChecked, totalPrice]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Mijoz ismi kiritilishi shart');
      return;
    }

    if (!phoneNumber.trim()) {
      alert('Telefon raqami kiritilishi shart');
      return;
    }

    if (selectedProducts.size === 0) {
      alert('Hech boʻlmaganda bitta mahsulot tanlang');
      return;
    }

    const items: OrderItem[] = Array.from(selectedProducts.values()).map(
      ({ product, quantity }) => ({
        productId: product._id,
        productName: product.name,
        quantity,
        price: product.price,
      })
    );

    setSubmitting(true);
    try {
      await createOrder(
        customerName,
        phoneNumber,
        items,
        totalPrice,
        advancePayment,
        new Date(orderDate),
        orderTime,
        notes
      );
      router.push('/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Buyurtma yaratishda xatolik');
    } finally {
      setSubmitting(false);
    }
  }

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

  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Yangi buyurtma</h1>
        </div>

        {/* Customer Information Form */}
        <Card className="mb-6 border-2 border-secondary">
          <CardHeader>
            <CardTitle>Mijoz ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="name">Mijoz ismi *</Label>
              <Input
                id="name"
                placeholder="F.I.O"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon raqami *</Label>
              <Input
                id="phone"
                placeholder="+998 XX XXX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Buyurtma sanasi</Label>
              <Input
                id="date"
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Tayyor bo'lish vaqti</Label>
              <Input
                id="time"
                type="time"
                value={orderTime}
                onChange={(e) => setOrderTime(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Products Selection */}
          <div className="lg:col-span-2 space-y-4">
            {categories.map((category) => {
              const categoryProducts = products.filter((p) => p.category === category);

              return (
                <div key={category}>
                  <h2 className="mb-3 text-lg font-semibold text-foreground">{category}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categoryProducts.map((product) => (
                      <Card
                        key={product._id}
                        className="border-2 border-border hover:border-primary transition-colors cursor-pointer"
                        onClick={() => addProduct(product)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{product.name}</p>
                              <p className="text-sm text-primary font-bold">
                                {product.price.toLocaleString()} so'm
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                addProduct(product);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Buyurtma ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-card">
                  {selectedProducts.size === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">Mahsulot tanlanmadi</p>
                  ) : (
                    Array.from(selectedProducts.values()).map(({ product, quantity }) => (
                      <div key={product._id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.price.toLocaleString()} so'm × {quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(product._id, quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={quantity || ''}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val > 0) {
                                updateQuantity(product._id, val);
                              } else if (e.target.value === '') {
                                // Allow empty input for user to completely clear and re-enter
                                updateQuantity(product._id, 0);
                              }
                            }}
                            onFocus={(e) => {
                              // Auto-select all text on focus for quick replacement
                              e.target.select();
                            }}
                            placeholder="Soni kiriting"
                            className="h-6 w-10 p-1 text-center text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 w-6 p-0"
                            onClick={() => updateQuantity(product._id, quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 ml-1 text-red-600"
                            onClick={() => removeProduct(product._id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-border pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Jami:</span>
                    <span className="font-bold text-lg">{totalPrice.toLocaleString()} so'm</span>
                  </div>

                  {/* Payment Section */}
                  <div className="space-y-3 pt-3">
                    <Label>Oldindan to'lang (so'm)</Label>
                    <Input
                      type="number"
                      value={advancePayment}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setAdvancePayment(Math.max(0, Math.min(val, totalPrice)));
                        setFullPaymentChecked(val === totalPrice);
                      }}
                      max={totalPrice}
                      min={0}
                      disabled={fullPaymentChecked}
                    />

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="fullPayment"
                        checked={fullPaymentChecked}
                        onCheckedChange={(checked) => {
                          setFullPaymentChecked(checked as boolean);
                          if (checked) {
                            setAdvancePayment(totalPrice);
                          }
                        }}
                      />
                      <Label htmlFor="fullPayment" className="text-sm font-normal cursor-pointer">
                        Toʻliq to'lang
                      </Label>
                    </div>

                    {remainingAmount > 0 && (
                      <div className="rounded-md bg-yellow-50 p-2 dark:bg-yellow-950">
                        <p className="text-xs text-yellow-900 dark:text-yellow-300">
                          Qolgan: {remainingAmount.toLocaleString()} so'm
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2 pt-3">
                    <Label htmlFor="notes">Izoh</Label>
                    <textarea
                      id="notes"
                      placeholder="Mahsulot haqida qoʻshimcha ma'lumot..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || selectedProducts.size === 0}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {submitting ? 'Saqlash...' : 'Buyurtmani tayyorlash'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
