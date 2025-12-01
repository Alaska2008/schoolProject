
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export async function hashPassword(password: string) {
  return argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 });
};

// export async function verifyPassword(hash: string, password: string) {
//   return argon2.verify(hash, password);
// };

// export function generateRandomToken(bytes = 32) {
//   return randomBytes(bytes).toString("hex"); // raw token to email
// };

// export async function hashToken(token: string) {
//   return argon2.hash(token, { type: argon2.argon2id });
// };

// export function signAccessToken(payload: object, secret: string, expiresIn = 15) {
//   // const options: SignOptions = { expiresIn };
//   return jwt.sign(payload, secret, { expiresIn });
// };

export function verifyAccessToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch {
    return null;
  }
};

// Constant-time compare helper for token verification when using HMAC/SHA-256 digests
// export function safeCompare(a: NodeJS.ArrayBufferView, b: NodeJS.ArrayBufferView ){
//   if (a.byteLength!== b.byteLength) return false;
//   return timingSafeEqual(a, b);
// };


