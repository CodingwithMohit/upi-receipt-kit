import { Column, Divider, Row, Text } from "@hyper-elements/react";
import type { ReceiptOrder } from "../types.js";
import { color, space, type } from "../theme.js";
import { formatMoney } from "../data.js";

interface TotalsProps {
  order: ReceiptOrder;
}

export function Totals({ order }: TotalsProps) {
  return (
    <Column style={{ gap: space.sm }}>
      <Row style={{ gap: space.md }}>
        <Column style={{ flex: 1 }}>
          <Text style={{ color: color.muted, fontSize: type.body }}>Subtotal</Text>
        </Column>
        <Column style={{ flex: 1 }}>
          <Text style={{ color: color.foreground, fontSize: type.body, textAlign: "right" }}>
            {formatMoney(order.subtotalINR)}
          </Text>
        </Column>
      </Row>
      <Row style={{ gap: space.md }}>
        <Column style={{ flex: 1 }}>
          <Text style={{ color: color.muted, fontSize: type.body }}>Shipping</Text>
        </Column>
        <Column style={{ flex: 1 }}>
          <Text style={{ color: color.foreground, fontSize: type.body, textAlign: "right" }}>
            {formatMoney(order.shippingINR)}
          </Text>
        </Column>
      </Row>
      <Divider style={{ borderTop: { width: 1, style: "solid", color: color.border } }} />
      <Row style={{ gap: space.md }}>
        <Column style={{ flex: 1 }}>
          <Text style={{ color: color.foreground, fontSize: type.section, fontWeight: 700 }}>
            Total
          </Text>
        </Column>
        <Column style={{ flex: 1 }}>
          <Text
            style={{
              color: color.foreground,
              fontSize: type.section,
              fontWeight: 700,
              textAlign: "right",
            }}
          >
            {formatMoney(order.totalINR)}
          </Text>
        </Column>
      </Row>
    </Column>
  );
}
