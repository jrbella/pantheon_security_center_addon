# Pantheon — Naming Conventions

Paste into the Claude project knowledge base. Generated as a starting point; replace any rule where you already have a house standard.

Rules marked **[verify]** are ones where the platform imposes a limit or behaviour I am not certain of for the Australia release. Check them once, then delete the marker.

---

## 0. Product name in artifacts

**Rule: artifacts carry the app name, not the module name.**

Pantheon is the application. Access Analyzer is the product surface described in the wireframes. Do not put either into individual artifact names, because the scope prefix already identifies the app and repeating it wastes characters against the length limit.

Use the module code (section 6) when an artifact belongs to one module.

---

## 1. Scope prefix

The platform prepends your scope prefix automatically. You never type it, but it counts against every length limit.

- On your PDI the prefix is instance-generated and will differ from the prefix your Technology Partner vendor instance issues.
- **[verify]** There is a maximum length for table names and for column names, and the prefix counts toward it. Confirm the current numbers before committing to long names. This bites scoped apps specifically and it is easier to be terse from the start than to rename later.
- Never hardcode the scope prefix in a string. Use the platform's own means of resolving current scope. Anything you type as a literal becomes migration work.

---

## 2. Tables

**Format:** lowercase, underscores, singular noun.

Singular because the platform is singular throughout: `incident`, `sys_user`, `cmdb_ci`. A table holds one kind of thing; the list view is what makes it plural.

| Purpose | Name | Note |
|---|---|---|
| Core inventory | `grant_inventory` | One row per identity-grant-path |
| Peer group | `peer_group` | The cluster itself |
| Peer group membership | `peer_group_member` | Join between group and identity |
| Computed outlier | `outlier_finding` | One row per flagged grant |
| Run telemetry | `analysis_run` | What the scheduled job processed, per run |

Join and child tables take the parent name plus the relationship: `peer_group_member`, not `member_of_peer_group`.

Extended tables keep the parent's stem so the family is legible in a list of table names.

Do not encode the module in the table name. `grant_inventory` serves four modules; naming it `pgad_grant_inventory` would be wrong within a month.

---

## 3. Fields

**Format:** lowercase, underscores.

- **Reference fields** are named for what they point to, not for the relationship: `user`, `role`, `peer_group`. Not `user_ref`, not `assigned_user` unless there are genuinely two user references on the table, in which case the qualifier earns its place.
- **Booleans** state the positive condition: `is_dormant`, `is_outlier`. Avoid negatives such as `not_reviewed`, which produce double negatives in conditions.
- **Dates** say what happened: `last_exercised`, `computed_on`, `revoked_on`. Not `date_1`, not `last_exercised_date`, since the type already says it is a date.
- **Counts and scores** name the unit: `peer_count`, `debt_score`, `hop_count`.
- **Choice fields** are singular nouns naming the dimension: `grant_class` with values active, aging, dormant. Not `status` unless the field genuinely means record status.
- Avoid `type`, `status`, `name`, and `number` as bare field names unless they carry the platform's usual meaning, because they collide conceptually with inherited fields and make scripts ambiguous to read.

---

## 4. Roles

**Format:** the platform applies scope automatically, producing `<scope>.<role>`. You supply only the suffix.

| Role | Purpose |
|---|---|
| `reader` | Sees analysis output. No actions. |
| `analyst` | Reader plus acting on findings. |
| `admin` | Analyst plus configuration of thresholds and scheduling. |

Use role containment so admin contains analyst contains reader. Do not write three sets of ACLs to achieve the same effect.

Do not create a role per module. If module-level entitlement is ever required, that is a property or plugin boundary, not eighteen roles.

Do not name a role `user`. It reads as "any user" and means the opposite.

---

## 5. Script includes

**Format:** PascalCase, matching the class name exactly.

- Name by responsibility, not by module: `GrantInventoryBuilder`, `PeerGroupCalculator`, `OutlierEvaluator`, `EntitlementService`.
- Suffix conventions worth holding to: `...Builder` for things that materialize records, `...Calculator` or `...Evaluator` for pure computation, `...Service` for a callable façade, `...Util` for stateless helpers. Pick one meaning per suffix and do not mix.
- Client-callable script includes get a `...Ajax` suffix so the callable surface is visible in a list.
- Set accessible-from deliberately per script include. Public only for what genuinely needs external callers. Everything else stays private to the scope.

---

## 6. Module codes

Six modules share one app. Use these codes where an artifact genuinely belongs to a single module: properties, scheduled jobs, ATF suites, update set descriptions.

| Code | Module |
|---|---|
| `debt` | Access Debt Scoring |
| `blast` | Blast Radius Simulation |
| `rec` | Least-Privilege Recommendations |
| `peer` | Peer-Group Anomaly Detection |
| `gate` | Pre-Deployment Access Gate |
| `jit` | JIT and Impersonation Governance |

Shared foundation artifacts take no module code.

---

## 7. Properties

**Format:** `<scope>.<module>.<setting>`, all lowercase, dot separated.

Examples: `...peer.outlier_threshold`, `...debt.dormancy_days`, `...core.batch_size`.

Every threshold, window, and weighting goes in a property. None of them are literals in code. Customers will argue about these numbers, and the ones you hardcode are the ones you will be asked to change.

Use `core` as the module segment for shared settings.

---

## 8. Business rules

**Format:** a sentence describing what happens, starting with a verb.

`Recalculate outlier status on grant change`, not `grant_inventory_br_1` and not `Outlier BR`.

The list of business rules on a table is documentation if the names are sentences, and noise if they are not. Include the trigger in the name only when a table has several rules that differ by trigger.

---

## 9. Scheduled jobs

**Format:** `<Module code capitalised>: <what it does> (<cadence>)`.

`Peer: rebuild peer group baselines (nightly)`. Cadence in the name is redundant with the record but visible in every list and log line where the record is not.

---

## 10. Client scripts and UI policies

**Format:** sentence describing the effect, prefixed with the form or view when a table has many.

`Hide justification unless action is revoke`.

Note that these apply to the native UI in Phase 4. UI Builder in Phase 5 has its own structure and does not use these artifact types.

---

## 11. ACLs

The platform names ACLs from the table, field, and operation, so there is little to decide. What matters is documenting the intent, which the name cannot carry.

Put a one-line explanation in the ACL's description field on every ACL you write. Six months from now the condition will be unreadable and the description is the only record of what it was protecting against.

---

## 12. ATF

**Format:** `<Module code capitalised>: <behaviour under test>`.

`Peer: outlier flagged when zero peers hold role`.

Group into suites per module. Name suites after the module, not after the sprint.

---

## 13. Update sets

Only relevant while working outside source control. Since Pantheon is Git-linked, prefer branches and commits.

If you do create update sets, format as `Pantheon <module code> — <change> — <date>`.

---

## 14. Git

- Branch: `<module-code>/<short-description>`, e.g. `peer/grant-inventory-table`.
- Commit messages describe the platform change, not the file diff. `Add peer_group_member table with membership ACLs` beats `update xml`.
- Commit the empty app first so every later change diffs against a clean baseline.

---

## Open decisions

- **[decide]** Whether `grant_inventory` is materialized on a schedule or computed live. This is a Phase 2 decision and the biggest performance fork in the product. The table name above assumes materialized.
- **[decide]** Whether Pantheon or Access Analyzer is the app's public-facing name in the Store listing. The scope prefix derives from the app name and is painful to change once embedded.
- **[verify]** Table and column name length limits in the Australia release, including how the scope prefix counts against them.
