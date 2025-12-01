import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import argon2 from "argon2";

export async function POST(req: Request) {
  const refresh = req.headers.get("cookie")?.match(/refresh_token=([^;]+)/)?.[1];
  if (refresh) {
    const sessions = await prisma.session.findMany({ where: { revokedAt: null } });
    for (const s of sessions) {
      if (await argon2.verify(s.refreshToken, refresh)) {
        await prisma.session.update({ where: { id: s.id }, data: { revokedAt: new Date() } });
        break;
      }
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set("refresh_token", "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  console.log("response: ", res);
  return res;
}
