import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  FileText,
  Search,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import DiffView from "@/components/DiffView";

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [refinementComment, setRefinementComment] = useState("");
  const [refining, setRefining] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleRefinement = async () => {
    if (!result || !refinementComment) return;
    setRefining(true);

    const formData = new FormData();
    formData.append("resume_text", result.text);
    formData.append(
      "missing_keywords",
      JSON.stringify(result.analysis.missing_keywords || [])
    );
    formData.append(
      "hiring_company",
      result.analysis.hiring_company_name || "the company"
    );
    formData.append(
      "target_country",
      result.analysis.target_country || "International"
    );
    formData.append("user_feedback", refinementComment);

    try {
      const response = await axios.post(
        "http://localhost:8000/refine",
        formData
      );

      // Update the optimization result with the new one
      setResult((prev) => ({
        ...prev,
        optimization: response.data.optimization,
      }));
      setRefinementComment(""); // Clear comment
    } catch (err) {
      console.error(err);
      setError("Failed to refine resume. Please try again.");
    } finally {
      setRefining(false);
    }
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
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post(
        "http://localhost:8000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(
        "An error occurred during analysis. Please check the backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-primary">
            <Search className="w-10 h-10" />
            <h1 className="text-4xl font-bold tracking-tight">CV Scan</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Optimize your resume for the ATS with AI-powered insights.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                1. Upload Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:bg-slate-50 transition-colors gap-4">
                <Input
                  id="resume-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.docx"
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("resume-upload").click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {file ? file.name : "Supported: PDF, DOCX"}
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                2. Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            size="lg"
            className="px-8 text-lg w-full md:w-auto"
          >
            {loading ? "Analyzing..." : "Scan Resume"}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center font-medium flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Analysis Summary */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="col-span-1 text-center flex flex-col justify-center items-center py-8">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className="text-slate-200"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="currentColor"
                      strokeWidth="10"
                      fill="transparent"
                      className={`text-primary ${
                        result.analysis.match_score > 70
                          ? "text-green-500"
                          : result.analysis.match_score > 40
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                      strokeDasharray={440}
                      strokeDashoffset={
                        440 - (440 * result.analysis.match_score) / 100
                      }
                    />
                  </svg>
                  <span className="absolute text-4xl font-bold">
                    {result.analysis.match_score}%
                  </span>
                </div>
                <p className="mt-4 font-semibold text-lg">Match Score</p>
              </Card>

              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Keyword Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-4 h-4" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.missing_keywords &&
                      result.analysis.missing_keywords.length > 0 ? (
                        result.analysis.missing_keywords.map((kw, i) => (
                          <Badge key={i} variant="destructive">
                            {kw}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Great job! No
                          missing keywords.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" /> Found Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.analysis.found_keywords &&
                        result.analysis.found_keywords.map((kw, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            {kw}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <h4 className="font-semibold mb-2">Summary</h4>
                    <p className="text-sm text-muted-foreground">
                      {result.analysis.summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side-by-Side Diff View */}
            {result.optimization && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Resume Optimization</h2>
                <DiffView
                  originalText={result.text}
                  newText={
                    result.optimization.full_modified_text ||
                    result.optimization.rewritten_text
                  }
                  isFullText={!!result.optimization.full_modified_text}
                />

                {/* Refinement Section */}
                <Card className="mt-8 border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        !
                      </span>
                      Refine with Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Not happy with the suggestion? Want to emphasize something
                      specific? Tell the AI what to change, and it will re-write
                      the optimization for you.
                    </p>
                    <Textarea
                      placeholder="E.g., 'I don't actually know Java, please remove it.' or 'Emphasize my leadership in the Nokia project more.'"
                      value={refinementComment}
                      onChange={(e) => setRefinementComment(e.target.value)}
                      className="bg-background"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleRefinement}
                        disabled={refining || !refinementComment.trim()}
                      >
                        {refining ? "Refining..." : "Update Optimization"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
