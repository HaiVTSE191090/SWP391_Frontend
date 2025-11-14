export interface ApiResponse<T> {
  status: string;
  code: number;
  data: T;
  message: string | null;
}


export interface Wallet {
  walletId: number;
  renterId: number;
  renterName: string;
  renterEmail: string;
  balance: number;
  status: "INACTIVE" | "ACTIVE";
  createdAt: string;
  updatedAt: string;
  details: InvoiceDetail[];
}

export interface RefundResponse {
  wallet: Wallet;
  message: string;
  bookingId: number;
}

export interface InvoiceDetail {
  invoiceDetailId: number;
  type: string; 
  priceListId: number;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}