'use client';

import { useEffect, useState } from 'react';
import {
  getTodaysReport,
  getTodaysReports,
  initializeDailyReport,
  addTandir,
  addExtraBread,
  addBadBread,
  updateRemainingBread,
  getProducts,
  getAllReports,
  deleteReport,
  addExpense,
} from '@/app/actions';
import { DailyReportSummary, Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, TrendingUp, Trash2 } from 'lucide-react';

export default function ReportsPage() {
  const [todaysReports, setTodaysReports] = useState<DailyReportSummary[]>([]);
  const [allReports, setAllReports] = useState<DailyReportSummary[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [showExtraDialog, setShowExtraDialog] = useState<string | null>(null);
  const [showBadDialog, setShowBadDialog] = useState<string | null>(null);
  const [showRemainingDialog, setShowRemainingDialog] = useState<string | null>(null);
  const [showExpenseDialog, setShowExpenseDialog] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [extraQuantity, setExtraQuantity] = useState('');
  const [badQuantity, setBadQuantity] = useState('');
  const [remainingQuantity, setRemainingQuantity] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');

  useEffect(() => {
    loadInitialData();
    const interval = setInterval(loadAllData, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadInitialData() {
    try {
      const [productsData, todaysReportsData, allReportsData] = await Promise.all([
        getProducts(),
        getTodaysReports(),
        getAllReports(),
      ]);
      setProducts(productsData);
      setTodaysReports(todaysReportsData);
      setAllReports(allReportsData);
      if (todaysReportsData.length > 0 && !activeReportId) {
        setActiveReportId(todaysReportsData[0]._id || null);
        setSelectedProduct(todaysReportsData[0].productId);
      } else if (productsData.length > 0) {
        setSelectedProduct(productsData[0]._id);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAllData() {
    try {
      const [todaysReportsData, allReportsData] = await Promise.all([
        getTodaysReports(),
        getAllReports(),
      ]);
      setTodaysReports(todaysReportsData);
      setAllReports(allReportsData);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  }

  async function handleDeleteReport(reportId: string) {
    try {
      const success = await deleteReport(reportId);
      if (success) {
        setShowDeleteDialog(null);
        await loadAllData();
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  }

  async function handleInitialize() {
    if (!selectedProduct) return;
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const newReport = await initializeDailyReport(
      product._id,
      product.name,
      product.price,
      product.tandirCapacity || 50
    );
    if (newReport) {
      setActiveReportId(newReport._id || null);
      await loadAllData();
    }
  }

  async function handleAddTandir() {
    if (!activeReport) return;
    const updated = await addTandir(activeReport.productId);
    if (updated) {
      await loadAllData();
    }
  }

  async function handleAddExtraBread() {
    if (!activeReport || !extraQuantity) return;
    const updated = await addExtraBread(activeReport.productId, parseInt(extraQuantity));
    if (updated) {
      setExtraQuantity('');
      setShowExtraDialog(null);
      await loadAllData();
    }
  }

  async function handleAddBadBread() {
    if (!activeReport || !badQuantity) return;
    const updated = await addBadBread(activeReport.productId, parseInt(badQuantity));
    if (updated) {
      setBadQuantity('');
      setShowBadDialog(null);
      await loadAllData();
    }
  }

  async function handleUpdateRemaining() {
    if (!activeReport || !remainingQuantity) return;
    const updated = await updateRemainingBread(activeReport.productId, parseInt(remainingQuantity));
    if (updated) {
      setRemainingQuantity('');
      setShowRemainingDialog(null);
      await loadAllData();
    }
  }

  async function handleAddExpense() {
    if (!expenseAmount) return;
    const updated = await addExpense(parseInt(expenseAmount), expenseNote);
    if (updated) {
      setExpenseAmount('');
      setExpenseNote('');
      setShowExpenseDialog(null);
      await loadAllData();
    }
  }

  async function handleAddProductToday() {
    if (!selectedProduct) return;
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    const newReport = await initializeDailyReport(
      product._id,
      product.name,
      product.price,
      product.tandirCapacity || 50
    );
    if (newReport) {
      setActiveReportId(newReport._id || null);
      setShowAddProductDialog(false);
      await loadAllData();
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="text-center">Yuklanyapti...</div>
        </div>
      </main>
    );
  }

  const activeReport = todaysReports.find((r) => r._id === activeReportId);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Kunlik Hisobot</h1>
        <p className="text-muted-foreground mb-6">Bugun: {new Date().toISOString().split('T')[0]}</p>

        <div className="space-y-6">
          {/* Add Product Button */}
          {todaysReports.length > 0 && (
            <Button
              onClick={() => setShowAddProductDialog(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Yangi mahsulot qoʻshish
            </Button>
          )}

          {/* Product Report Cards */}
          {todaysReports.length === 0 ? (
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Bugun uchun birinchi mahsulotni tanlang</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product-select">Mahsulot tanlang</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger id="product-select">
                      <SelectValue placeholder="Mahsulot tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.name} ({product.price} so'm)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleInitialize} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Hisobotni oʻrnatish
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {todaysReports.map((report) => (
            <Card
              key={report._id}
              className={`border-2 cursor-pointer transition-all ${
                activeReport?._id === report._id
                  ? 'border-primary bg-blue-50 dark:bg-blue-950'
                  : 'border-border hover:border-primary'
              }`}
              onClick={() => setActiveReportId(report._id || null)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">
                    {report.productName}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(report._id || null);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Input Data */}
                <div className="space-y-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-border">
                  <h3 className="font-semibold text-lg">Kiritish Ma'lumotlari</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="font-medium">Sana:</span>
                      <span>{report.date}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="font-medium">Mahsulot:</span>
                      <span>{report.productName}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="font-medium">Tandir sig'imi:</span>
                      <span>{report.tandirCapacity} dona</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="font-medium">Kechadan qolgan non:</span>
                      <span className="text-blue-600 font-semibold">{report.previousDayRemainingBread}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-100 dark:bg-yellow-900 rounded">
                      <span className="font-medium">Yopilgan tandir soni:</span>
                      <span className="text-lg font-bold">{report.tandirCount}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <span className="font-medium">Qoʻshimcha yopilgan non:</span>
                      <span>{report.extraBread}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Calculations */}
                <div className="space-y-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-border">
                  <h3 className="font-semibold text-lg">Hisob-kitob</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900 rounded">
                      <span className="font-medium">Jami non:</span>
                      <span className="text-lg font-bold text-green-700 dark:text-green-300">{report.totalBread}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-100 dark:bg-red-900 rounded">
                      <span className="font-medium">Yaroqsiz non:</span>
                      <span className="text-lg font-bold text-red-700 dark:text-red-300">{report.badBread}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-orange-100 dark:bg-orange-900 rounded">
                      <span className="font-medium">Kunlik qolgan non:</span>
                      <span className="text-lg font-bold text-orange-700 dark:text-orange-300">{report.remainingBread}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-100 dark:bg-blue-900 rounded">
                      <span className="font-medium">Sof non:</span>
                      <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{report.netBread}</span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="md:col-span-2 space-y-3 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-lg">Qiymati</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded">
                      <span>Jami qiymat:</span>
                      <span className="font-bold">{report.totalValue} so'm</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded">
                      <span>Yaroqsiz zarar:</span>
                      <span className="font-bold text-red-600">{report.badValue} so'm</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded">
                      <span>Qolgan non qiymati:</span>
                      <span className="font-bold text-orange-600">{report.remainingValue} so'm</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded">
                      <span>Sof qiymat:</span>
                      <span className="font-bold text-green-600">{report.netValue} so'm</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded border-2 border-red-300">
                      <span>Chiqim:</span>
                      <span className="font-bold text-red-600">{report.totalExpense} so'm</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded border-2 border-green-300">
                      <span className="font-semibold">Yakuniy sof natija:</span>
                      <span className={`font-bold text-lg ${report.finalNetValue >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {report.finalNetValue} so'm
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
              ))}

              {/* Action Buttons - Only show when a report is active */}
              {activeReport && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
                <Button
                  onClick={handleAddTandir}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tandir qoʻsh
                </Button>

                <Button
                  onClick={() => setShowExtraDialog(activeReport._id || null)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Qoʻshimcha qoʻsh
                </Button>

                <Button
                  onClick={() => setShowBadDialog(activeReport._id || null)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Yaroqsiz qoʻsh
                </Button>

                <Button
                  onClick={() => setShowRemainingDialog(activeReport._id || null)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Qolgan nonni belgilash
                </Button>

                <Button
                  onClick={() => setShowExpenseDialog(activeReport._id || null)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Chiqim qoʻsh
                </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Product Dialog */}
        <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi mahsulot qoʻshish</DialogTitle>
              <DialogDescription>Bugun uchun yangi mahsulot tanlang va qoʻshing</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-product-select">Mahsulot tanlang</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="new-product-select">
                    <SelectValue placeholder="Mahsulot tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.filter(p => !todaysReports.some(r => r.productId === p._id)).map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.name} ({product.price} so'm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddProductToday} className="bg-indigo-600 hover:bg-indigo-700">
                Qoʻshish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Extra Bread Dialog */}
        <Dialog open={showExtraDialog !== null} onOpenChange={(open) => !open && setShowExtraDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Qoʻshimcha non qoʻshish</DialogTitle>
              <DialogDescription>Qoʻshimcha yopilgan non miqdorini kiritng</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="extra-qty">Qoʻshimcha non miqdori</Label>
                <Input
                  id="extra-qty"
                  type="number"
                  value={extraQuantity}
                  onChange={(e) => setExtraQuantity(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExtraBread} className="bg-green-600 hover:bg-green-700">
                Qoʻshish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bad Bread Dialog */}
        <Dialog open={showBadDialog !== null} onOpenChange={(open) => !open && setShowBadDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yaroqsiz non qoʻshish</DialogTitle>
              <DialogDescription>Yaroqsiz yoki buzilgan non miqdorini kiritng</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bad-qty">Yaroqsiz non miqdori</Label>
                <Input
                  id="bad-qty"
                  type="number"
                  value={badQuantity}
                  onChange={(e) => setBadQuantity(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBadBread} className="bg-red-600 hover:bg-red-700">
                Qoʻshish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remaining Bread Dialog */}
        <Dialog open={showRemainingDialog !== null} onOpenChange={(open) => !open && setShowRemainingDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Kunlik qolgan nonlar soni</DialogTitle>
              <DialogDescription>Sotilib ketmagan qolgan non miqdorini belgilang</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="remaining-qty">Bugun sotilib ketmagan non miqdori</Label>
                <Input
                  id="remaining-qty"
                  type="number"
                  value={remainingQuantity}
                  onChange={(e) => setRemainingQuantity(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Ushbu raqam ertaga oʻtkaziladi va jami nonning bir qismi boʻladi.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateRemaining} className="bg-orange-600 hover:bg-orange-700">
                Saqlash
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Expense Dialog */}
        <Dialog open={showExpenseDialog !== null} onOpenChange={(open) => !open && setShowExpenseDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chiqim qoʻshish</DialogTitle>
              <DialogDescription>Bugunning chiqimini kiritng (gaz, suv, ejarate va boshqalar)</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="expense-amount">Chiqim summasi (so'm)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="expense-note">Chiqim izohи (ixtiyoriy)</Label>
                <Input
                  id="expense-note"
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  placeholder="Masalan: Gaz, suv, ejarate..."
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Bu summa kunlik sof natijadan chiqib ketadi.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleAddExpense} className="bg-purple-600 hover:bg-purple-700">
                Qoʻshish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Historical Reports Section */}
        {allReports.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Keyin Hisobotlar</h2>
            <div className="space-y-4">
              {allReports.map((r) => (
                <Card key={r._id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {r.productName} - {r.date}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                        onClick={() => setShowDeleteDialog(r._id || '')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <div className="text-xs text-muted-foreground">Jami non</div>
                      <div className="font-bold text-lg">{r.totalBread}</div>
                    </div>
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded">
                      <div className="text-xs text-muted-foreground">Yaroqsiz</div>
                      <div className="font-bold text-lg text-red-700 dark:text-red-300">{r.badBread}</div>
                    </div>
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded">
                      <div className="text-xs text-muted-foreground">Qoldiq</div>
                      <div className="font-bold text-lg text-orange-700 dark:text-orange-300">{r.remainingBread}</div>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded">
                      <div className="text-xs text-muted-foreground">Sof</div>
                      <div className="font-bold text-lg text-green-700 dark:text-green-300">{r.netBread}</div>
                    </div>
                    <div className="col-span-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <div className="text-xs text-muted-foreground">Sof qiymat</div>
                      <div className="font-bold">{r.netValue} so'm</div>
                    </div>
                    <div className="col-span-2 p-2 bg-slate-100 dark:bg-slate-800 rounded">
                      <div className="text-xs text-muted-foreground">Mahsulot narxi</div>
                      <div className="font-bold">{r.productPrice} so'm</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Delete Report Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog !== null} onOpenChange={(open) => !open && setShowDeleteDialog(null)}>
          <AlertDialogContent>
            <AlertDialogTitle>Hisobotni oʻchirishga ishonchingiz komilmi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu hisobot oʻchiriladi va qayta tiklolmaydi. Ushbu amalni qaytarish mumkin emas.
            </AlertDialogDescription>
            <div className="flex justify-end gap-3">
              <AlertDialogCancel>Bekor</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => showDeleteDialog && handleDeleteReport(showDeleteDialog)}
                className="bg-red-600 hover:bg-red-700"
              >
                Oʻchirish
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
