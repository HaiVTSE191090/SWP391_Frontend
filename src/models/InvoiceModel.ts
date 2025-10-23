export interface InvoiceDetail {
  invoiceDetailId: number;
  type: "SPAREPART" | "SERVICE" | "Penalty";
  priceListId: number;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceModel {
  invoiceId: number;
  bookingId: number;
  type: "DEPOSIT" | "FINAL";
  depositAmount: number;
  totalAmount: number;
  status: "UNPAID" | "PAID" | "CANCELLED" | "PARTIALLY_PAID";
  paymentMethod: "CASH" | "MOMO" | "WALLET";
  notes: string;
  createdAt: string;      // ISO format date
  completedAt: string;    // ISO format date
  details: InvoiceDetail[];


}