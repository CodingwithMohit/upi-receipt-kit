# How it works

The project keeps order facts in JSON and lets TypeScript prepare the values that the templates need. The same receipt order is then used by an email root, a web root, and a document root.

## 1. Read the fixture and calculate amounts

`data/orders/paid.json`, `pending.json`, and `expired.json` contain line items, quantities, prices in INR, shipping, payment status, a fake reference, and timestamps. The `amountINR` value is not stored in those files.

`src/data.ts` reads the files and checks their shapes. The checks use `unknown` first because parsed JSON can contain any value. Small type guards check each field before returning a typed `OrderSource`. This means a missing or invalid field fails with a clear error instead of being treated as an order.

`calculateOrder()` multiplies quantity by unit price, adds line totals for the subtotal, adds shipping for the total, and sets the payment amount to that total. The computed `ReceiptOrder` type includes these derived values. `formatMoney()` uses `Intl.NumberFormat` with the `en-IN` locale and INR currency.

## 2. Choose the root component

Hyper Elements uses the outer component to choose the output:

- `EmailReceipt` returns `<Email width={600}>`. Its `previewText` comes from the order fixture. `render()` writes email HTML and plain text.
- `WebReceipt` returns `<Page width={760}>`. It has headings, a payment timeline, and no client-side JavaScript.
- `InvoiceDocument` returns `<Document size="A4">`. It accepts paid orders only and adds a page header, footer, and page number.

The templates are ordinary synchronous React components. `createElement()` passes the typed props into each component from the Node build script. The JSX in the component is checked against the Hyper Elements declarations before it runs. The library then checks the component tree while rendering. For example, a `TableCell` accepts text and inline elements, not another block `Text` component.

All spacing, colors, fonts, and radii come from `src/theme.ts`. Reusable components such as `ItemsTable`, `StatusBadge`, `Totals`, and `Footer` keep the same presentation across roots. Dynamic values are passed as text, so Hyper Elements escapes them when it writes HTML.

## 3. Render files and create the PDF

`scripts/build.ts` loads each order and calls `render()` with the matching root. It writes the resulting HTML and text to `output/`. It also adds a small print stylesheet to each web receipt, so the background prints white and the page has a print margin. The email subject is written to the plain-text output and the email preview text is part of the email root.

For the invoice, the `Document` root first renders print HTML. Playwright loads that HTML in Chromium and calls `page.pdf()` with A4 sizing and print backgrounds. The generated `output/invoice.pdf` is a real one-page PDF. It is only generated for the paid order.

`scripts/preview.ts` serves `output/` on `127.0.0.1:4173`. `output/index.html` links the generated files and embeds the three emails in 600 px frames. `scripts/screenshots.ts` loads the generated HTML in Chromium and saves PNGs to `docs/screenshots/`.

## Payment-state copy

`src/templates/copy.ts` chooses the heading, explanation, next step, and button label for each state:

- **Paid:** says the payment was verified and provides the receipt.
- **Pending:** says the provider confirmation has not reached the store and gives a support path.
- **Expired:** says the window closed, asks the customer to check their bank or payment app, and does not promise a refund or claim that no charge occurred.

The state badge and timeline use the same `PaymentStatus` union: `"paid" | "pending" | "expired"`. TypeScript catches a state spelling that does not match those three values. The timestamps and `.test` contact links are sample data, not live payment records.
