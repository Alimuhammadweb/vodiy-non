// Uzbek order management system types

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  tandirName?: string;
  tandirCapacity?: number;
  createdAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  items: OrderItem[];
  totalPrice: number;
  advancePayment: number;
  remainingAmount: number;
  status: 'jarayonda' | 'bajarildi';
  orderDate: Date;
  orderTime: string;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
  archivedAt?: Date;
  notes?: string;
}

export type TimeGroup = 'Hozir (0-10min)' | 'Yaqinda (10-30min)' | 'Keyin (30+min)' | 'Kechikdi';

export interface DailyReport {
  _id: string;
  date: string; // YYYY-MM-DD format for uniqueness
  productId: string;
  productName: string;
  productPrice: number;
  tandirCapacity: number;
  tandirCount: number;
  extraBread: number;
  previousDayRemainingBread: number;
  totalBread: number;
  badBread: number;
  remainingBread: number;
  netBread: number;
  totalExpense: number;
  expenses?: Array<{ amount: number; note?: string; createdAt: Date }>;
  createdAt: Date;
  updatedAt?: Date;
  notes?: string;
}

export interface DailyReportSummary {
  _id?: string;
  date: string;
  productId: string;
  productName: string;
  productPrice: number;
  tandirCapacity: number;
  tandirCount: number;
  extraBread: number;
  previousDayRemainingBread: number;
  totalBread: number;
  badBread: number;
  remainingBread: number;
  netBread: number;
  totalValue: number;
  badValue: number;
  remainingValue: number;
  netValue: number;
  totalExpense: number;
  finalNetValue: number;
}
