import { useState } from "react";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export default function Home() {
  const [blockSize, setBlockSize] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ block_size_sqm: blockSize })
      });
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError("Error fetching data. Please try again.");
    }
    setLoading(false);
  };

  const exportToExcel = () => {
    if (!results) return;
    
    const worksheet = XLSX.utils.book_new();
    Object.keys(results).forEach(category => {
      const data = Object.entries(results[category]).map(([material, details]) => ({
        Material: material,
        Quantity: details.quantity,
        Unit: details.unit
      }));
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(worksheet, sheet, category);
    });
    
    const excelBuffer = XLSX.write(worksheet, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(blob, "Orchard_Estimation.xlsx");
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", maxWidth: "600px", margin: "auto" }}>
      <h1>🌿 Orchard Block Materials Estimator</h1>
      <p>Enter your block size to estimate the materials needed for construction.</p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
        <label>Enter Block Size (sqm):</label>
        <input
          type="number"
          value={blockSize}
          onChange={(e) => setBlockSize(e.target.value)}
          placeholder="Enter block size"
          style={{
            padding: "10px",
            fontSize: "16px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
            textAlign: "center",
            width: "100%",
            maxWidth: "250px"
          }}
        />

        <button
          onClick={handleCalculate}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            fontSize: "16px",
            backgroundColor: loading ? "#aaa" : "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            textAlign: "center",
            width: "100%",
            maxWidth: "250px"
          }}
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {results && (
        <div style={{ marginTop: "20px" }}>
          <h2>Estimated Materials</h2>
          {Object.keys(results).map((category) => (
            <div key={category} style={{ marginBottom: "20px" }}>
              <h3>{category}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#007BFF", color: "white" }}>Material</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#007BFF", color: "white" }}>Quantity</th>
                    <th style={{ border: "1px solid #ddd", padding: "10px", backgroundColor: "#007BFF", color: "white" }}>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(results[category]).map((material) => (
                    <tr key={material}>
                      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{material}</td>
                      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{results[category][material].quantity}</td>
                      <td style={{ border: "1px solid #ddd", padding: "10px" }}>{results[category][material].unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <button onClick={exportToExcel} style={{ marginTop: "20px", padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Download Excel</button>
        </div>
      )}

      <footer style={{ marginTop: "30px", fontSize: "14px", color: "#666" }}>
        <p>© 2025 Created and Developed by Chris Manlunas for Southern Cross Horticulture</p>
      </footer>
    </div>
  );
}
