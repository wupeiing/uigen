import { test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { MainContent } from "@/app/main-content";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Pass-through context providers so MainContent can render in isolation.
vi.mock("@/lib/contexts/file-system-context", () => ({
  FileSystemProvider: ({ children }: { children: any }) => <>{children}</>,
  useFileSystem: () => ({ getAllFiles: () => new Map(), refreshTrigger: 0 }),
}));

vi.mock("@/lib/contexts/chat-context", () => ({
  ChatProvider: ({ children }: { children: any }) => <>{children}</>,
  useChat: () => ({}),
}));

// Stub the heavy panels with simple markers so we can assert which view is active.
vi.mock("@/components/chat/ChatInterface", () => ({
  ChatInterface: () => <div data-testid="chat-interface" />,
}));
vi.mock("@/components/editor/FileTree", () => ({
  FileTree: () => <div data-testid="file-tree" />,
}));
vi.mock("@/components/editor/CodeEditor", () => ({
  CodeEditor: () => <div data-testid="code-editor" />,
}));
vi.mock("@/components/preview/PreviewFrame", () => ({
  PreviewFrame: () => <div data-testid="preview-frame" />,
}));
vi.mock("@/components/HeaderActions", () => ({
  HeaderActions: () => <div data-testid="header-actions" />,
}));

// Resizable panels are just layout wrappers for this test.
vi.mock("@/components/ui/resizable", () => ({
  ResizablePanelGroup: ({ children }: { children: any }) => <div>{children}</div>,
  ResizablePanel: ({ children }: { children: any }) => <div>{children}</div>,
  ResizableHandle: () => <div />,
}));

test("renders the Preview view by default", () => {
  render(<MainContent user={null} />);

  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});

test("clicking the Code tab toggles from preview to code", () => {
  render(<MainContent user={null} />);

  fireEvent.click(screen.getByText("Code"));

  expect(screen.getByTestId("code-editor")).toBeDefined();
  expect(screen.getByTestId("file-tree")).toBeDefined();
  expect(screen.queryByTestId("preview-frame")).toBeNull();
});

test("clicking the Preview tab toggles back from code to preview", () => {
  render(<MainContent user={null} />);

  // Switch to code first...
  fireEvent.click(screen.getByText("Code"));
  expect(screen.getByTestId("code-editor")).toBeDefined();

  // ...then back to preview.
  fireEvent.click(screen.getByText("Preview"));

  expect(screen.getByTestId("preview-frame")).toBeDefined();
  expect(screen.queryByTestId("code-editor")).toBeNull();
});
