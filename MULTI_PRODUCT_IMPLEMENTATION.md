# Multiple Products Per Day Implementation

## Overview
Fixed the daily report system to support MULTIPLE PRODUCTS PER DAY instead of just one product per date.

## Key Changes

### 1. Database Uniqueness (date + productId)
- Reports now use a unique combination of `date + productId` instead of just `date`
- This allows multiple products to have separate report cards on the same day
- Each product maintains independent calculations

### 2. New Server Functions

#### `getTodaysReports()` (plural)
- Returns ALL reports for today as an array
- Filters by current date only
- Maps all documents through `formatReport()`

#### Updated Existing Functions
- `initializeDailyReport()` - Now creates separate reports per product, queries by `date + productId`
- `addTandir(productId)` - Accepts productId parameter, updates specific product's report
- `addExtraBread(productId, quantity)` - Accepts productId, updates specific product
- `addBadBread(productId, quantity)` - Accepts productId, updates specific product
- `updateRemainingBread(productId, quantity)` - Accepts productId, updates specific product

### 3. UI Refactoring (`/app/reports/page.tsx`)

#### New State Variables
- `todaysReports`: Array of all reports for today
- `activeReportId`: Currently selected report ID (for highlighting)
- `showAddProductDialog`: New dialog to add another product to today
- Dialog states now store the report ID instead of boolean (nullable string)

#### New Features
1. **"Yangi mahsulot qo'shish" Button** - Appears at top when there are already reports for today
2. **Multi-Card Layout** - Shows all products as clickable cards in a grid (1 or 2 columns)
3. **Active Report Highlighting** - Selected card is highlighted with blue border
4. **Delete Buttons** - Each card has a delete button to remove that product's report
5. **Action Buttons** - Only show when a report is selected (via activeReport)

#### Layout
```
Kunlik Hisobot
├── [Yangi mahsulot qo'shish] button
├── Grid of Product Cards (1 or 2 columns on lg screens)
│   ├── Product 1 Card (Non)
│   ├── Product 2 Card (Patir)
│   └── etc.
└── [Action Buttons] (only when report selected)
    ├── Tandir qoʻsh
    ├── Qoʻshimcha qoʻsh
    ├── Yaroqsiz qoʻsh
    ├── Qolgan nonni belgilash
    └── Chiqim qoʻsh
```

### 4. Calculations
Each product's report calculates independently:
```
dailyProduced = (tandirCount * tandirCapacity) + extraBread
totalBread = previousDayRemainingBread + dailyProduced
netBread = totalBread - badBread - remainingBread
totalValue = totalBread * productPrice
netValue = netBread * productPrice
finalNetValue = netValue - totalExpense
```

### 5. Expenses
- Expenses are still per-day (not per-product)
- When adding expense, it applies to the daily total
- Each product shows totalExpense and finalNetValue

## Migration Notes
- Existing single-product reports will continue to work
- New products can be added to any date using `"Yangi mahsulot qo'shish"` button
- Database queries now must include productId for specificity
- In-memory fallback also supports multiple products per date

## Benefits
1. Accurate tracking of multiple bakery products per day
2. Separate calculations for each product
3. Better financial visibility (total vs per-product)
4. Easy to add/remove products throughout the day
5. Maintains historical accuracy with proper database keys
