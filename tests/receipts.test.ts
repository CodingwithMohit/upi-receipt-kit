import { readFileSync, statSync } from "node:fs";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { render } from "@hyper-elements/react";
import { formatMoney, loadMerchant, loadOrder } from "../src/data.js";
import { EmailReceipt } from "../src/templates/EmailReceipt.js";
import { WebReceipt } from "../src/templates/WebReceipt.js";
import type { PaymentStatus } from "../src/types.js";

const states: Array<{ status: PaymentStatus; label: string }> = [
  { status: "paid", label: "Paid" },
  { status: "pending", label: "Pending" },
  { status: "expired", label: "Expired" },
];

describe("INR formatting and order totals", () => {
  it("formats Indian currency with two decimal places", () => {
    expect(formatMoney(124500)).toBe("₹1,24,500.00");
    expect(formatMoney(0)).toBe("₹0.00");
    expect(() => formatMoney(Number.NaN)).toThrow("Money amount must be a finite number");
  });

  it.each(states)("computes $status totals from line items and shipping", ({ status }) => {
    const order = loadOrder(status);
    const expectedSubtotal = order.items.reduce(
      (subtotal, item) => subtotal + item.quantity * item.unitPriceINR,
      0,
    );
    expect(order.subtotalINR).toBe(expectedSubtotal);
    expect(order.totalINR).toBe(expectedSubtotal + order.shippingINR);
    expect(order.payment.amountINR).toBe(order.totalINR);
  });
});

describe("receipt templates", () => {
  const merchant = loadMerchant();

  it.each(states)("renders the $status email and web receipt with status and amount", async ({ status, label }) => {
    const order = loadOrder(status);
    const email = await render(createElement(EmailReceipt, { merchant, order }));
    const page = await render(createElement(WebReceipt, { merchant, order }));
    const amount = formatMoney(order.payment.amountINR);

    expect(email.html).toContain(label);
    expect(email.html).toContain(amount);
    expect(page.html).toContain(label);
    expect(page.html).toContain(amount);
    expect(page.html).not.toMatch(/<script\b/i);
    expect(email.diagnostics.filter((item) => item.severity === "warning")).toEqual([]);
    expect(page.diagnostics.filter((item) => item.severity === "warning")).toEqual([]);
  });

  it.each(states)("keeps the $status email under 100 KB with no JavaScript", async ({ status }) => {
    const result = await render(
      createElement(EmailReceipt, { merchant, order: loadOrder(status) }),
    );
    expect(Buffer.byteLength(result.html, "utf8")).toBeLessThan(100 * 1024);
    expect(result.html).not.toMatch(/<script\b/i);
  });

  it("warns expired customers to check payment status before retrying", async () => {
    const result = await render(
      createElement(EmailReceipt, { merchant, order: loadOrder("expired") }),
    );
    expect(result.html).toContain("Check its final status before trying again");
    expect(result.html).toContain("Retry payment");
    expect(result.html).not.toContain("nothing was charged");
    expect(result.html).not.toContain("will be refunded");
  });
});

describe("generated files", () => {
  it("writes every HTML output and a non-empty A4 PDF", () => {
    const expectedFiles = [
      "email-paid.html",
      "email-pending.html",
      "email-expired.html",
      "email-paid.txt",
      "email-pending.txt",
      "email-expired.txt",
      "receipt-paid.html",
      "receipt-pending.html",
      "receipt-expired.html",
      "invoice.html",
      "index.html",
    ];
    for (const file of expectedFiles) {
      expect(statSync(`output/${file}`).size, file).toBeGreaterThan(0);
    }

    const pdf = readFileSync("output/invoice.pdf");
    expect(pdf.length).toBeGreaterThan(0);
    expect(pdf.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(pdf.toString("latin1").match(/\/Type\s*\/Page\b/g)).toHaveLength(1);
  });

  it("keeps the generated emails free of scripts and stores the subject in text output", () => {
    for (const status of ["paid", "pending", "expired"] as const) {
      const emailHtml = readFileSync(`output/email-${status}.html`, "utf8");
      const emailText = readFileSync(`output/email-${status}.txt`, "utf8");
      expect(Buffer.byteLength(emailHtml, "utf8")).toBeLessThan(100 * 1024);
      expect(emailHtml).not.toMatch(/<script\b/i);
      expect(emailText).toMatch(/^Subject: .+\r?\n/);
    }
  });
});
