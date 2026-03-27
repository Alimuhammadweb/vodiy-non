'use server';

import { Order, Product, OrderItem, DailyReport, DailyReportSummary } from '@/lib/types';
import { getDatabaseOrNull } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Fallback for development without MongoDB
let products: (Product & { _id: string })[] = [];
let orders: (Order & { _id: string })[] = [];
let dailyReports: (DailyReport & { _id: string })[] = [];

function formatReport(report: any): DailyReportSummary {
  const totalValue = report.totalBread * report.productPrice;
  const badValue = report.badBread * report.productPrice;
  const remainingValue = report.remainingBread * report.productPrice;
  const netValue = totalValue - badValue - remainingValue;
  const totalExpense = report.totalExpense || 0;
  const finalNetValue = netValue - totalExpense;

  return {
    _id: report._id?.toString?.() || report._id,
    date: report.date,
    productId: report.productId,
    productName: report.productName,
    productPrice: report.productPrice,
    tandirCapacity: report.tandirCapacity,
    tandirCount: report.tandirCount,
    extraBread: report.extraBread,
    previousDayRemainingBread: report.previousDayRemainingBread,
    totalBread: report.totalBread,
    badBread: report.badBread,
    remainingBread: report.remainingBread,
    netBread: report.netBread,
    totalValue,
    badValue,
    remainingValue,
    netValue,
    totalExpense,
    finalNetValue,
  };
}

// Product Actions
export async function getProducts(): Promise<Product[]> {
  try {
    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('products');
      const docs = await collection.find({}).toArray();
      console.log('[v0] getProducts fetched from MongoDB:', docs.length, 'products');
      return docs.map((doc) => ({
        _id: doc._id.toString(),
        name: doc.name,
        price: doc.price,
        category: doc.category,
        tandirName: doc.tandirName,
        tandirCapacity: doc.tandirCapacity,
        createdAt: doc.createdAt,
      }));
    }
    console.log('[v0] getProducts using in-memory fallback:', products.length, 'products');
    return products as Product[];
  } catch (error) {
    console.error('[v0] Failed to get products:', error);
    return products as Product[];
  }
}

export async function addProduct(
  name: string,
  price: number,
  category: string,
  tandirName?: string,
  tandirCapacity?: number
): Promise<Product | null> {
  try {
    console.log('[v0] addProduct called with:', { name, price, category, tandirName, tandirCapacity });
    const db = await getDatabaseOrNull();
    const newProduct = {
      name,
      price,
      category,
      tandirName,
      tandirCapacity,
      createdAt: new Date(),
    };

    if (db) {
      console.log('[v0] addProduct using MongoDB');
      const collection = db.collection('products');
      const result = await collection.insertOne(newProduct);
      console.log('[v0] addProduct inserted with id:', result.insertedId.toString());
      return {
        _id: result.insertedId.toString(),
        ...newProduct,
      };
    }

    console.log('[v0] addProduct using in-memory fallback');
    const id = new ObjectId().toString();
    const productWithId: Product & { _id: string } = { _id: id, ...newProduct };
    products.push(productWithId);
    console.log('[v0] addProduct inserted to memory, returning:', { _id: id, ...newProduct });
    return { _id: id, ...newProduct };
  } catch (error) {
    console.error('[v0] Failed to create product:', error);
    return null;
  }
}

export async function updateProduct(
  id: string,
  name: string,
  price: number,
  category: string,
  tandirName?: string,
  tandirCapacity?: number
): Promise<boolean> {
  try {
    const update = {
      name,
      price,
      category,
      tandirName,
      tandirCapacity,
      updatedAt: new Date(),
    };

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('products');
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );
      return result.modifiedCount > 0;
    }

    const index = products.findIndex((p) => p._id === id);
    if (index === -1) return false;
    products[index] = { ...products[index], ...update };
    return true;
  } catch (error) {
    console.error('Failed to update product:', error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    console.log('[v0] deleteProduct called with id:', id);
    const db = await getDatabaseOrNull();

    if (db) {
      const collection = db.collection('products');
      console.log('[v0] Deleting from MongoDB with id:', id);
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      console.log('[v0] MongoDB delete result:', result.deletedCount);
      return result.deletedCount > 0;
    }

    const index = products.findIndex((p) => p._id === id);
    if (index === -1) {
      console.log('[v0] Product not found in memory with id:', id);
      return false;
    }
    console.log('[v0] Deleting from memory at index:', index);
    products.splice(index, 1);
    return true;
  } catch (error) {
    console.error('[v0] Failed to delete product:', error);
    return false;
  }
}

