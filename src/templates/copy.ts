import type { ReceiptOrder } from "../types.js";

export interface StateCopy {
  heading: string;
  summary: string;
  nextStep: string;
  action: string;
  actionUrl: string;
}

export function stateCopy(order: ReceiptOrder): StateCopy {
  const path = order.payment.status;
  if (path === "paid") {
    return {
      heading: "Payment confirmed",
      summary: `Thank you, ${order.customerName}. Your payment has been verified and your order is being prepared.`,
      nextStep: "Keep this receipt for your records. The payment reference below is a fictional test value.",
      action: "View receipt",
      actionUrl: `https://receipt.mogra.test/${order.orderNumber}`,
    };
  }
  if (path === "pending") {
    return {
      heading: "We're verifying your payment",
      summary: "The payment request was created, but the provider confirmation has not reached the store yet.",
      nextStep: "A delayed confirmation can take a few minutes. If this status continues after the payment window, contact support with the test reference below.",
      action: "Check payment status",
      actionUrl: `https://receipt.mogra.test/${order.orderNumber}`,
    };
  }
  return {
    heading: "The payment window has closed",
    summary: "This payment session expired before the store received a final confirmation.",
    nextStep: "Your bank or payment app may still show a pending debit. Check its final status before trying again. If it shows a completed payment, contact support before making another payment.",
    action: "Retry payment",
    actionUrl: `https://checkout.mogra.test/${order.orderNumber}`,
  };
}
