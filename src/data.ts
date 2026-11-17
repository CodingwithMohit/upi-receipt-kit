import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type {
  Merchant,
  OrderItem,
  OrderSource,
  PaymentSource,
  PaymentStatus,
  ReceiptOrder,
} from "./types.js";

const merchantPath = new URL("../data/merchant.json", import.meta.url);

function readJson(path: URL): unknown {
  return JSON.parse(readFileSync(fileURLToPath(path), "utf8")) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringField(record: Record<string, unknown>, key: string, context: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${context}.${key} must be a non-empty string`);
  }
  return value;
}

function integerField(record: Record<string, unknown>, key: string, context: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${context}.${key} must be a non-negative safe integer`);
  }
  return value;
}

function validTimestamp(value: string, context: string): string {
  if (!Number.isFinite(Date.parse(value))) {
    throw new Error(`${context} must be a valid timestamp`);
  }
  return value;
}

function parseMerchant(value: unknown): Merchant {
  if (!isRecord(value)) {
    throw new Error("data/merchant.json must contain an object");
  }
  return {
    name: stringField(value, "name", "merchant"),
    tagline: stringField(value, "tagline", "merchant"),
    supportEmail: stringField(value, "supportEmail", "merchant"),
    supportHours: stringField(value, "supportHours", "merchant"),
    addressLine: stringField(value, "addressLine", "merchant"),
  };
}

function parseItem(value: unknown, index: number): OrderItem {
  const context = `order.items[${index}]`;
  if (!isRecord(value)) {
    throw new Error(`${context} must be an object`);
  }
  const quantity = integerField(value, "quantity", context);
  const unitPriceINR = integerField(value, "unitPriceINR", context);
  if (quantity < 1 || unitPriceINR < 1) {
    throw new Error(`${context} quantity and unitPriceINR must be greater than zero`);
  }
  return {
    sku: stringField(value, "sku", context),
    name: stringField(value, "name", context),
    quantity,
    unitPriceINR,
  };
}

function parsePayment(value: unknown): PaymentSource {
  if (!isRecord(value)) {
    throw new Error("order.payment must be an object");
  }
  const status = value.status;
  if (status !== "paid" && status !== "pending" && status !== "expired") {
    throw new Error("order.payment.status must be paid, pending, or expired");
  }
  const initiatedAt = validTimestamp(
    stringField(value, "initiatedAt", "payment"),
    "payment.initiatedAt",
  );
  const expiresAt = validTimestamp(stringField(value, "expiresAt", "payment"), "payment.expiresAt");
  const expiryWindowMinutes = integerField(value, "expiryWindowMinutes", "payment");
  if (expiryWindowMinutes < 1) {
    throw new Error("payment.expiryWindowMinutes must be greater than zero");
  }

  const payment: PaymentSource = {
    status,
    reference: stringField(value, "reference", "payment"),
    initiatedAt,
    expiresAt,
    expiryWindowMinutes,
  };
  if (value.settledAt !== undefined) {
    payment.settledAt = validTimestamp(
      stringField(value, "settledAt", "payment"),
      "payment.settledAt",
    );
  }
  if (value.expiredAt !== undefined) {
    payment.expiredAt = validTimestamp(
      stringField(value, "expiredAt", "payment"),
      "payment.expiredAt",
    );
  }
  return payment;
}

function parseOrder(value: unknown): OrderSource {
  if (!isRecord(value)) {
    throw new Error("Order data must contain an object");
  }
  if (!Array.isArray(value.items) || value.items.length === 0) {
    throw new Error("order.items must contain at least one item");
  }
  return {
    orderNumber: stringField(value, "orderNumber", "order"),
    customerName: stringField(value, "customerName", "order"),
    orderedAt: validTimestamp(stringField(value, "orderedAt", "order"), "order.orderedAt"),
    emailSubject: stringField(value, "emailSubject", "order"),
    emailPreheader: stringField(value, "emailPreheader", "order"),
    items: value.items.map(parseItem),
    shippingINR: integerField(value, "shippingINR", "order"),
    payment: parsePayment(value.payment),
  };
}

export function loadMerchant(): Merchant {
  return parseMerchant(readJson(merchantPath));
}

export function loadOrder(status: PaymentStatus): ReceiptOrder {
  const path = new URL(`../data/orders/${status}.json`, import.meta.url);
  const source = parseOrder(readJson(path));
  if (source.payment.status !== status) {
    throw new Error(`data/orders/${status}.json contains status ${source.payment.status}`);
  }
  return calculateOrder(source);
}

export function calculateOrder(source: OrderSource): ReceiptOrder {
  const items = source.items.map((item) => {
    const lineTotalINR = item.quantity * item.unitPriceINR;
    if (!Number.isSafeInteger(lineTotalINR)) {
      throw new Error(`Line total for ${item.sku} exceeds the safe integer range`);
    }
    return { ...item, lineTotalINR };
  });
  const subtotalINR = items.reduce((sum, item) => sum + item.lineTotalINR, 0);
  const totalINR = subtotalINR + source.shippingINR;
  if (!Number.isSafeInteger(totalINR)) {
    throw new Error(`Order ${source.orderNumber} total exceeds the safe integer range`);
  }
  return {
    ...source,
    items,
    subtotalINR,
    totalINR,
    payment: { ...source.payment, amountINR: totalINR },
  };
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(amountINR: number): string {
  if (!Number.isFinite(amountINR)) {
    throw new Error("Money amount must be a finite number");
  }
  return inrFormatter.format(amountINR);
}
