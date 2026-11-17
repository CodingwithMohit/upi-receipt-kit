import {
  Table,
  TableCell,
  TableRow,
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
        <TableCell style={{ width: "45%", color: color.foreground, fontSize: type.body, fontWeight: 700 }}>
          Item
        </TableCell>
        <TableCell style={{ width: "10%", color: color.foreground, fontSize: type.body, fontWeight: 700, textAlign: "right" }}>
          Qty
        </TableCell>
        <TableCell style={{ width: "20%", color: color.foreground, fontSize: type.body, fontWeight: 700, textAlign: "right" }}>
          Each
        </TableCell>
        <TableCell style={{ width: "25%", color: color.foreground, fontSize: type.body, fontWeight: 700, textAlign: "right" }}>
          Line total
        </TableCell>
      </TableRow>
      {items.map((item) => (
        <TableRow key={item.sku}>
          <TableCell style={{ width: "45%", color: color.foreground, fontSize: type.body }}>
            {item.name}
          </TableCell>
          <TableCell style={{ width: "10%", color: color.foreground, fontSize: type.body, textAlign: "right" }}>
            {item.quantity}
          </TableCell>
          <TableCell style={{ width: "20%", color: color.foreground, fontSize: type.body, textAlign: "right" }}>
            {formatMoney(item.unitPriceINR)}
          </TableCell>
          <TableCell style={{ width: "25%", color: color.foreground, fontSize: type.body, textAlign: "right" }}>
            {formatMoney(item.lineTotalINR)}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
