import { Column, Text } from "@hyper-elements/react";
import type { PaymentStatus } from "../types.js";
import { color, radius, type } from "../theme.js";

const labels: Record<PaymentStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  expired: "Expired",
};

const widths: Record<PaymentStatus, number> = {
  paid: 58,
  pending: 76,
  expired: 68,
};

interface StatusBadgeProps {
  status: PaymentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isPaid = status === "paid";
  return (
    <Column
      style={{
        backgroundColor: isPaid ? color.primary : color.soft,
        borderRadius: radius.pill,
        padding: [6, 12],
        width: widths[status],
      }}
    >
      <Text
        style={{
          color: isPaid ? color.primaryForeground : color.foreground,
          fontSize: type.body,
          fontWeight: 700,
        }}
      >
        {labels[status]}
      </Text>
    </Column>
  );
}
