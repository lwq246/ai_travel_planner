import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // Token expires in 7 days
const COOKIE_NAME = "aitp_token";

export interface TokenPayload {
  userId: string;
  email: string;
  name?: string;
}

/**
 * Generate a JWT token for a user
 * @param payload - User data to encode in the token
 * @returns JWT token string
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token string to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("[JWT_VERIFY]", error);
    return null;
  }
}

/**
 * Decode a JWT token without verification (for debugging)
 * @param token - JWT token string to decode
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("[JWT_DECODE]", error);
    return null;
  }
}

/**
 * Get JWT token from request cookies
 * @param request - Next.js request object
 * @returns JWT token string or null if not found
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return token || null;
}

/**
 * Get authenticated user from request cookies
 * @param request - Next.js request object
 * @returns Decoded token payload or null if invalid/not found
 */
export function getAuthenticatedUser(
  request: NextRequest
): TokenPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}
