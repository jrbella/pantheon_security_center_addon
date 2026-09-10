import React, { useEffect, useState } from "react";
import PageLayout from "./components/PageLayout";
import {
  getAllFindings,
  getFinding,
  getHighestScoreFindingId,
  getNodes
} from "./services/BlastRadiusService";
import { Finding, GraphNodeData, RankedFinding } from "./types";
import "./app.css";

export default function App() {
  const [finding, setFinding] = useState<Finding | null>(null);
  const [nodes, setNodes] = useState<GraphNodeData[]>([]);
  const [rankedFindings, setRankedFindings] = useState<RankedFinding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams(window.location.search);
        const findingId = params.get("finding") || (await getHighestScoreFindingId());
        const [findingData, nodeData, allFindings] = await Promise.all([
          getFinding(findingId),
          getNodes(findingId),
          getAllFindings()
        ]);
        setFinding(findingData);
        setNodes(nodeData);
        setRankedFindings(allFindings);
      } catch (e: any) {
        setError(e.message || "Failed to load blast radius data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="blast-radius__status">Blast Radius Graph — loading</div>;
  }

  if (error || !finding) {
    return (
      <div className="blast-radius__status blast-radius__status--error">
        {error || "No blast radius data found"}
      </div>
    );
  }

  return <PageLayout finding={finding} nodes={nodes} rankedFindings={rankedFindings} />;
}
