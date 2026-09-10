export type ReviewCadence = "Quarterly" | "Annual";

// DEMO ONLY: cosmetic stub, not backed by any real field. No review-cadence
// data exists anywhere in the schema (grant_inventory, blast_radius_finding,
// etc. have no such column) -- this exists purely so the ranked list can
// show the "Review" column from the wireframe. Rule: the top 3 findings by
// score (the array from getAllFindings is already ORDERBYDESCscore, so the
// first 3 entries are the top 3) are labeled "Quarterly", everything else
// "Annual" -- approximating the wireframe's apparent highest-risk-reviewed-
// more-often pattern. Delete this once a real review-cadence field exists.
export function getReviewCadence(rankIndex: number): ReviewCadence {
  return rankIndex < 3 ? "Quarterly" : "Annual";
}
