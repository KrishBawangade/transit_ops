import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "transitops-secret-key-change-in-prod";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "24h";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY as any });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
