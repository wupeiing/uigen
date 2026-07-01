import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

function makeInvocation(
  toolName: string,
  input: Record<string, any>,
  state: "input-available" | "output-available" = "input-available"
) {
  return { toolName, toolCallId: "test-id", input, state };
}

test("str_replace_editor create pending shows Creating + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" })} />);
  expect(screen.getByText(/Creating/)).toBeDefined();
  expect(screen.getByText("/App.jsx")).toBeDefined();
});

test("str_replace_editor create done shows Created + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "output-available")} />);
  expect(screen.getByText(/Created/)).toBeDefined();
  expect(screen.getByText("/App.jsx")).toBeDefined();
});

test("str_replace_editor str_replace pending shows Editing + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/components/Button.tsx" })} />);
  expect(screen.getByText(/Editing/)).toBeDefined();
  expect(screen.getByText("/components/Button.tsx")).toBeDefined();
});

test("str_replace_editor str_replace done shows Edited + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/components/Button.tsx" }, "output-available")} />);
  expect(screen.getByText(/Edited/)).toBeDefined();
});

test("str_replace_editor insert pending shows Inserting into + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/App.jsx" })} />);
  expect(screen.getByText(/Inserting into/)).toBeDefined();
  expect(screen.getByText("/App.jsx")).toBeDefined();
});

test("str_replace_editor insert done shows Inserted into + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/App.jsx" }, "output-available")} />);
  expect(screen.getByText(/Inserted into/)).toBeDefined();
});

test("file_manager rename pending shows Renaming + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" })} />);
  expect(screen.getByText(/Renaming/)).toBeDefined();
  expect(screen.getByText("/old.jsx")).toBeDefined();
});

test("file_manager rename done shows Renamed + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" }, "output-available")} />);
  expect(screen.getByText(/Renamed/)).toBeDefined();
});

test("file_manager delete pending shows Deleting + path", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/old.jsx" })} />);
  expect(screen.getByText(/Deleting/)).toBeDefined();
  expect(screen.getByText("/old.jsx")).toBeDefined();
});

test("unknown tool falls back to raw tool name", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("some_other_tool", {})} />);
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("pending state shows loader", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" })} />);
  expect(screen.getByLabelText("loading")).toBeDefined();
});

test("done state shows no loader", () => {
  render(<ToolInvocationBadge toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "output-available")} />);
  expect(screen.queryByLabelText("loading")).toBeNull();
});
