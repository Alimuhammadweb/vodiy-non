'use client';

import { Order } from '@/lib/types';
import { formatOrderDate } from '@/lib/orderUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Trash2,
  CheckCircle2,
  User,
  Phone,
  Calendar,
} from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface OrderCardProps {
  order: Order;
  onStatusChange?: (orderId: string, status: 'jarayonda' | 'bajarildi') => void;
  onDelete?: (orderId: string) => void;
}

export function OrderCard({
  order,
  onStatusChange,
  onDelete,
}: OrderCardProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const isCompleted = order.status === 'bajarildi';

  const handleStatusClick = () => {
    if (!isCompleted && onStatusChange) {
      setShowStatusDialog(true);
    }
  };

  const confirmStatusChange = async () => {
    setShowStatusDialog(false);
    if (onStatusChange) {
      await onStatusChange(order._id, 'bajarildi');
    }
  };

  return (
    <>
      <Card
        className={`border-2 transition-all ${
          isCompleted
            ? 'bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700'
            : 'bg-card border-border'
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-foreground">
                {order.orderNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {formatOrderDate(order.orderDate)}
              </p>
            </div>
            {isCompleted && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
          </div>
        </CardHeader>

        {/* Due Date/Time - Customer's Requested Date */}
        <div className="px-6 pt-2 pb-3 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Tayyor bolish kerak</p>
                <p className="text-sm font-semibold">{formatOrderDate(order.orderDate)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Soat</p>
              <p className="text-sm font-semibold">{order.orderTime}</p>
            </div>
          </div>
        </div>

        <CardContent className="space-y-4">
          {/* Customer Info */}
          <div className="space-y-2 pb-3 border-b border-border">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{order.phoneNumber}</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2 pb-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Mahsulotlar:</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm pl-4">
                <span>{item.productName} x{item.quantity}</span>
                <span className="font-semibold">{(item.quantity * item.price).toLocaleString()} so'm</span>
              </div>
            ))}
          </div>

          {/* Payment Info */}
          <div className="space-y-2 pb-3 border-b border-border">
            <div className="flex justify-between text-sm">
              <span>Jami:</span>
              <span className="font-semibold">{order.totalPrice.toLocaleString()} so'm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Avans:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {order.advancePayment.toLocaleString()} so'm
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Qoldiq:</span>
              <span className={`font-semibold ${order.remainingAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {order.remainingAmount.toLocaleString()} so'm
              </span>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="pb-3 border-b border-border">
              <p className="text-sm text-muted-foreground">Izoh: {order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {!isCompleted && (
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={handleStatusClick}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Bajarildi
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(order._id)}
                    className="text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Oʻchirish
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Buyurtma tayyor?</AlertDialogTitle>
          <AlertDialogDescription>
            Bu buyurtmani bajarilgan shaklida belgilashni tasdiqlaysizmi?
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Bekor</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className="bg-green-600 hover:bg-green-700"
            >
              Ha, bajarildi
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
