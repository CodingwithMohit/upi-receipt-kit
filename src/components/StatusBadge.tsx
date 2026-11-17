import { Column, Text } from "@hyper-elements/react";
import type { PaymentStatus } from "../types.js";
import { color, radius, type } from "../theme.js";

const labels: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending verification",
  expired: "Payment window closed",
};

interface StatusBadgeProps {
  status: PaymentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isPaid = status === "paid";
  return (
    <Column style={{ alignItems: "start" }}>
      <Text
        style={{
          backgroundColor: isPaid ? color.primary : color.soft,
          borderRadius: radius.pill,
          color: isPaid ? color.primaryForeground : color.foreground,
          fontSize: type.body,
          fontWeight: 700,
          padding: [6, 12],
        }}
      >
        {labels[status]}
      </Text>
    </Column>
  );
}
