import {
  Table,
  TableCell,
  TableRow,
  Span,
  token,
} from "@hyper-elements/react";
import type { OrderLine } from "../types.js";
import { color, type } from "../theme.js";
import { formatMoney } from "../data.js";

interface ItemsTableProps {
  items: OrderLine[];
}

export function ItemsTable({ items }: ItemsTableProps) {
  return (
    <Table
      style={{
        borderCollapse: "collapse",
        cellPadding: [10, 4],
        rowBorder: { width: 1, style: "solid", color: token("colors.border") },
      }}
    >
      <TableRow header>
        <TableCell style={{ width: "65%", color: color.foreground, fontSize: type.body, fontWeight: 700 }}>
          Item
        </TableCell>
        <TableCell style={{ width: "35%", color: color.foreground, fontSize: type.body, fontWeight: 700, textAlign: "right" }}>
          Line total
        </TableCell>
      </TableRow>
      {items.map((item) => (
        <TableRow key={item.sku}>
          <TableCell style={{ width: "65%", color: color.foreground, fontSize: type.body }}>
            {item.name}{" "}
            <Span style={{ color: color.muted, fontSize: type.body }}>
              · Qty {item.quantity} · Each {formatMoney(item.unitPriceINR)}
            </Span>
          </TableCell>
          <TableCell style={{ width: "35%", color: color.foreground, fontSize: type.body, textAlign: "right" }}>
            {formatMoney(item.lineTotalINR)}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
