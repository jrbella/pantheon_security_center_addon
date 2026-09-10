import React from "react";
import { RoleRecommendation } from "../../recommendationsTypes";

interface RoleTableProps {
  roles: RoleRecommendation[];
  selectedSysId: string | null;
  onSelect: (role: RoleRecommendation) => void;
}

function dispositionLabel(disposition: string): string {
  if (disposition === "applied") return "Applied";
  if (disposition === "rejected") return "Rejected";
  return "Pending review";
}

export default function RoleTable({ roles, selectedSysId, onSelect }: RoleTableProps) {
  return (
    <div className="rec__table-card">
      <div className="rec__table-title">Roles held · usage over last 180 days</div>
      <table className="rec__table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Usage count</th>
            <th>Recommendation</th>
            <th>Review status</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr
              key={role.sysId}
              className={role.sysId === selectedSysId ? "rec__row--selected" : ""}
              onClick={() => onSelect(role)}
            >
              <td>{role.roleName}</td>
              <td>{role.usageCount.toLocaleString()}</td>
              <td>
                <span className={`rec__badge rec__badge--${role.recommendation}`}>
                  {role.recommendation === "keep" ? "KEEP" : "REMOVE"}
                </span>
              </td>
              <td className={`rec__status rec__status--${role.disposition}`}>
                {dispositionLabel(role.disposition)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
