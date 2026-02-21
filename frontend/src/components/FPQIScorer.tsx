import React, { useState } from "react";
import "./FPQIScorer.css";

const FPQIScorer = () => {
  const [inputs, setInputs] = useState({
    moisture_score: "",
    soil_score: "",
    heat_index: "",
    freshness_score: "",
    storage_risk_score: ""
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with backend API call
    const fpqi =
      0.35 * Number(inputs.moisture_score) +
      0.20 * Number(inputs.soil_score) +
      0.15 * Number(inputs.heat_index) +
      0.15 * Number(inputs.freshness_score) +
      0.15 * Number(inputs.storage_risk_score);
    let grade = "Secondary";
    if (fpqi >= 80) grade = "Premium";
    else if (fpqi >= 65) grade = "Processing";
    setResult({ fpqi: Math.round(fpqi * 100) / 100, grade });
  };

  return (
    <div className="fpqi-scorer-container">
      <h2>FPQI Scoring (Quality Index)</h2>
      <form className="fpqi-form" onSubmit={handleSubmit}>
        {Object.keys(inputs).map((key) => (
          <div key={key} className="fpqi-input-group">
            <label>{key.replace(/_/g, " ")}</label>
            <input
              type="number"
              name={key}
              value={inputs[key]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button type="submit">Calculate FPQI</button>
      </form>
      {result && (
        <div className="fpqi-result">
          <h3>FPQI Score: {result.fpqi}</h3>
          <span className={`fpqi-grade fpqi-grade-${result.grade.toLowerCase()}`}>{result.grade} Grade</span>
        </div>
      )}
    </div>
  );
};

export default FPQIScorer;
