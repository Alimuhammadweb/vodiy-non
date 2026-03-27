'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFormProps {
  onSubmit: (data: { name: string; price: number; category: string; tandirName?: string; tandirCapacity?: number }) => Promise<void>;
  onCancel: () => void;
}

const categories = ['Pies', 'Bread', 'Pastries', 'Other'];

export function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Bread');
  const [tandirName, setTandirName] = useState('');
  const [tandirCapacity, setTandirCapacity] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !price || !category) {
      alert('Barcha maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name,
        price: parseInt(price),
        category,
        tandirName: tandirName || undefined,
        tandirCapacity: tandirCapacity ? parseInt(tandirCapacity) : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Mahsulot nomi</Label>
        <Input
          id="name"
          placeholder="Masalan: Samsa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="price">Narxi (so'm)</Label>
        <Input
          id="price"
          type="number"
          placeholder="3000"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="category">Kategoriya</Label>
        <Select value={category} onValueChange={setCategory} disabled={loading}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tandirName">Tandir nomi (ixtiyoriy)</Label>
        <Input
          id="tandirName"
          placeholder="Masalan: Tandir 1"
          value={tandirName}
          onChange={(e) => setTandirName(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="tandirCapacity">Tandir sig'imi (ixtiyoriy)</Label>
        <Input
          id="tandirCapacity"
          type="number"
          placeholder="Masalan: 50"
          value={tandirCapacity}
          onChange={(e) => setTandirCapacity(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Bekor qilish
        </Button>
        <Button type="submit" className="bg-primary" disabled={loading}>
          {loading ? 'Yuklash...' : 'Qoʻshish'}
        </Button>
      </div>
    </form>
  );
}
