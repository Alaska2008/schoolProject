import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import argon2 from "argon2";

export async function POST(req: Request) {
  const { token, userId } = await req.json();
  if (!token || !userId) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const record = await prisma.verificationToken.findFirst({
    where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return NextResponse.json({ error: "Invalid or expired" }, { status: 400 });

  const ok = await argon2.verify(record.tokenHash, token);
  if (!ok) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.verificationToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return NextResponse.json({ ok: true });
}
