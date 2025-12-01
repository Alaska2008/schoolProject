// lib/auth.ts
import argon2 from "argon2";
import bcrypt from "bcrypt";


// Enum to define which algorithm is active
export enum HashAlgorithm {
  ARGON2 = "argon2",
  BCRYPT = "bcrypt",
}

// Choose your default algorithm here
const ACTIVE_ALGORITHM: HashAlgorithm = HashAlgorithm.ARGON2;

/**
 * Hash a password using the active algorithm
 */
export async function hashPassword(password: string): Promise<string> {
  if (ACTIVE_ALGORITHM === HashAlgorithm.ARGON2) {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }
  if (ACTIVE_ALGORITHM === HashAlgorithm.BCRYPT) {
    return bcrypt.hash(password, 12); // 12 salt rounds
  }
  throw new Error("Unsupported algorithm");
}

/**
 * Verify a password against a stored hash
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  if (ACTIVE_ALGORITHM === HashAlgorithm.ARGON2) {
    return argon2.verify(hash, password);
  }
  if (ACTIVE_ALGORITHM === HashAlgorithm.BCRYPT) {
    return bcrypt.compare(password, hash);
  }
  throw new Error("Unsupported algorithm");
}
