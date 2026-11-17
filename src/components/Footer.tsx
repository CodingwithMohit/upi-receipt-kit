import { Column, Link, Text } from "@hyper-elements/react";
import type { Merchant } from "../types.js";
import { color, space, type } from "../theme.js";

interface FooterProps {
  merchant: Merchant;
  compact?: boolean;
}

export function Footer({ merchant, compact = false }: FooterProps) {
  if (compact) {
    return (
      <Column style={{ gap: space.xs }}>
        <Text style={{ color: color.muted, fontSize: type.body }}>
          {merchant.name} ·{" "}
          <Link href={`mailto:${merchant.supportEmail}`} style={{ color: color.primary }}>
            {merchant.supportEmail}
          </Link>
        </Text>
        <Text style={{ color: color.muted, fontSize: type.body }}>
          {merchant.addressLine}. Fictional order and payment data.
        </Text>
      </Column>
    );
  }

  return (
    <Column style={{ alignItems: "center", gap: space.sm }}>
      <Text style={{ color: color.muted, fontSize: type.body, textAlign: "center" }}>
        Need help?{" "}
        <Link href={`mailto:${merchant.supportEmail}`} style={{ color: color.primary }}>
          {merchant.supportEmail}
        </Link>
      </Text>
      <Text style={{ color: color.muted, fontSize: type.body, textAlign: "center" }}>
        {merchant.supportHours}
      </Text>
      <Text style={{ color: color.muted, fontSize: type.body, textAlign: "center" }}>
        {merchant.addressLine}. All order and payment details here are fictional.
      </Text>
    </Column>
  );
}
