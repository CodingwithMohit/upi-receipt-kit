import {
  Button,
  Column,
  Heading,
  Page,
  Row,
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
import { StatusTimeline } from "../components/StatusTimeline.js";
import { Totals } from "../components/Totals.js";
import { stateCopy } from "./copy.js";

interface WebReceiptProps {
  merchant: Merchant;
  order: ReceiptOrder;
}

export function WebReceipt({ merchant, order }: WebReceiptProps) {
  const copy = stateCopy(order);
  return (
    <Page
      width={760}
      title={`${copy.heading} · ${order.orderNumber}`}
      description={`Sample payment receipt for order ${order.orderNumber}.`}
      theme={receiptTheme}
    >
      <Column
        style={{
          gap: space.xl,
          maxWidth: 760,
          padding: space.xl,
          width: "100%",
        }}
      >
        <Header merchant={merchant} />
        <Column
          style={{
            backgroundColor: color.surface,
            border: { width: 1, style: "solid", color: color.border },
            borderRadius: radius.large,
            gap: space.xl,
            padding: space.xl,
          }}
        >
          <Column style={{ gap: space.md }}>
            <StatusBadge status={order.payment.status} />
            <Heading level={1} style={{ color: color.foreground }}>
              {copy.heading}
            </Heading>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              {copy.summary}
            </Text>
          </Column>
          <Row style={{ gap: space.md }}>
            <Column style={{ flex: 1, gap: space.xs }}>
              <Text style={{ color: color.muted, fontSize: type.body }}>Order number</Text>
              <Text style={{ color: color.foreground, fontSize: type.body, fontWeight: 700 }}>
                {order.orderNumber}
              </Text>
            </Column>
            <Column style={{ flex: 1, gap: space.xs }}>
              <Text style={{ color: color.muted, fontSize: type.body }}>Placed</Text>
              <Text style={{ color: color.foreground, fontSize: type.body, fontWeight: 700 }}>
                {formatDateTime(order.orderedAt)}
              </Text>
            </Column>
          </Row>
          <Column style={{ gap: space.md }}>
            <Heading level={2} style={{ color: color.foreground }}>
              Payment timeline
            </Heading>
            <StatusTimeline status={order.payment.status} />
          </Column>
          <Column style={{ gap: space.md }}>
            <Heading level={2} style={{ color: color.foreground }}>
              Items
            </Heading>
            <ItemsTable items={order.items} />
            <Totals order={order} />
          </Column>
          <Column
            style={{
              backgroundColor: color.soft,
              borderRadius: radius.medium,
              gap: space.sm,
              padding: space.lg,
            }}
          >
            <Heading level={2} style={{ color: color.foreground, fontSize: 18 }}>
              What happens next
            </Heading>
            <Text style={{ color: color.muted, fontSize: type.body }}>{copy.nextStep}</Text>
            <Text style={{ color: color.foreground, fontSize: type.body }}>
              Test reference: {order.payment.reference}
            </Text>
            <Text style={{ color: color.foreground, fontSize: type.body }}>
              Payment amount: {formatMoney(order.payment.amountINR)}
            </Text>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              Payment window: {order.payment.expiryWindowMinutes} minutes, until{" "}
              {formatDateTime(order.payment.expiresAt)}
            </Text>
            {order.payment.status === "paid" && order.payment.settledAt ? (
              <Text style={{ color: color.muted, fontSize: type.body }}>
                Verified {formatDateTime(order.payment.settledAt)}
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
    </Page>
  );
}