// Order Actions
export async function getOrders(): Promise<Order[]> {
  try {
    let allOrders: any[] = [];

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('orders');
      allOrders = await collection.find({}).toArray();
      return allOrders.map((doc) => ({
        _id: doc._id.toString(),
        orderNumber: doc.orderNumber,
        customerName: doc.customerName,
        phoneNumber: doc.phoneNumber,
        items: doc.items,
        totalPrice: doc.totalPrice,
        advancePayment: doc.advancePayment,
        remainingAmount: doc.remainingAmount,
        status: doc.status,
        orderDate: new Date(doc.orderDate),
        orderTime: doc.orderTime,
        createdAt: new Date(doc.createdAt),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
        completedAt: doc.completedAt ? new Date(doc.completedAt) : undefined,
        archivedAt: doc.archivedAt ? new Date(doc.archivedAt) : undefined,
        notes: doc.notes,
      })).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return orders as Order[];
  } catch (error) {
    console.error('[v0] Failed to get orders:', error);
    return orders as Order[];
  }
}

export async function getActiveOrders(): Promise<Order[]> {
  try {
    const allOrders = await getOrders();
    const active = allOrders.filter((o) => o.status === 'jarayonda');
    console.log('[v0] getActiveOrders returning:', active.length, 'orders');
    return active;
  } catch (error) {
    console.error('Failed to get active orders:', error);
    return [];
  }
}

export async function getCompletedOrders(): Promise<Order[]> {
  try {
    const allOrders = await getOrders();
    const completed = allOrders.filter((o) => o.status === 'bajarildi');
    console.log('[v0] getCompletedOrders returning:', completed.length, 'orders');
    return completed;
  } catch (error) {
    console.error('Failed to get completed orders:', error);
    return [];
  }
}

