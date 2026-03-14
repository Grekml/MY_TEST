import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";

const encoder = new TextEncoder();

const accessSecret = () => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not set");
  }
  return encoder.encode(secret);
};

const refreshSecret = () => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not set");
  }
  return encoder.encode(secret);
};

const accessTtlSeconds = () => Number(process.env.JWT_ACCESS_TTL_SECONDS ?? "900");
const refreshTtlSeconds = () => Number(process.env.JWT_REFRESH_TTL_SECONDS ?? "2592000");

export const tokenConfig = {
  accessTtlSeconds,
  refreshTtlSeconds,
};

export const cookieConfig = {
  accessName: "access_token",
  refreshName: "refresh_token",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export const signAccessToken = async () => {
  const ttl = accessTtlSeconds();
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(accessSecret());
};

export const signRefreshToken = async (sessionId: string) => {
  const ttl = refreshTtlSeconds();
  return new SignJWT({ sub: "admin", sid: sessionId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(refreshSecret());
};

export const verifyRefreshToken = async (token: string) => {
  const { payload } = await jwtVerify(token, refreshSecret());
  return payload;
};

export const verifyAccessToken = async (token: string) => {
  const { payload } = await jwtVerify(token, accessSecret());
  return payload;
};

export const hashRefreshToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");
