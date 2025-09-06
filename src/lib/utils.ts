import { auth } from "@clerk/nextjs/server";


const { userId, sessionClaims } = auth();
export const role = (sessionClaims?.metadata as { role?: string })?.role ?? null;
export const currentUserId = userId;