export async function getArchivedOrders(): Promise<Order[]> {
  try {
    const allOrders = await getOrders();
    const archived = allOrders.filter((o) => o.archivedAt);
    console.log('[v0] getArchivedOrders returning:', archived.length, 'orders');
    return archived;
  } catch (error) {
    console.error('Failed to get archived orders:', error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('orders');
      const doc = await collection.findOne({ _id: new ObjectId(id) });
      if (!doc) return null;
      return {
        _id: doc._id.toString(),
        orderNumber: doc.orderNumber,
        customerName: doc.customerName,
        phoneNumber: doc.phoneNumber,
        items: doc.items,
        totalPrice: doc.totalPrice,
        advancePayment: doc.advancePayment,
        remainingAmount: doc.remainingAmount,
        status: doc.status,
        orderDate: new Date(doc.orderDate),
        orderTime: doc.orderTime,
        createdAt: new Date(doc.createdAt),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
        completedAt: doc.completedAt ? new Date(doc.completedAt) : undefined,
        archivedAt: doc.archivedAt ? new Date(doc.archivedAt) : undefined,
        notes: doc.notes,
      };
    }

    const order = orders.find((o) => o._id === id);
    if (!order) return null;
    const { _id, ...rest } = order;
    return rest as Order;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

export async function createOrder(
  customerName: string,
  phoneNumber: string,
  items: OrderItem[],
  totalPrice: number,
  advancePayment: number,
  orderDate: Date,
  orderTime: string,
  notes?: string
): Promise<Order | null> {
  try {
    const orderNumber = `ORD-${Date.now()}`;
    const newOrder = {
      orderNumber,
      customerName,
      phoneNumber,
      items,
      totalPrice,
      advancePayment,
      remainingAmount: totalPrice - advancePayment,
      status: 'jarayonda',
      orderDate,
      orderTime,
      createdAt: new Date(),
      notes,
    };

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('orders');
      const result = await collection.insertOne(newOrder);
      return {
        _id: result.insertedId.toString(),
        ...newOrder,
      };
    }

    const id = new ObjectId().toString();
    const orderWithId: Order & { _id: string } = { _id: id, ...newOrder };
    orders.push(orderWithId);
    return newOrder as Order;
  } catch (error) {
    console.error('Failed to create order:', error);
    return null;
  }
}

export async function updateOrderStatus(
  id: string,
  status: 'jarayonda' | 'bajarildi'
): Promise<boolean> {
  try {
    console.log('[v0] updateOrderStatus called with id:', id, 'status:', status);
    
    const db = await getDatabaseOrNull();
    
    if (db) {
      const collection = db.collection('orders');
      
      const update = {
        status,
        updatedAt: new Date(),
        completedAt: status === 'bajarildi' ? new Date() : null,
        archivedAt: status === 'bajarildi' ? new Date() : null,
      };
      
      console.log('[v0] Updating MongoDB order with id:', id, 'update:', update);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );
      
      console.log('[v0] MongoDB update result:', result.modifiedCount);
      return result.modifiedCount > 0;
    }

    // Fallback to in-memory
    console.log('[v0] Using in-memory update');
    const index = orders.findIndex((o) => o._id === id);
    if (index === -1) {
      console.log('[v0] Order not found with id:', id);
      return false;
    }
    
    console.log('[v0] Found order at index:', index);
    console.log('[v0] Current order status:', orders[index].status);
    
    const updatedOrder = {
      ...orders[index],
      status,
      updatedAt: new Date(),
      completedAt: status === 'bajarildi' ? new Date() : orders[index].completedAt,
      archivedAt: status === 'bajarildi' ? new Date() : orders[index].archivedAt,
    };
    
    orders[index] = updatedOrder;
    console.log('[v0] Updated order:', orders[index]);
    console.log('[v0] Total orders in memory:', orders.length);
    console.log('[v0] Orders with status bajarildi:', orders.filter(o => o.status === 'bajarildi').length);
    return true;
  } catch (error) {
    console.error('[v0] Failed to update order status:', error);
    return false;
  }
}

export async function updateOrderPayment(
  id: string,
  advancePayment: number
): Promise<boolean> {
  try {
    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('orders');
      const order = await collection.findOne({ _id: new ObjectId(id) });
      if (!order) return false;

      const remainingAmount = order.totalPrice - advancePayment;
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { advancePayment, remainingAmount } }
      );
      return result.modifiedCount > 0;
    }

    const index = orders.findIndex((o) => o._id === id);
    if (index === -1) return false;

    const order = orders[index];
    const remainingAmount = order.totalPrice - advancePayment;

    orders[index] = {
      ...order,
      advancePayment,
      remainingAmount,
    };
    return true;
  } catch (error) {
    console.error('Failed to update order payment:', error);
    return false;
  }
}

export async function archiveOrder(id: string): Promise<boolean> {
  try {
    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('orders');
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { archivedAt: new Date() } }
      );
      return result.modifiedCount > 0;
    }

    const index = orders.findIndex((o) => o._id === id);
    if (index === -1) return false;
    orders[index] = {
      ...orders[index],
      archivedAt: new Date(),
    };
    return true;
  } catch (error) {
    console.error('Failed to archive order:', error);
    return false;
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('orders');
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    }

    const index = orders.findIndex((o) => o._id === id);
    if (index === -1) return false;
    orders.splice(index, 1);
    return true;
  } catch (error) {
    console.error('Failed to delete order:', error);
    return false;
  }
}

