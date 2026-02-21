import React, { useState } from "react";
import "./B2BMatcher.css";

const B2BMatcher = () => {
  const [inputs, setInputs] = useState({
    required_grade: "",
    moisture_min: "",
    moisture_max: "",
    min_quantity_kg: "",
    location: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with backend API call
    // Demo: show fake match result
    setResult({
      lot_id: "L002",
      fpqi: 82.1,
      quantity_kg: 5000,
      distance_km: 12,
      score: 91.5
    });
  };

  return (
    <div className="b2b-matcher-container">
      <h2>B2B Matching Engine</h2>
      <form className="b2b-match-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="required_grade"
          placeholder="Required Grade"
          value={inputs.required_grade}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="moisture_min"
          placeholder="Moisture Min (%)"
          value={inputs.moisture_min}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="moisture_max"
          placeholder="Moisture Max (%)"
          value={inputs.moisture_max}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="min_quantity_kg"
          placeholder="Min Quantity (kg)"
          value={inputs.min_quantity_kg}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={inputs.location}
          onChange={handleChange}
          required
        />
        <button type="submit">Find Best Match</button>
      </form>
      {result && (
        <div className="b2b-match-result">
          <h3>Best Match Lot</h3>
          <p><b>Lot ID:</b> {result.lot_id}</p>
          <p><b>FPQI:</b> {result.fpqi}</p>
          <p><b>Quantity (kg):</b> {result.quantity_kg}</p>
          <p><b>Distance (km):</b> {result.distance_km}</p>
          <p><b>Match Score:</b> {result.score}</p>
        </div>
      )}
    </div>
  );
};

export default B2BMatcher;
