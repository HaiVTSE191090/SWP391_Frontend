export interface ApiResponse<T> {
  status: string;
  code: number;
  data: T;
  message: string;
}

export interface InvoiceDetailResponse {
  invoiceId: number;
  bookingId: number;
  type: string; // Có thể là: "DEPOSIT" | "FINAL"
  depositAmount: number;
  totalAmount: number;
  refundAmount: number | null;
  amountRemaining: number;
  status: string; // Có thể là: "PAID" | "PENDING"
  paymentMethod: string; // Có thể là: "MOMO" | "VNPAY"
  notes: string;
  createdAt: string; // ISO date string
  completedAt: string; // ISO date string
  details: InvoiceDetail[];
}

export interface InvoiceDetail {
  invoiceDetailId: number;
  type: string; // Ví dụ: "SPAREPART"
  priceListId: number;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}
