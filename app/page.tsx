'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, Package, Plus, Cake, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cake className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Vodiy Non</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Nonvai buyurtma boshqarish tizimi
          </p>
          <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tez va samarali buyurtmalarni boshqaring. Real-time oʻngdan kelib chiquvchi buyurtmalar, toʻlov
            qolgan summa va mavqutning holati.
          </p>

          <Link href="/orders">
            <Button className="bg-primary hover:bg-primary/90 text-lg h-auto px-8 py-3">
              Boshlash
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="border-2 border-border hover:border-primary transition-colors">
            <CardHeader>
              <div className="mb-2">
                <LayoutGrid className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Buyurtmalarni boshqaring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time vaqt guruhlari bilan buyurtmalarni toʻliq nazorat qiling. Hozir, Yaqinda,
                Keyin va Kechikdi kategoriyalari.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary transition-colors">
            <CardHeader>
              <div className="mb-2">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Mahsulot katalogi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tez qoʻshish va chiqarish imkoniyati bilan barcha mahsulotlarni boshqaring. Kategoriya
                boʻyicha tashkil etilgan.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary transition-colors">
            <CardHeader>
              <div className="mb-2">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg">Kunlik hisobot</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tandir boʻyicha kunlik ishlab chiqarishni qayd qiling. Nosozi va net qiymatni hisoblang.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="bg-card border-2 border-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Tez kirish</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Link href="/orders">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
              >
                <LayoutGrid className="h-5 w-5 mr-3" />
                <span>Buyurtmalar</span>
              </Button>
            </Link>

            <Link href="/new-order">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
              >
                <Plus className="h-5 w-5 mr-3" />
                <span>Yangi buyurtma</span>
              </Button>
            </Link>

            <Link href="/products">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
              >
                <Package className="h-5 w-5 mr-3" />
                <span>Mahsulotlar</span>
              </Button>
            </Link>

            <Link href="/reports">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <span>Hisobot</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
