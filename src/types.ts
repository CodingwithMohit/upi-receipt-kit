export type PaymentStatus = "paid" | "pending" | "expired";

export interface Merchant {
  name: string;
  tagline: string;
  supportEmail: string;
  supportHours: string;
  addressLine: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  unitPriceINR: number;
}

export interface PaymentSource {
  status: PaymentStatus;
  reference: string;
  initiatedAt: string;
  expiresAt: string;
  expiryWindowMinutes: number;
  settledAt?: string;
  expiredAt?: string;
}

export interface OrderSource {
  orderNumber: string;
  customerName: string;
  orderedAt: string;
  emailSubject: string;
  emailPreheader: string;
  items: OrderItem[];
  shippingINR: number;
  payment: PaymentSource;
}

export interface OrderLine extends OrderItem {
  lineTotalINR: number;
}

export interface ReceiptOrder extends Omit<OrderSource, "items" | "payment"> {
  items: OrderLine[];
  subtotalINR: number;
  totalINR: number;
  payment: PaymentSource & { amountINR: number };
}
