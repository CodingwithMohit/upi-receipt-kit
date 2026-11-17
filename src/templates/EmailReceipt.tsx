import {
  Button,
  Column,
  Email,
  Heading,
  Text,
} from "@hyper-elements/react";
import type { Merchant, ReceiptOrder } from "../types.js";
import { color, radius, space, type, receiptTheme } from "../theme.js";
import { formatMoney } from "../data.js";
import { formatDateTime } from "../format.js";
import { Footer } from "../components/Footer.js";
import { Header } from "../components/Header.js";
import { ItemsTable } from "../components/ItemsTable.js";
import { StatusBadge } from "../components/StatusBadge.js";
import { Totals } from "../components/Totals.js";
import { stateCopy } from "./copy.js";

interface EmailReceiptProps {
  merchant: Merchant;
  order: ReceiptOrder;
}

export function EmailReceipt({ merchant, order }: EmailReceiptProps) {
  const copy = stateCopy(order);
  return (
    <Email
      width={600}
      title={order.emailSubject}
      previewText={order.emailPreheader}
      theme={receiptTheme}
    >
      <Column style={{ gap: space.lg, padding: space.lg }}>
        <Header merchant={merchant} />
        <Column
          style={{
            backgroundColor: color.surface,
            border: { width: 1, style: "solid", color: color.border },
            borderRadius: radius.large,
            gap: space.lg,
            padding: space.xl,
          }}
        >
          <StatusBadge status={order.payment.status} />
          <Column style={{ gap: space.sm }}>
            <Heading level={1} style={{ color: color.foreground, fontSize: 28 }}>
              {copy.heading}
            </Heading>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              {copy.summary}
            </Text>
          </Column>
          <Column style={{ gap: space.xs }}>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              Order {order.orderNumber}
            </Text>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              Placed {formatDateTime(order.orderedAt)}
            </Text>
          </Column>
          <ItemsTable items={order.items} />
          <Totals order={order} />
          <Column
            style={{
              backgroundColor: color.soft,
              borderRadius: radius.medium,
              gap: space.sm,
              padding: space.md,
            }}
          >
            <Text style={{ color: color.foreground, fontSize: type.body, fontWeight: 700 }}>
              {copy.nextStep}
            </Text>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              Test reference: {order.payment.reference}
            </Text>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              Payment amount: {formatMoney(order.payment.amountINR)}
            </Text>
            {order.payment.status === "paid" && order.payment.settledAt ? (
              <Text style={{ color: color.muted, fontSize: type.body }}>
                Verified {formatDateTime(order.payment.settledAt)}
              </Text>
            ) : null}
            {order.payment.status === "pending" ? (
              <Text style={{ color: color.muted, fontSize: type.body }}>
                Payment window: {order.payment.expiryWindowMinutes} minutes, until{" "}
                {formatDateTime(order.payment.expiresAt)}
              </Text>
            ) : null}
            {order.payment.status === "expired" ? (
              <Text style={{ color: color.muted, fontSize: type.body }}>
                Window closed {formatDateTime(order.payment.expiredAt ?? order.payment.expiresAt)}
              </Text>
            ) : null}
          </Column>
          <Button href={copy.actionUrl}>{copy.action}</Button>
        </Column>
        <Footer merchant={merchant} />
      </Column>
    </Email>
  );
}
