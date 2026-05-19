export interface ScanHistoryItem {
  id: string;
  timestamp: Date;
  text: string;
  thumbnail: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  sheetName: string;
  confidence: number;
  type: 'invoice' | 'receipt' | 'form' | 'handwritten' | 'label' | 'document';
}

export interface SpreadsheetConnection {
  id: string;
  name: string;
  lastSync: Date;
  rowsAdded: number;
  autoSync: boolean;
  url: string;
}

export const mockUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@gmail.com',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
  connected: true,
};

export const mockSpreadsheets: SpreadsheetConnection[] = [
  {
    id: '1',
    name: 'Business Receipts 2024',
    lastSync: new Date(Date.now() - 1000 * 60 * 5),
    rowsAdded: 142,
    autoSync: true,
    url: 'https://docs.google.com/spreadsheets',
  },
  {
    id: '2',
    name: 'Invoice Tracker',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2),
    rowsAdded: 87,
    autoSync: false,
    url: 'https://docs.google.com/spreadsheets',
  },
  {
    id: '3',
    name: 'Field Notes Log',
    lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24),
    rowsAdded: 34,
    autoSync: true,
    url: 'https://docs.google.com/spreadsheets',
  },
];

export const mockOCRTexts = [
  `INVOICE #INV-2024-0847
Date: November 15, 2024
Due: December 15, 2024

Bill To:
Acme Corporation
123 Business Avenue
New York, NY 10001

Description          Qty    Unit Price    Total
Web Development       40h    $125.00      $5,000.00
UI/UX Design          20h    $95.00       $1,900.00
Project Management     8h    $75.00         $600.00

Subtotal: $7,500.00
Tax (8.5%): $637.50
Total Due: $8,137.50`,

  `RECEIPT
WHOLE FOODS MARKET
1234 Main St, Austin TX

Date: 11/15/2024 14:32
Cashier: Sarah T.

Organic Bananas (2.3 lbs)     $1.84
Avocado (3)                   $4.49
Sourdough Bread                $6.99
Greek Yogurt 32oz              $7.49
Kombucha GT's Original         $4.29
Free Range Eggs (12)           $6.99

Subtotal:                     $32.09
Tax:                           $0.00
Total:                        $32.09
Card: Visa ****4521`,

  `Meeting Notes - Q4 Strategy
Date: November 14, 2024

Attendees: Alex, Sarah, Michael, Lisa

Action Items:
1. Launch new product line by Dec 1
2. Complete market research report
3. Schedule client presentations
4. Review Q3 performance metrics

Budget Approved: $45,000
Timeline: 6 weeks
Priority: HIGH`,
];

export const mockScanHistory: ScanHistoryItem[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    text: 'INVOICE #INV-2024-0847\nDate: November 15, 2024\nTotal Due: $8,137.50',
    thumbnail: 'https://images.pexels.com/photos/95916/pexels-photo-95916.jpeg?auto=compress&cs=tinysrgb&w=400',
    syncStatus: 'synced',
    sheetName: 'Business Receipts 2024',
    confidence: 97,
    type: 'invoice',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    text: 'RECEIPT - WHOLE FOODS MARKET\nTotal: $32.09\nCard: Visa ****4521',
    thumbnail: 'https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?auto=compress&cs=tinysrgb&w=400',
    syncStatus: 'synced',
    sheetName: 'Business Receipts 2024',
    confidence: 94,
    type: 'receipt',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    text: 'Meeting Notes - Q4 Strategy\nAttendees: Alex, Sarah, Michael\nBudget: $45,000',
    thumbnail: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400',
    syncStatus: 'pending',
    sheetName: 'Field Notes Log',
    confidence: 88,
    type: 'handwritten',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    text: 'Product Label: Organic Green Tea\nNet Weight: 100g\nExpiry: 03/2026\nLot: GT-2024-089',
    thumbnail: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400',
    syncStatus: 'synced',
    sheetName: 'Invoice Tracker',
    confidence: 99,
    type: 'label',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    text: 'Purchase Order #PO-789\nVendor: TechSupply Co\nItems: 50x USB-C Hubs\nTotal: $2,750.00',
    thumbnail: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400',
    syncStatus: 'failed',
    sheetName: 'Invoice Tracker',
    confidence: 91,
    type: 'form',
  },
];

export const mockStats = {
  totalScans: 247,
  thisWeek: 18,
  rowsSynced: 1432,
  avgConfidence: 94,
};

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${diffDay}d ago`;
}
