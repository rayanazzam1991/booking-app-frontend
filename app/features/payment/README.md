# Payment

## Summary
Manage payment submission, verification, and payment state across the product.

## Acceptance Criteria
- it should accept payment with bank deposit with image of the deposit
- user can see status of payment in the dashboard.
- appointment wont be approved until admin approve it manually.

## Public Surface
- `index.ts` exports the feature page and public composable.
- `Payment.contract.ts` defines the public contract and data models.
- `manifest.json` records key file paths and metadata.

## Runtime Pieces
- API base path: `/api/payment`
- Suggested table name: `payment`
- Migration path: `supabase/migrations/*_create_payment_table.sql`

## Next Steps
1. Refine the generated contract types to match your domain.
2. Update the migration if your schema needs additional columns or policies.
3. Connect the feature page to your app shell or route composition.
