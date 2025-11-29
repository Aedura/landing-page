/* eslint-disable @typescript-eslint/no-unused-vars */
import jwt, { SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { RoleType } from "../models/user";

export interface AuthTokenPayload {
  id: string;
  email: string;
  name: string;
  roleType: RoleType;
}

const DEFAULT_EXPIRATION = "1d";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
}

export function signAuthToken(
  payload: AuthTokenPayload,
  options: SignOptions = {}
): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: DEFAULT_EXPIRATION,
    ...options,
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim() || null;
  }

  const headerToken = req.headers.get("x-access-token");
  if (headerToken) {
    return headerToken.trim() || null;
  }

  const cookieToken = req.cookies.get("token")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

export async function getTokenFromCookies(): Promise<string | null> {
  try {
    return (await cookies()).get("token")?.value ?? null;
  } catch (error) {
    return null;
  }
}
