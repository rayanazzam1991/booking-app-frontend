# Payment Approval Flow

## Summary
Gate approvals on manual review when payment confirmation is required.

## Acceptance Criteria
- appointment wont be approved until admin approve it manually.

## Public Surface
- `index.ts` exports the feature page and public composable.
- `PaymentApprovalFlow.contract.ts` defines the public contract and data models.
- `manifest.json` records key file paths and metadata.

## Runtime Pieces
- API base path: `/api/payment-approval-flow`
- Suggested table name: `payment_approval_flow`
- Migration path: `supabase/migrations/*_create_payment_approval_flow_table.sql`

## Next Steps
1. Refine the generated contract types to match your domain.
2. Update the migration if your schema needs additional columns or policies.
3. Connect the feature page to your app shell or route composition.
