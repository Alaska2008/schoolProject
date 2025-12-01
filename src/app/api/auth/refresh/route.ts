// app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // 1. Get refresh token from cookie
  const refreshToken = req.headers.get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("refreshToken="))
    ?.split("=")[1];

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    // 2. Verify refresh token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_ACCESS_SECRETT!) as {
      userId: string;
    };

    // 3. Check session in DB
    const session = await prisma.session.findFirst({
      where: {
        userId: decoded.userId,
        refreshToken,
        expiresAt: { gt: new Date() }, // still valid
      },
      include: { user: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    // 4. Issue new access token
    const newAccessToken = jwt.sign(
      { userId: session.userId, role: session.user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "15m" }
    );

    // 5. (Optional) Rotate refresh token
    const newRefreshToken = jwt.sign(
      { userId: session.userId },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "1d" }
    );

    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 6. Return new tokens
    const res = NextResponse.json({ accessToken: newAccessToken, userId: session.userId, role: session.user.role, email: session.user.email });
    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}



// // app/api/auth/refresh/route.ts
// // import { NextResponse } from "next/server";
// // import jwt from "jsonwebtoken";
// // import prisma from "@/lib/prisma";
// // // import { cookies } from "next/headers";

// // export async function POST(req: Request) {
  
// //   const refreshToken = req.cookies.get("refreshToken")?.value;
// //   if (!refreshToken) return NextResponse.json({ error: "No refresh token" }, { status: 401 });

// //   try {
// //     const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as { userId: string };

// //     const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    
// //     if (!user || user.refreshToken !== refreshToken) {
// //       return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
// //     }

// //     const newAccessToken = jwt.sign(
// //       { userId: user.id, role: user.role },
// //       process.env.JWT_SECRET!,
// //       { expiresIn: "15m" }
// //     );

// //     return NextResponse.json({ accessToken: newAccessToken });
// //   } catch {
// //     return NextResponse.json({ error: "Expired or invalid refresh token" }, { status: 401 });
// //   }
// // }



// import { NextResponse } from "next/server";
// import  prisma  from "@/lib/prisma";
// import argon2 from "argon2";
// import { signAccessToken, generateRandomToken, hashToken } from "@/lib/crypto";

// export async function POST(req: Request) {
//   const refresh = req.headers.get("cookie")?.match(/refresh_token=([^;]+)/)?.[1];
//   if (!refresh) return NextResponse.json({ error: "Missing refresh token" }, { status: 401 });

//   const sessions = await prisma.session.findMany({
//     where: { revokedAt: null, expiresAt: { gt: new Date() } },
//     orderBy: { createdAt: "desc" },
//     take: 20, // small bound
//   });

//   // Verify against each session (or index by hashed token if you use HMAC)
//   let session = null as null | (typeof sessions)[number];
//   for (const s of sessions) {
//     if (await argon2.verify(s.refreshToken, refresh)) {
//       session = s;
//       break;
//     }
//   }
//   if (!session) return NextResponse.json({ error: "Invalid refresh" }, { status: 401 });

//   // Rotate: revoke old, create new
//   const rawRefresh = generateRandomToken(64);
//   const refreshHash = await hashToken(rawRefresh);

//   await prisma.$transaction([
//     prisma.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } }),
//     prisma.session.create({
//       data: {
//         userId: session.userId,
//         refreshToken: refreshHash,
//         expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
//         userAgent: req.headers.get("user-agent") || undefined,
//         ipAddress: req.headers.get("x-forwarded-for") || undefined,
//       },
//     }),
//   ]);

//   const accessToken = signAccessToken(
//     { sub: session.userId },
//     process.env.JWT_ACCESS_SECRET!,
//     15
//   );

//   const res = NextResponse.json({ accessToken });
//   res.cookies.set("refresh_token", rawRefresh, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 30,
//   });
//   return res;
// }
