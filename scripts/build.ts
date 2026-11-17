import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createElement } from "react";
import { chromium } from "playwright";
import { render } from "@hyper-elements/react";
import { loadMerchant, loadOrder } from "../src/data.js";
import { EmailReceipt } from "../src/templates/EmailReceipt.js";
import { InvoiceDocument } from "../src/templates/InvoiceDocument.js";
import { WebReceipt } from "../src/templates/WebReceipt.js";
import type { PaymentStatus } from "../src/types.js";

const outputDirectory = resolve("output");
const statuses: PaymentStatus[] = ["paid", "pending", "expired"];

function renderIndex(): string {
  const links = [
    ...statuses.flatMap((status) => [
      { href: `email-${status}.html`, label: `Email · ${status}` },
      { href: `email-${status}.txt`, label: `Plain text · ${status}` },
      { href: `receipt-${status}.html`, label: `Web receipt · ${status}` },
    ]),
    { href: "invoice.html", label: "Print invoice · paid" },
    { href: "invoice.pdf", label: "PDF invoice · paid" },
  ];
  const emailFrames = statuses
    .map((status) =>
      [
        `    <section class="email-preview">`,
        `      <h2>Email · ${status}</h2>`,
        `      <p><a href="email-${status}.html">Open email HTML</a></p>`,
        `      <iframe src="email-${status}.html" title="Email receipt, ${status}" width="600" height="920"></iframe>`,
        `    </section>`,
      ].join("\n"),
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>UPI Receipt Kit · Output index</title>
  <style>
    :root { color-scheme: light; font-family: Arial, Helvetica, sans-serif; color: #1c302d; background: #f4f6f2; }
    body { max-width: 1040px; margin: 0 auto; padding: 32px 20px; }
    h1, h2 { font-family: Georgia, "Times New Roman", serif; }
    a { color: #176b60; }
    .file-links { display: flex; flex-wrap: wrap; gap: 12px 24px; padding: 20px; background: #fff; border: 1px solid #dce4de; border-radius: 12px; }
    .email-preview { margin-top: 32px; }
    iframe { display: block; max-width: 100%; border: 1px solid #dce4de; background: #fff; }
    @media print { body { max-width: none; padding: 0; } .file-links { display: none; } }
  </style>
</head>
<body>
  <main>
    <h1>UPI Receipt Kit</h1>
    <p>Generated sample outputs for one fictional order model.</p>
    <nav class="file-links" aria-label="Generated files">
      ${links.map(({ href, label }) => `<a href="${href}">${label}</a>`).join("\n      ")}
    </nav>
${emailFrames}
    <section>
      <h2>Web receipts and invoice</h2>
      <p>Open the linked web receipts above. The invoice is available as <a href="invoice.html">print HTML</a> and <a href="invoice.pdf">PDF</a>.</p>
    </section>
  </main>
</body>
</html>`;
}

async function writeEmail(status: PaymentStatus): Promise<void> {
  const order = loadOrder(status);
  const result = await render(
    createElement(EmailReceipt, { merchant: loadMerchant(), order }),
  );
  const warnings = result.diagnostics.filter((diagnostic) => diagnostic.severity === "warning");
  if (warnings.length > 0) {
    throw new Error(`Email ${status} has renderer warnings: ${warnings.map((item) => item.message).join("; ")}`);
  }
  await writeFile(resolve(outputDirectory, `email-${status}.html`), result.html, "utf8");
  await writeFile(
    resolve(outputDirectory, `email-${status}.txt`),
    `Subject: ${order.emailSubject}\n\n${result.text}`,
    "utf8",
  );
  console.info(`Wrote email-${status}.html and email-${status}.txt`);
}

async function writeWebReceipt(status: PaymentStatus): Promise<void> {
  const result = await render(
    createElement(WebReceipt, { merchant: loadMerchant(), order: loadOrder(status) }),
  );
  const warnings = result.diagnostics.filter((diagnostic) => diagnostic.severity === "warning");
  if (warnings.length > 0) {
    throw new Error(`Web receipt ${status} has renderer warnings: ${warnings.map((item) => item.message).join("; ")}`);
  }
  await writeFile(resolve(outputDirectory, `receipt-${status}.html`), result.html, "utf8");
  console.info(`Wrote receipt-${status}.html`);
}

async function writeInvoice(): Promise<void> {
  const result = await render(
    createElement(InvoiceDocument, {
      merchant: loadMerchant(),
      order: loadOrder("paid"),
    }),
  );
  const warnings = result.diagnostics.filter((diagnostic) => diagnostic.severity === "warning");
  if (warnings.length > 0) {
    throw new Error(`Invoice has renderer warnings: ${warnings.map((item) => item.message).join("; ")}`);
  }
  const htmlPath = resolve(outputDirectory, "invoice.html");
  const pdfPath = resolve(outputDirectory, "invoice.pdf");
  await writeFile(htmlPath, result.html, "utf8");

  // The Document root provides print HTML; Chromium applies its A4 page rules for page.pdf().
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(result.html, { waitUntil: "load" });
    await page.pdf({
      path: pdfPath,
      format: "A4",
      preferCSSPageSize: true,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }
  console.info("Wrote invoice.html and invoice.pdf");
}

await mkdir(outputDirectory, { recursive: true });
for (const status of statuses) {
  await writeEmail(status);
  await writeWebReceipt(status);
}
await writeInvoice();
await writeFile(resolve(outputDirectory, "index.html"), renderIndex(), "utf8");
console.info(`Wrote output index in ${outputDirectory}`);
