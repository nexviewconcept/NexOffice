# NexOffice Email Setup

The Email Center currently uses a **Mocked Queue** for development purposes.

## Transitioning to Production
To enable real email sending:
1. Integrate `nodemailer` or a transactional email provider API (e.g., SendGrid, AWS SES).
2. Store credentials in the backend `.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_api_key
   ```
3. Update `backend/src/emails/emails.service.ts` to replace the `setTimeout` mock with an actual SMTP transport call.
4. Implement SPF, DKIM, and DMARC on your DNS records to ensure high deliverability and avoid spam filters.