export async function searchOrders(query: string): Promise<Order[]> {
  try {
    const allOrders = await getOrders();
    return allOrders
      .filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
          order.customerName.toLowerCase().includes(query.toLowerCase()) ||
          order.items.some((item) =>
            item.productName.toLowerCase().includes(query.toLowerCase())
          )
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  } catch (error) {
    console.error('Failed to search orders:', error);
    return [];
  }
}

// Daily Report Actions - One report per day per product
export async function getAllReports(): Promise<DailyReportSummary[]> {
  try {
    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const docs = await collection.find({}).sort({ date: -1 }).toArray();
      console.log('[v0] getAllReports fetched from MongoDB:', docs.length, 'reports');
      return docs.map((doc) => formatReport(doc));
    }

    console.log('[v0] getAllReports using in-memory fallback:', dailyReports.length, 'reports');
    return dailyReports.map((r) => formatReport(r)).sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('[v0] Failed to get all reports:', error);
    return [];
  }
}

export async function getTodaysReports(): Promise<DailyReportSummary[]> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const docs = await collection.find({ date: dateStr }).toArray();
      console.log('[v0] getTodaysReports fetched from MongoDB:', docs.length, 'reports');
      return docs.map((doc) => formatReport(doc));
    }

    console.log('[v0] getTodaysReports using in-memory fallback');
    const reports = dailyReports.filter((r) => r.date === dateStr);
    return reports.map((r) => formatReport(r));
  } catch (error) {
    console.error('[v0] Failed to fetch today reports:', error);
    return [];
  }
}

export async function getTodaysReport(): Promise<DailyReportSummary | null> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const doc = await collection.findOne({ date: dateStr });
      if (!doc) return null;

      return formatReport(doc);
    }

    const report = dailyReports.find((r) => r.date === dateStr);
    if (!report) return null;

    return formatReport(report);
  } catch (error) {
    console.error('Failed to fetch today report:', error);
    return null;
  }
}

export async function initializeDailyReport(
  productId: string,
  productName: string,
  productPrice: number,
  tandirCapacity: number
): Promise<DailyReportSummary | null> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      
      // Find report by date + productId (unique key)
      let doc = await collection.findOne({ date: dateStr, productId });
      
      if (doc) {
        console.log('[v0] Report exists for', productName, 'on', dateStr);
        // Just update the tandir capacity if needed
        const result = await collection.updateOne(
          { date: dateStr, productId },
          {
            $set: {
              tandirCapacity,
              updatedAt: new Date(),
            },
          }
        );
        doc = await collection.findOne({ date: dateStr, productId });
      } else {
        // Get yesterday's report for THIS product to carry forward remaining bread
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const yesterdayReport = await collection.findOne({ date: yesterdayStr, productId });
        const previousDayRemainingBread = yesterdayReport?.remainingBread || 0;

        console.log('[v0] Creating new report for', productName, 'on', dateStr);

        // Create new report for this product on this date
        const newReport = {
          date: dateStr,
          productId,
          productName,
          productPrice,
          tandirCapacity,
          tandirCount: 0,
          extraBread: 0,
          previousDayRemainingBread,
          totalBread: previousDayRemainingBread,
          badBread: 0,
          remainingBread: 0,
          netBread: previousDayRemainingBread,
          totalExpense: 0,
          expenses: [],
          createdAt: new Date(),
        };
        const result = await collection.insertOne(newReport);
        doc = await collection.findOne({ _id: result.insertedId });
      }

      return formatReport(doc);
    }

    // Fallback to in-memory
    let report = dailyReports.find((r) => r.date === dateStr && r.productId === productId);
    
    if (report) {
      console.log('[v0] Report exists in memory for', productName, 'on', dateStr);
      report.tandirCapacity = tandirCapacity;
      report.updatedAt = new Date();
    } else {
      // Get yesterday's report for THIS product to carry forward remaining bread
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const yesterdayReport = dailyReports.find((r) => r.date === yesterdayStr && r.productId === productId);
      const previousDayRemainingBread = yesterdayReport?.remainingBread || 0;

      console.log('[v0] Creating new report in memory for', productName, 'on', dateStr);

      // Create new report for this product on this date
      const id = new ObjectId().toString();
      const newReport: DailyReport & { _id: string } = {
        _id: id,
        date: dateStr,
        productId,
        productName,
        productPrice,
        tandirCapacity,
        tandirCount: 0,
        extraBread: 0,
        previousDayRemainingBread,
        totalBread: previousDayRemainingBread,
        badBread: 0,
        remainingBread: 0,
        netBread: previousDayRemainingBread,
        totalExpense: 0,
        expenses: [],
        createdAt: new Date(),
      };
      dailyReports.push(newReport);
      report = newReport;
    }

    return formatReport(report);
  } catch (error) {
    console.error('[v0] Failed to initialize daily report:', error);
    return null;
  }
}

