// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
 import { hashPassword } from "@/lib/crypto";

// export async function POST(req: Request) {
//   const { email, password, username, role } = await req.json();

//   if (!email || !password || !role) {
//     return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//   }

//   const existing = await prisma.user.findUnique({ where: { email } });
//   if (existing) {
//     return NextResponse.json({ error: "Email already in use" }, { status: 409 });
//   }

//   const passwordHash = await hashPassword(password);

//   const user = await prisma.user.create({
//     data: { email, passwordHash, username, role },
//   });

//   // Verification token
//   const rawToken = generateRandomToken();
//   const tokenHash = await hashToken(rawToken);
//   const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);

//   await prisma.verificationToken.create({
//     data: { userId: user.id, tokenHash, expiresAt },
//   });

//   return NextResponse.json({ ok: true, userId: user.id });
// }


// app/api/register/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role
      },
    });

    return NextResponse.json({ message: "User created", userId: user.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
