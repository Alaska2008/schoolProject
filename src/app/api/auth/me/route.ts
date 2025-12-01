import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "@/lib/crypto";

export async function GET() {
  const cookieStore = cookies();
  const token =  cookieStore.get("refreshToken")?.value;

  if (!token) {
    return Response.json({ loggedIn: false });
  }

  try {
    const decoded = verifyAccessToken(token, process.env.JWT_ACCESS_SECRET!);
    return Response.json({ loggedIn: true, user: decoded });
  } catch {
    return Response.json({ loggedIn: false });
  }
}
