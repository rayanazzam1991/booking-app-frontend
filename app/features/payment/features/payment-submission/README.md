# Payment Submission

## Summary
Allow users to submit payment proof and attach it to the related booking or order.

## Acceptance Criteria
- it should accept payment with bank deposit with image of the deposit
- user can see status of payment in the dashboard.

## Public Surface
- `index.ts` exports the feature page and public composable.
- `PaymentSubmission.contract.ts` defines the public contract and data models.
- `manifest.json` records key file paths and metadata.

## Runtime Pieces
- API base path: `/api/payment-submission`
- Suggested table name: `payment_submission`
- Migration path: `supabase/migrations/*_create_payment_submission_table.sql`

## Next Steps
1. Refine the generated contract types to match your domain.
2. Update the migration if your schema needs additional columns or policies.
3. Connect the feature page to your app shell or route composition.
