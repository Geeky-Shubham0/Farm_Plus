import React, { useState } from "react";
import "./FPOAggregator.css";

const FPOAggregator = () => {
  const [fpoId, setFpoId] = useState("");
  const [crop, setCrop] = useState("");
  const [grade, setGrade] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with backend API call
    // Demo: show fake aggregation result
    setResult({
      fpo_id: fpoId,
      crop,
      grade,
      total_quantity_kg: 12000,
      average_fpqi: 78.5,
      farmer_lot_ids: ["L001", "L002", "L003"]
    });
  };

  return (
    <div className="fpo-aggregator-container">
      <h2>FPO Marketplace Aggregation</h2>
      <form className="fpo-agg-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="FPO ID"
          value={fpoId}
          onChange={e => setFpoId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Crop"
          value={crop}
          onChange={e => setCrop(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Grade"
          value={grade}
          onChange={e => setGrade(e.target.value)}
          required
        />
        <button type="submit">Aggregate Lots</button>
      </form>
      {result && (
        <div className="fpo-agg-result">
          <h3>Aggregated Lot</h3>
          <p><b>FPO ID:</b> {result.fpo_id}</p>
          <p><b>Crop:</b> {result.crop}</p>
          <p><b>Grade:</b> {result.grade}</p>
          <p><b>Total Quantity (kg):</b> {result.total_quantity_kg}</p>
          <p><b>Average FPQI:</b> {result.average_fpqi}</p>
          <p><b>Farmer Lot IDs:</b> {result.farmer_lot_ids.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default FPOAggregator;
