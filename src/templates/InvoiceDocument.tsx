import {
  Column,
  Document,
  Heading,
  PageFooter,
  PageHeader,
  PageNumber,
  Row,
  Text,
} from "@hyper-elements/react";
import type { Merchant, ReceiptOrder } from "../types.js";
import { color, space, type, receiptTheme } from "../theme.js";
import { formatMoney } from "../data.js";
import { formatDateTime } from "../format.js";
import { Footer } from "../components/Footer.js";
import { Header } from "../components/Header.js";
import { ItemsTable } from "../components/ItemsTable.js";
import { StatusBadge } from "../components/StatusBadge.js";
import { Totals } from "../components/Totals.js";

interface InvoiceDocumentProps {
  merchant: Merchant;
  order: ReceiptOrder;
}

export function InvoiceDocument({ merchant, order }: InvoiceDocumentProps) {
  if (order.payment.status !== "paid") {
    throw new Error("InvoiceDocument is only available for paid orders");
  }

  return (
    <Document
      size="A4"
      orientation="portrait"
      margin={{ top: 52, right: 52, bottom: 56, left: 52 }}
      title={`Sample invoice ${order.orderNumber}`}
      theme={receiptTheme}
    >
      <PageHeader>
        <Row style={{ alignItems: "center", gap: space.md }}>
          <Column style={{ flex: 1 }}>
            <Header merchant={merchant} />
          </Column>
          <Column style={{ alignItems: "end" }}>
            <Text style={{ color: color.primary, fontSize: type.body, fontWeight: 700 }}>
              SAMPLE INVOICE
            </Text>
          </Column>
        </Row>
      </PageHeader>
      <Column style={{ gap: space.xl }}>
        <Column style={{ gap: space.md }}>
          <Heading level={1} style={{ color: color.foreground }}>
            Payment invoice
          </Heading>
          <Row style={{ alignItems: "center", gap: space.md }}>
            <Column style={{ flex: 1, gap: space.xs }}>
              <Text style={{ color: color.muted, fontSize: type.body }}>Invoice reference</Text>
              <Text style={{ color: color.foreground, fontSize: type.body, fontWeight: 700 }}>
                {order.orderNumber}
              </Text>
            </Column>
            <Column style={{ flex: 1, gap: space.xs }}>
              <Text style={{ color: color.muted, fontSize: type.body }}>Invoice date</Text>
              <Text style={{ color: color.foreground, fontSize: type.body, fontWeight: 700 }}>
                {formatDateTime(order.payment.settledAt ?? order.orderedAt)}
              </Text>
            </Column>
            <StatusBadge status="paid" />
          </Row>
          <Text style={{ color: color.muted, fontSize: type.body }}>
            Prepared for {order.customerName}
          </Text>
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
            border: { width: 1, style: "solid", color: color.border },
            borderRadius: 8,
            gap: space.sm,
            padding: space.lg,
          }}
        >
          <Heading level={2} style={{ color: color.foreground, fontSize: 18 }}>
            Payment details
          </Heading>
          <Text style={{ color: color.muted, fontSize: type.body }}>
            Test reference: {order.payment.reference}
          </Text>
          <Text style={{ color: color.muted, fontSize: type.body }}>
            Paid amount: {formatMoney(order.payment.amountINR)}
          </Text>
          <Text style={{ color: color.muted, fontSize: type.body }}>
            Paid at: {formatDateTime(order.payment.settledAt ?? order.orderedAt)}
          </Text>
        </Column>
        <Text style={{ color: color.muted, fontSize: type.body, fontWeight: 700 }}>
          Sample invoice. Not a GST or tax document.
        </Text>
      </Column>
      <PageFooter>
        <Row style={{ alignItems: "center", gap: space.md }}>
          <Column style={{ flex: 1 }}>
            <Footer merchant={merchant} compact />
          </Column>
          <Column style={{ alignItems: "end" }}>
            <Text style={{ color: color.muted, fontSize: type.body }}>
              Page <PageNumber /> of <PageNumber total />
            </Text>
          </Column>
        </Row>
      </PageFooter>
    </Document>
  );
}
