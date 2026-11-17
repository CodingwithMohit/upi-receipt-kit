import { Column, Heading, Row, Text } from "@hyper-elements/react";
import type { PaymentStatus } from "../types.js";
import { color, space, type } from "../theme.js";

interface Step {
  title: string;
  detail: string;
  state: "complete" | "current" | "upcoming";
}

const timeline: Record<PaymentStatus, [string, string, string]> = {
  paid: ["Payment started", "Payment verified", "Order confirmed"],
  pending: ["Payment started", "Verification pending", "Order confirmation"],
  expired: ["Payment started", "Payment window closed", "Check final payment status"],
};

function stepsFor(status: PaymentStatus): Step[] {
  const [first, second, third] = timeline[status];
  if (status === "paid") {
    return [
      { title: first, detail: "Request created", state: "complete" },
      { title: second, detail: "Provider confirmation received", state: "complete" },
      { title: third, detail: "Receipt is ready", state: "complete" },
    ];
  }
  if (status === "pending") {
    return [
      { title: first, detail: "Request created", state: "complete" },
      { title: second, detail: "Waiting for provider response", state: "current" },
      { title: third, detail: "After verification", state: "upcoming" },
    ];
  }
  return [
    { title: first, detail: "Request created", state: "complete" },
    { title: second, detail: "The payment window has ended", state: "current" },
    { title: third, detail: "Check your bank or payment app", state: "upcoming" },
  ];
}

interface StatusTimelineProps {
  status: PaymentStatus;
}

export function StatusTimeline({ status }: StatusTimelineProps) {
  return (
    <Row style={{ gap: space.md }}>
      {stepsFor(status).map((step, index) => {
        const isCurrent = step.state === "current";
        const isUpcoming = step.state === "upcoming";
        return (
          <Column
            key={step.title}
            style={{
              backgroundColor: isCurrent ? color.soft : color.surface,
              border: { width: 1, style: "solid", color: isCurrent ? color.primary : color.border },
              borderRadius: 8,
              flex: 1,
              gap: space.sm,
              padding: space.md,
            }}
          >
            <Text
              style={{
                color: isUpcoming ? color.muted : color.primary,
                fontSize: type.body,
                fontWeight: 700,
              }}
            >
              STEP 0{index + 1}
            </Text>
            <Heading level={3} style={{ color: color.foreground, fontSize: 16 }}>
              {step.title}
            </Heading>
            <Text style={{ color: color.muted, fontSize: type.body }}>{step.detail}</Text>
          </Column>
        );
      })}
    </Row>
  );
}
