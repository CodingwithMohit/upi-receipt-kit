import { Column, Heading, Text } from "@hyper-elements/react";
import type { Merchant } from "../types.js";
import { color, space, type } from "../theme.js";

interface HeaderProps {
  merchant: Merchant;
}

export function Header({ merchant }: HeaderProps) {
  return (
    <Column style={{ gap: space.xs }}>
      <Heading
        level={2}
        style={{
          color: color.foreground,
          fontSize: 22,
        }}
      >
        {merchant.name}
      </Heading>
      <Text style={{ color: color.muted, fontSize: type.body }}>
        {merchant.tagline}
      </Text>
    </Column>
  );
}
