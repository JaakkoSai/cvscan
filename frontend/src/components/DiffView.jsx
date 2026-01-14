import React from "react";
import * as Diff from "diff";
import ReactMarkdown from "react-markdown";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function DiffView({ originalText, newText, isFullText }) {
  if (!originalText || !newText) return null;

  // If it's the full text, we want to show the whole resume side-by-side
  // If it's just a snippet (fallback), we show the snippet
  const diff = Diff.diffWords(originalText, newText);

  return (
    <div className="grid md:grid-cols-2 gap-4 h-[600px]">
      {/* Original Resume Pane */}
      <Card className="flex flex-col h-full overflow-hidden border-destructive/20">
        <CardHeader className="bg-destructive/10 py-3 border-b">
          <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
            Before (Original)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {diff.map((part, index) => {
            // In Original View: Show Removed parts (Red) and Common parts. Hide Added parts.
            if (part.added) return null;
            return <span key={index}>{part.value}</span>;
          })}
        </CardContent>
      </Card>

      {/* Optimized Resume Pane */}
      <Card className="flex flex-col h-full overflow-hidden border-green-500/20">
        <CardHeader className="bg-green-500/10 py-3 border-b">
          <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
            After (AI Optimized)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto flex-1 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {diff.map((part, index) => {
            // In Optimized View: Show Added parts (Green) and Common parts. Hide Removed parts.
            if (part.removed) return null;
            return (
              <span
                key={index}
                className={
                  part.added ? "bg-green-200 text-green-900 font-bold" : ""
                }
              >
                {part.value}
              </span>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

export default DiffView;
