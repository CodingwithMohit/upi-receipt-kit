# Discussion post draft

The announcement asks for a public repository and a README with a screenshot, an explanation of Hyper Elements use, and run instructions. It does not provide a fixed Discussion post template. Replace the repository and screenshot URL placeholders before posting.

```text
[Challenge Submission] UPI Receipt Kit: one source, three outputs, three payment states

UPI Receipt Kit is a fictional Indian shop receipt family built from one JSON order source. It renders a 600 px confirmation email, a responsive web receipt, and a paid-only A4 invoice PDF for paid, pending-verification, and expired payment states.

Repository: https://github.com/CodingwithMohit/upi-receipt-kit

Screenshots:
- Paid confirmation email: [Paid email](https://github.com/CodingwithMohit/upi-receipt-kit/blob/main/docs/screenshots/email-paid.png)
- Paid web receipt: [Paid receipt](https://github.com/CodingwithMohit/upi-receipt-kit/blob/main/docs/screenshots/receipt-paid.png)
- Pending receipt at phone width: [Mobile receipt](https://github.com/CodingwithMohit/upi-receipt-kit/blob/main/docs/screenshots/receipt-mobile.png)
- Expired web receipt: [Expired receipt](https://github.com/CodingwithMohit/upi-receipt-kit/blob/main/docs/screenshots/receipt-expired.png)
- Paid invoice: [Invoice](https://github.com/CodingwithMohit/upi-receipt-kit/blob/main/docs/screenshots/invoice.png)

How to run:
1. npm install
2. npx playwright install chromium
3. npm run build
4. npm run preview

The output index is served at http://127.0.0.1:4173. The README explains how the fixtures drive all three templates.
```
