import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
};
function verifyAccessToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch {
    return null;
  }
};
export async function POST(req: Request) {

  const cookieStore = cookies();
  const existingToken = cookieStore.get("accessToken")?.value;
  console.log("existingToken: ", existingToken)
  if (existingToken) {
    try {
      verifyAccessToken(existingToken, process.env.JWT_ACCESS_SECRET!);
      console.log("Already logged in")
      return NextResponse.json({ message: "Already logged in" });
    } catch {
      console.log("token invalid/expired → continue with login")
    }
  }
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = verifyPassword(user.passwordHash, password)
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id,role: user.role, email: email },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "1d" }
  );
 
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt,
    },
  });

  // Set cookies for userId and role
  cookieStore.set("userId", String(user.id), {
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  cookieStore.set("role", String(user.role), {
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    // secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  const res = NextResponse.json({ accessToken, role: user.role, userId: user.id });
  // res.cookies.set("accessToken", accessToken, { httpOnly: true, secure: true });
  // res.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true });
  // res.cookies.set("userId", user.id, { httpOnly: true, secure: true });
  return res;


}