export async function addTandir(productId: string): Promise<DailyReportSummary | null> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    console.log('[v0] addTandir called for product:', productId);

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const report = await collection.findOne({ date: dateStr, productId });
      if (!report) return null;

      const newTandirCount = report.tandirCount + 1;
      const dailyProduced = newTandirCount * report.tandirCapacity + report.extraBread;
      const newTotalBread = report.previousDayRemainingBread + dailyProduced;
      const newNetBread = newTotalBread - report.badBread - report.remainingBread;

      await collection.updateOne(
        { date: dateStr, productId },
        {
          $set: {
            tandirCount: newTandirCount,
            totalBread: newTotalBread,
            netBread: newNetBread,
            updatedAt: new Date(),
          },
        }
      );

      const updated = await collection.findOne({ date: dateStr, productId });
      return formatReport(updated);
    }

    const report = dailyReports.find((r) => r.date === dateStr && r.productId === productId);
    if (!report) return null;

    report.tandirCount += 1;
    const dailyProduced = report.tandirCount * report.tandirCapacity + report.extraBread;
    report.totalBread = report.previousDayRemainingBread + dailyProduced;
    report.netBread = report.totalBread - report.badBread - report.remainingBread;
    report.updatedAt = new Date();

    return formatReport(report);
  } catch (error) {
    console.error('[v0] Failed to add tandir:', error);
    return null;
  }
}

export async function addExtraBread(productId: string, quantity: number): Promise<DailyReportSummary | null> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    console.log('[v0] addExtraBread called for product:', productId, 'quantity:', quantity);

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const report = await collection.findOne({ date: dateStr, productId });
      if (!report) return null;

      const newExtraBread = report.extraBread + quantity;
      const dailyProduced = report.tandirCount * report.tandirCapacity + newExtraBread;
      const newTotalBread = report.previousDayRemainingBread + dailyProduced;
      const newNetBread = newTotalBread - report.badBread - report.remainingBread;

      await collection.updateOne(
        { date: dateStr, productId },
        {
          $set: {
            extraBread: newExtraBread,
            totalBread: newTotalBread,
            netBread: newNetBread,
            updatedAt: new Date(),
          },
        }
      );

      const updated = await collection.findOne({ date: dateStr, productId });
      return formatReport(updated);
    }

    const report = dailyReports.find((r) => r.date === dateStr && r.productId === productId);
    if (!report) return null;

    report.extraBread += quantity;
    const dailyProduced = report.tandirCount * report.tandirCapacity + report.extraBread;
    report.totalBread = report.previousDayRemainingBread + dailyProduced;
    report.netBread = report.totalBread - report.badBread - report.remainingBread;
    report.updatedAt = new Date();

    return formatReport(report);
  } catch (error) {
    console.error('[v0] Failed to add extra bread:', error);
    return null;
  }
}

