import React, { useState, useEffect } from "react";
import { RoleRecommendation } from "../../recommendationsTypes";
import { applyRecommendation, rejectRecommendation } from "../../services/RecommendationsService";

interface ApplyPanelProps {
  selected: RoleRecommendation | null;
  onResolved: () => void;
}

export default function ApplyPanel({ selected, onResolved }: ApplyPanelProps) {
  const [justification, setJustification] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJustification("");
    setError(null);
  }, [selected?.sysId]);

  if (!selected) {
    return (
      <div className="rec__panel">
        <div className="rec__panel-title">Apply with intent capture</div>
        <p className="rec__panel-empty">Select a role from the table to review it.</p>
      </div>
    );
  }

  const isPending = selected.disposition === "pending";

  async function act(action: "apply" | "reject") {
    setBusy(true);
    setError(null);
    try {
      if (action === "apply") {
        await applyRecommendation(selected!.sysId, justification);
      } else {
        await rejectRecommendation(selected!.sysId, justification);
      }
      onResolved();
    } catch (e: any) {
      setError(e.message || `Failed to ${action} recommendation`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rec__panel">
      <div className="rec__panel-title">Apply with intent capture</div>
      <div className="rec__apply-target">
        <strong>{selected.roleName}</strong>
        <span className={`rec__badge rec__badge--${selected.recommendation}`}>
          {selected.recommendation === "keep" ? "KEEP" : "REMOVE"}
        </span>
      </div>

      {!isPending ? (
        <p className="rec__panel-empty">
          Already {selected.disposition} — {selected.justification || "no justification recorded"}
        </p>
      ) : (
        <>
          <textarea
            className="rec__textarea"
            placeholder="Why are you applying or rejecting this recommendation?"
            value={justification}
            onChange={e => setJustification(e.target.value)}
            disabled={busy}
          />
          {error && <div className="rec__error">{error}</div>}
          <div className="rec__apply-actions">
            <button
              type="button"
              className="rec__btn rec__btn--secondary"
              onClick={() => act("reject")}
              disabled={busy}
            >
              Reject
            </button>
            <button type="button" className="rec__btn rec__btn--primary" onClick={() => act("apply")} disabled={busy}>
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  );
}
