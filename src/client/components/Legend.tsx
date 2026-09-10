import React from "react";

const LEGEND_LABELS: Record<string, string> = {
  role: "Role",
  table: "Table",
  "sensitive-table": "Sensitive table",
  // DEMO ONLY: these two categories are a cosmetic client-side split (see
  // utils/displayCategory.ts), not real backend data -- labeled as such
  // in the UI itself so a demo audience isn't misled.
  "impersonation-path": "Impersonation path (demo)",
  group: "Group (demo)"
};

interface LegendProps {
  categories: string[];
}

export default function Legend({ categories }: LegendProps) {
  if (!categories.length) {
    return null;
  }
  return (
    <div className="blast-radius__legend">
      {categories.map(c => (
        <div key={c} className={`blast-radius__legend-item blast-radius__legend-item--${c}`}>
          <span className="blast-radius__legend-swatch" />
          {LEGEND_LABELS[c] || c}
        </div>
      ))}
    </div>
  );
}