export async function addBadBread(productId: string, quantity: number): Promise<DailyReportSummary | null> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    console.log('[v0] addBadBread called for product:', productId, 'quantity:', quantity);

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const report = await collection.findOne({ date: dateStr, productId });
      if (!report) return null;

      const newBadBread = report.badBread + quantity;
      const newNetBread = report.totalBread - newBadBread - report.remainingBread;

      await collection.updateOne(
        { date: dateStr, productId },
        {
          $set: {
            badBread: newBadBread,
            netBread: newNetBread,
            updatedAt: new Date(),
          },
        }
      );

      const updated = await collection.findOne({ date: dateStr, productId });
      return formatReport(updated);
    }

    const report = dailyReports.find((r) => r.date === dateStr && r.productId === productId);
    if (!report) return null;

    report.badBread += quantity;
    report.netBread = report.totalBread - report.badBread - report.remainingBread;
    report.updatedAt = new Date();

    return formatReport(report);
  } catch (error) {
    console.error('[v0] Failed to add bad bread:', error);
    return null;
  }
}

export async function updateRemainingBread(productId: string, quantity: number): Promise<DailyReportSummary | null> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    console.log('[v0] updateRemainingBread called for product:', productId, 'quantity:', quantity);

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const report = await collection.findOne({ date: dateStr, productId });
      if (!report) return null;

      const newNetBread = report.totalBread - report.badBread - quantity;

      await collection.updateOne(
        { date: dateStr, productId },
        {
          $set: {
            remainingBread: quantity,
            netBread: newNetBread,
            updatedAt: new Date(),
          },
        }
      );

      const updated = await collection.findOne({ date: dateStr, productId });
      return formatReport(updated);
    }

    const report = dailyReports.find((r) => r.date === dateStr && r.productId === productId);
    if (!report) return null;

    report.remainingBread = quantity;
    report.netBread = report.totalBread - report.badBread - report.remainingBread;
    report.updatedAt = new Date();

    return formatReport(report);
  } catch (error) {
    console.error('[v0] Failed to update remaining bread:', error);
    return null;
  }
}

export async function deleteReport(reportId: string): Promise<boolean> {
  try {
    console.log('[v0] deleteReport called with id:', reportId);
    
    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      console.log('[v0] Deleting report from MongoDB with id:', reportId);
      const result = await collection.deleteOne({ _id: new ObjectId(reportId) });
      console.log('[v0] MongoDB delete result:', result.deletedCount);
      return result.deletedCount > 0;
    }

    // Fallback to in-memory
    const index = dailyReports.findIndex((r) => r._id === reportId);
    if (index === -1) {
      console.log('[v0] Report not found in memory with id:', reportId);
      return false;
    }
    console.log('[v0] Deleting report from memory at index:', index);
    dailyReports.splice(index, 1);
    return true;
  } catch (error) {
    console.error('[v0] Failed to delete report:', error);
    return false;
  }
}

export async function addExpense(amount: number, note?: string): Promise<DailyReportSummary | null> {
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    console.log('[v0] addExpense called:', { amount, note, date: dateStr });

    const db = await getDatabaseOrNull();
    if (db) {
      const collection = db.collection('daily_reports');
      const report = await collection.findOne({ date: dateStr });
      if (!report) {
        console.log('[v0] Report not found for date:', dateStr);
        return null;
      }

      const currentExpense = report.totalExpense || 0;
      const newTotalExpense = currentExpense + amount;
      const expenseEntry = { amount, note: note || '', createdAt: new Date() };

      await collection.updateOne(
        { date: dateStr },
        {
          $set: {
            totalExpense: newTotalExpense,
            updatedAt: new Date(),
          },
          $push: {
            expenses: expenseEntry,
          },
        }
      );

      const updated = await collection.findOne({ date: dateStr });
      console.log('[v0] Expense added successfully, new total:', newTotalExpense);
      return formatReport(updated);
    }

    const report = dailyReports.find((r) => r.date === dateStr);
    if (!report) return null;

    const currentExpense = report.totalExpense || 0;
    report.totalExpense = currentExpense + amount;
    if (!report.expenses) report.expenses = [];
    report.expenses.push({ amount, note: note || '', createdAt: new Date() });
    report.updatedAt = new Date();

    return formatReport(report);
  } catch (error) {
    console.error('[v0] Failed to add expense:', error);
    return null;
  }
}
