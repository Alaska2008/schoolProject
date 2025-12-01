import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateRandomToken, hashToken } from "@/lib/crypto";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  // Always respond successfully to avoid user enumeration
  if (user) {
    const raw = generateRandomToken();
    const tokenHash = await hashToken(raw);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });
    // TODO: send email with /reset?token=RAW&user=USERID
  }
  return NextResponse.json({ ok: true });
}
