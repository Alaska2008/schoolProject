import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import argon2 from "argon2";
import { hashPassword } from "@/lib/crypto";

export async function POST(req: Request) {
  const { userId, token, newPassword } = await req.json();
  if (!userId || !token || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const record = await prisma.passwordResetToken.findFirst({
    where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return NextResponse.json({ error: "Invalid or expired" }, { status: 400 });

  const ok = await argon2.verify(record.tokenHash, token);
  if (!ok) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const newHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    prisma.session.updateMany({ where: { userId }, data: { revokedAt: new Date() } }), // revoke sessions after reset
  ]);

  return NextResponse.json({ ok: true });
}
