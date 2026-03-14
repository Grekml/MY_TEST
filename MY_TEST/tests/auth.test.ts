import { describe, expect, it } from "vitest";
import {
  hashRefreshToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/auth";

describe("auth tokens", () => {
  it("signs and verifies refresh tokens", async () => {
    process.env.JWT_REFRESH_SECRET = "test_refresh_secret";
    const token = await signRefreshToken("session-123");
    const payload = await verifyRefreshToken(token);
    expect(payload.sid).toBe("session-123");
  });

  it("hashes refresh tokens consistently", () => {
    const token = "token-value";
    expect(hashRefreshToken(token)).toBe(hashRefreshToken(token));
  });
});
