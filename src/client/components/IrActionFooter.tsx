import React from "react";

// Stub for demo -- no export/runbook integration exists yet.
function handleExportGraph() {
  console.log("Export graph clicked (stub -- no export integration yet)");
}

function handleOpenRunbook() {
  console.log("Open runbook clicked (stub -- no runbook integration yet)");
}

export default function IrActionFooter() {
  return (
    <footer className="blast-radius__ir-footer">
      <div className="blast-radius__ir-footer-text-block">
        <span className="blast-radius__ir-footer-label">First-hour IR action</span>
        <span className="blast-radius__ir-footer-text">
          Stub for demo — revoke high-risk role grants, rotate credentials for sensitive table
          access, and notify the identity's manager within the first hour of a critical finding.
        </span>
      </div>
      <div className="blast-radius__ir-footer-actions">
        <button type="button" className="blast-radius__btn blast-radius__btn--secondary" onClick={handleExportGraph}>
          Export graph
        </button>
        <button type="button" className="blast-radius__btn blast-radius__btn--primary" onClick={handleOpenRunbook}>
          Open runbook
        </button>
      </div>
    </footer>
  );
}
