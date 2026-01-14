import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      setError("Please upload a resume and provide a job description.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      // Assuming backend is on port 8000
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("An error occurred during analysis. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Jobscan Clone</h1>
        <p>Optimize your resume for the job you want.</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <div className="card">
            <h2>1. Upload Resume</h2>
            <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />
          </div>

          <div className="card">
            <h2>2. Job Description</h2>
            <textarea 
              rows="10" 
              value={jobDescription} 
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
            />
          </div>

          <button onClick={handleAnalyze} disabled={loading} className="analyze-btn">
            {loading ? 'Analyzing...' : 'Scan Resume'}
          </button>
          
          {error && <div className="error">{error}</div>}
        </div>

        {result && (
          <div className="results-section">
            <div className="split-view">
              <div className="resume-view">
                <h3>Original Resume Text</h3>
                <pre>{result.text}</pre>
              </div>
              
              <div className="analysis-view">
                <h3>Analysis Report</h3>
                
                <div className="score-card">
                  <h4>Match Score</h4>
                  <div className="score-circle">
                    {result.analysis.match_score || 0}%
                  </div>
                </div>

                <div className="keywords-section">
                  <h4>Missing Keywords</h4>
                  <div className="chips">
                    {result.analysis.missing_keywords && result.analysis.missing_keywords.map((kw, i) => (
                      <span key={i} className="chip missing">{kw}</span>
                    ))}
                    {(!result.analysis.missing_keywords || result.analysis.missing_keywords.length === 0) && <p>All keywords found!</p>}
                  </div>

                  <h4>Found Keywords</h4>
                  <div className="chips">
                     {result.analysis.found_keywords && result.analysis.found_keywords.map((kw, i) => (
                      <span key={i} className="chip found">{kw}</span>
                    ))}
                  </div>
                </div>

                <div className="summary-section">
                   <h4>Summary</h4>
                   <p>{result.analysis.summary}</p>
                </div>

                {result.optimization && (
                  <div className="optimization-section">
                    <h3>AI Optimization Suggestion</h3>
                    <div className="optimization-content">
                      <pre>{result.optimization}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
