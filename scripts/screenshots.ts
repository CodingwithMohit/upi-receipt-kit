import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const outputDirectory = resolve("output");
const screenshotsDirectory = resolve("docs/screenshots");
const captures = [
  { source: "email-paid.html", name: "email-paid.png", width: 640, height: 1000 },
  { source: "receipt-paid.html", name: "receipt-paid.png", width: 1280, height: 1000 },
  { source: "receipt-pending.html", name: "receipt-pending.png", width: 1280, height: 1000 },
  { source: "receipt-expired.html", name: "receipt-expired.png", width: 1280, height: 1000 },
  { source: "receipt-pending.html", name: "receipt-mobile.png", width: 390, height: 844 },
  { source: "invoice.html", name: "invoice.png", width: 794, height: 1123 },
];

await mkdir(screenshotsDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const capture of captures) {
    const html = await readFile(resolve(outputDirectory, capture.source), "utf8");
    await page.setViewportSize({ width: capture.width, height: capture.height });
    await page.setContent(html, { waitUntil: "load" });
    await page.screenshot({
      path: resolve(screenshotsDirectory, capture.name),
      fullPage: true,
    });
    console.info(`Wrote docs/screenshots/${capture.name}`);
  }
} finally {
  await browser.close();
}
