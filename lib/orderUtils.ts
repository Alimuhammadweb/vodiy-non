import { Order, TimeGroup } from './types';

export function getTimeGroup(createdAt: Date): TimeGroup {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - new Date(createdAt).getTime()) / (1000 * 60));

  if (diffMinutes < 0) {
    return 'Hozir (0-10min)';
  }

  if (diffMinutes <= 10) {
    return 'Hozir (0-10min)';
  }

  if (diffMinutes <= 30) {
    return 'Yaqinda (10-30min)';
  }

  if (diffMinutes > 30) {
    return 'Kechikdi'; // Late
  }

  return 'Keyin (30+min)';
}

export function getMinutesElapsed(createdAt: Date): number {
  const now = new Date();
  return Math.floor((now.getTime() - new Date(createdAt).getTime()) / (1000 * 60));
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatOrderDate(date: Date): string {
  const d = new Date(date);
  const months = [
    'yan', 'fev', 'mar', 'apr', 'may', 'iyn',
    'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'
  ];
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}, ${year}`;
}

export function sortOrdersByTime(orders: Order[]): {
  [key in TimeGroup]?: Order[];
} {
  const grouped: {
    [key in TimeGroup]?: Order[];
  } = {};

  orders.forEach((order) => {
    const group = getTimeGroup(order.createdAt);
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group]!.push(order);
  });

  return grouped;
}

export function generateOrderNumber(): string {
  return `ORD-${Date.now().toString().slice(-6)}`;
}

export function sortOrdersByDateAndTime(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => {
    // First priority: unfinished orders come first
    const aIsCompleted = a.status === 'bajarildi';
    const bIsCompleted = b.status === 'bajarildi';
    
    if (aIsCompleted !== bIsCompleted) {
      return aIsCompleted ? 1 : -1; // Unfinished (false) comes before completed (true)
    }
    
    // Second: sort by order date
    const dateA = new Date(a.orderDate).getTime();
    const dateB = new Date(b.orderDate).getTime();
    
    if (dateA !== dateB) {
      return dateA - dateB; // Earlier date first
    }
    
    // Third: sort by order time (as string comparison works for HH:MM format)
    return a.orderTime.localeCompare(b.orderTime);
  });
}
