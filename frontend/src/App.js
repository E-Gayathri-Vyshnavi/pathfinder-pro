import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const generatePath = async () => {
    if (!current || !target) return alert("Please fill both boxes!");
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/generate', {
        current: current,
        target: target
      });

      // Handle the data returned from our FastAPI
      const steps = response.data.roadmap || [];
      setRoadmap(steps);
      
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Error: Make sure your Python backend is running on port 8000.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="glass-panel">
        <h1>PathFinder AI 🚀</h1>
        <p className="subtitle">Map your career transition with Generative AI</p>
        
        <div className="input-row">
          <input 
            placeholder="Current Role (e.g. Student)" 
            value={current}
            onChange={(e) => setCurrent(e.target.value)} 
          />
          <input 
            placeholder="Dream Job (e.g. AI Engineer)" 
            value={target}
            onChange={(e) => setTarget(e.target.value)} 
          />
          <button onClick={generatePath} disabled={loading}>
            {loading ? "Analyzing..." : "Generate My Path"}
          </button>
        </div>

        <div className="roadmap">
          {roadmap.length > 0 ? (
            roadmap.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="meta">
                  <span>⏳ {step.weeks} weeks</span>
                  <span>🔥 Difficulty: {step.difficulty}/10</span>
                </div>
              </div>
            ))
          ) : !loading && (
            <div className="placeholder-text">Your roadmap will appear here...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;