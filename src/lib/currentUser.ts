import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

function verifyAccessToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch {
    return null;
  }
};

export async function currentUser() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value ;
  const user = verifyAccessToken(refreshToken!, process.env.JWT_ACCESS_SECRET!)
  if (!user?.userId) return null;
  
  //     console.log("CurrentuserId: ", userId);
  // const user = await prisma.user.findUnique({
  //     where: { id: userId },
  //     select: { id: true, email: true, role: true, username: true },
  // });
  // console.log("USER: ", user)
  return user; 
}



// import { cookies, headers } from "next/headers";
// import prisma from "@/lib/prisma";

// export async function currentUser() {
//   const cookieStore = cookies();
//   const headerStore = headers();
//   const userId = cookieStore.get("userId")?.value || headerStore.get("x-user-id");
//   if (!userId) return null;
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { id: true, email: true, role: true,username:true },
//   });
//   return user;
// }
