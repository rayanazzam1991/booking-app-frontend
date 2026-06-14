/**
 * Architecture: Auto-generated feature registry.
 */
export const featureRegistry = {
  "features": [
    {
      "id": "booking",
      "name": "Booking",
      "status": "migrating",
      "description": "Healthcare appointment booking flow — service selection, professional picker, and appointment submission.",
      "deps": [],
      "externalDeps": [],
      "hasTests": true,
      "type": "feature",
      "subFeatures": []
    },
    {
      "id": "payment",
      "name": "Payment",
      "status": "scaffolding",
      "description": "Manage payment submission, verification, and payment state across the product.",
      "acceptanceCriteria": [
        "it should accept payment with bank deposit with image of the deposit",
        "user can see status of payment in the dashboard.",
        "appointment wont be approved until admin approve it manually."
      ],
      "requiresSupabase": false,
      "deps": [],
      "externalDeps": [],
      "hasTests": true,
      "type": "feature",
      "parentId": null,
      "subFeatures": [
        {
          "id": "payment-submission",
          "name": "Payment Submission",
          "status": "scaffolding",
          "description": "Allow users to submit payment proof and attach it to the related booking or order.",
          "acceptanceCriteria": [
            "it should accept payment with bank deposit with image of the deposit",
            "user can see status of payment in the dashboard."
          ],
          "requiresSupabase": false,
          "deps": [],
          "externalDeps": [],
          "hasTests": true,
          "type": "subfeature",
          "parentId": "payment",
          "subFeatures": []
        },
        {
          "id": "payment-status-tracking",
          "name": "Payment Status Tracking",
          "status": "scaffolding",
          "description": "Expose payment state and review progress to users and admins.",
          "acceptanceCriteria": [
            "user can see status of payment in the dashboard."
          ],
          "requiresSupabase": false,
          "deps": [],
          "externalDeps": [],
          "hasTests": true,
          "type": "subfeature",
          "parentId": "payment",
          "subFeatures": []
        },
        {
          "id": "payment-approval-flow",
          "name": "Payment Approval Flow",
          "status": "scaffolding",
          "description": "Gate approvals on manual review when payment confirmation is required.",
          "acceptanceCriteria": [
            "appointment wont be approved until admin approve it manually."
          ],
          "requiresSupabase": false,
          "deps": [],
          "externalDeps": [],
          "hasTests": true,
          "type": "subfeature",
          "parentId": "payment",
          "subFeatures": []
        }
      ]
    },
    {
      "id": "anayltics",
      "name": "Anayltics",
      "status": "scaffolding",
      "description": "",
      "acceptanceCriteria": [
        "user should see all transactions.",
        "user can see monthly/weekly report.",
        "user can download reports"
      ],
      "requiresSupabase": false,
      "deps": [
        "payment",
        "booking"
      ],
      "externalDeps": [],
      "hasTests": true,
      "type": "feature",
      "parentId": null,
      "subFeatures": []
    }
  ]
};
