// @vitest-environment node
import { test, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("server-only", () => ({}));

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockDelete = vi.fn();

vi.mock("next/headers", () => ({
  cookies: () => ({
    get: mockGet,
    set: mockSet,
    delete: mockDelete,
  }),
}));

import { createSession, getSession, deleteSession, verifySession } from "../auth";
import { NextRequest } from "next/server";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

test("createSession sets an httpOnly cookie with a JWT", async () => {
  await createSession("user-123", "test@example.com");

  expect(mockSet).toHaveBeenCalledOnce();
  const [name, token, options] = mockSet.mock.calls[0];
  expect(name).toBe("auth-token");
  expect(typeof token).toBe("string");
  expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
  expect(options.httpOnly).toBe(true);
  expect(options.sameSite).toBe("lax");
  expect(options.path).toBe("/");
});

test("getSession returns session payload when valid token exists", async () => {
  await createSession("user-123", "test@example.com");
  const token = mockSet.mock.calls[0][1];

  mockGet.mockReturnValue({ value: token });

  const session = await getSession();
  expect(session).not.toBeNull();
  expect(session?.userId).toBe("user-123");
  expect(session?.email).toBe("test@example.com");
});

test("getSession returns null when no cookie is present", async () => {
  mockGet.mockReturnValue(undefined);

  const session = await getSession();
  expect(session).toBeNull();
});

test("getSession returns null for an invalid token", async () => {
  mockGet.mockReturnValue({ value: "not.a.valid.jwt" });

  const session = await getSession();
  expect(session).toBeNull();
});

test("deleteSession removes the auth cookie", async () => {
  await deleteSession();
  expect(mockDelete).toHaveBeenCalledOnce();
  expect(mockDelete).toHaveBeenCalledWith("auth-token");
});

test("verifySession returns session payload for a valid token in the request", async () => {
  await createSession("user-456", "other@example.com");
  const token = mockSet.mock.calls[0][1];

  const request = new NextRequest("http://localhost/api/test", {
    headers: { cookie: `auth-token=${token}` },
  });

  const session = await verifySession(request);
  expect(session).not.toBeNull();
  expect(session?.userId).toBe("user-456");
  expect(session?.email).toBe("other@example.com");
});

test("verifySession returns null when no cookie is in the request", async () => {
  const request = new NextRequest("http://localhost/api/test");

  const session = await verifySession(request);
  expect(session).toBeNull();
});

test("verifySession returns null for an invalid token in the request", async () => {
  const request = new NextRequest("http://localhost/api/test", {
    headers: { cookie: "auth-token=invalid.token.here" },
  });

  const session = await verifySession(request);
  expect(session).toBeNull();
});
