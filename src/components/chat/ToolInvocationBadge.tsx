"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  toolCallId: string;
  input: Record<string, any>;
  state: string;
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

function getLabel(toolName: string, input: Record<string, any>, done: boolean): React.ReactNode {
  const path = input.path ? (
    <span className="font-mono">{input.path}</span>
  ) : null;

  if (toolName === "str_replace_editor") {
    switch (input.command) {
      case "create":
        return <>{done ? "Created" : "Creating"} {path}</>;
      case "str_replace":
        return <>{done ? "Edited" : "Editing"} {path}</>;
      case "insert":
        return <>{done ? "Inserted into" : "Inserting into"} {path}</>;
      case "view":
        return <>{done ? "Viewed" : "Viewing"} {path}</>;
      case "undo_edit":
        return <>{done ? "Undid edit on" : "Undoing edit on"} {path}</>;
    }
  }

  if (toolName === "file_manager") {
    switch (input.command) {
      case "rename":
        return <>{done ? "Renamed" : "Renaming"} {path}</>;
      case "delete":
        return <>{done ? "Deleted" : "Deleting"} {path}</>;
    }
  }

  return <>{toolName}</>;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const done =
    toolInvocation.state === "output-available" ||
    toolInvocation.state === "output-error" ||
    toolInvocation.state === "output-denied";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" aria-label="loading" />
      )}
      <span className="text-neutral-700">
        {getLabel(toolInvocation.toolName, toolInvocation.input ?? {}, done)}
      </span>
    </div>
  );
}
