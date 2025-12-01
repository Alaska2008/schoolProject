// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { routeAccessMap } from "./lib/settings";

function matchRoute(pathname: string) {
  return Object.entries(routeAccessMap).find(([route]) =>
    pathname.startsWith(route)
  );
};
function verifyAccessToken(token: string, secret: string) {
  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch {
    return null;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log("pathname: ", pathname);

  if (pathname.startsWith("/_next") || pathname.match(/\.(.*)$/)) {
    return NextResponse.next();
  };


  const userId = req.cookies.get("userId")?.value;
  console.log("userId: ", userId);
  const role = req.cookies.get("role")?.value;
  console.log("Role: ", role);

  if (!userId) {
    // return NextResponse.redirect(new URL("/sign-in", req.url));
    return NextResponse.next();
  }
  const matched = matchRoute(pathname);
  console.log("matched: ", matched);
  if (!matched) {
    return NextResponse.next();
  }
  // const token = req.cookies.get("refreshToken")?.value
  try {
    // const decoded = verifyAccessToken(token!, process.env.JWT_ACCESS_SECRET!);
    const [, allowedRoles] = matched;
    // console.log("decoded", decoded);

    if (!allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
    const res = NextResponse.next();

    // Attach userId to header (for API routes)
    res.headers.set("x-user-id", userId);

    return res;
  } catch (err) {
    return NextResponse.redirect(new URL("api/auth/refresh", req.url));
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/dashboard/:path*",
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};








// import { routeAccessMap } from "./lib/settings";
// import { NextRequest, NextResponse } from "next/server";
// import { verifyAccessToken } from "@/lib/crypto";

// // const matchers = Object.keys(routeAccessMap).map((route) => ({
// //   matcher: createRouteMatcher([route]),
// //   allowedRoles: routeAccessMap[route],
// // }));

// // // const isProtectedRoute = createRouteMatcher(['/admin', '/teacher','/parent','/student'])
// // export default clerkMiddleware((auth, req) => {
// //   // if (isProtectedRoute(req)) auth().protect()
// //   const { sessionClaims } = auth()
// //   const role = (sessionClaims?.metadata as {role: string})?.role;
  
// //   for (const { matcher, allowedRoles } of matchers) {
// //     if (matcher(req) && !allowedRoles.includes(role!)) {
// //       return NextResponse.redirect(new URL(`/${role}`, req.url));
// //     }
// //   } 

// // })

// // // export default clerkMiddleware((auth, req) => {
// // //   const { sessionClaims } = auth();

// // //   const role = (sessionClaims?.metadata as { role?: string })?.role;

// // //   for (const { matcher, allowedRoles } of matchers) {
// // //     if (matcher(req) && !allowedRoles.includes(role!)) {
// // //       return NextResponse.redirect(new URL(`/${role}`, req.url));
// // //     }
// // //   }
// // // });

// // export const config = {
// //   matcher: [
// //     // Skip Next.js internals and all static files, unless found in search params
// //     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// //     // Always run for API routes
// //     "/(api|trpc)(.*)",
// //   ],
// // };


// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";
// // import { verifyAccessToken } from "@/lib/crypto";

// // const ROLE_PROTECTED: Record<string, string[]> = {
// //   "/api/admin": ["ADMIN"],
// //   "/api/teacher": ["TEACHER", "ADMIN"],
// //   "/api/parent": ["PARENT", "ADMIN"],
// //   "/api/student": ["STUDENT", "ADMIN"],
// // };

// // export function middleware(req: NextRequest) {
// //   const path = req.nextUrl.pathname;

// //   const requiredRoles = Object.entries(ROLE_PROTECTED).find(([prefix]) =>
// //     path.startsWith(prefix)
// //   )?.[1];

// //   if (!requiredRoles) return NextResponse.next();

// //   const auth = req.headers.get("authorization");
// //   const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
// //   if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// //   const payload = verifyAccessToken(token, process.env.JWT_ACCESS_SECRET!);
// //   if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// //   if (!requiredRoles.includes(payload.role)) {
// //     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
// //   }

// //   return NextResponse.next();
// // }

// // export const config = {
// //   matcher: [
// //     "/dashboard/:path*", "/api/dashboard/:path*",
// //     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// //     "/(api|trpc)(.*)",
// //   ],
// // };





// // // middleware.ts
// // import type { NextRequest } from "next/server";
// // import jwt from "jsonwebtoken";

// // // Utility: check if request path matches a protected route
// // function isProtectedRoute(pathname: string) {
// //   return Object.keys(routeAccessMap).some((route) => pathname.startsWith(route));
// // }

// // export function middleware(req: NextRequest) {
// //   const { pathname } = req.nextUrl;

// //   // 1. Skip Next.js internals/static files
// //   if (pathname.startsWith("/_next") || pathname.match(/\.(.*)$/)) {
// //     return NextResponse.next();
// //   }

// //   // 2. Only protect routes defined in routeAccessMap
// //   if (!isProtectedRoute(pathname)) {
// //     return NextResponse.next();
// //   }
  
// //   // 3. Read accessToken from cookies or Authorization header
// //   const token =
// //     req.cookies.get("accessToken")?.value ||
// //     req.headers.get("authorization")?.replace("Bearer ", "");

// //   if (!token) {
// //     return NextResponse.redirect(new URL("/login", req.url));
// //   }

// //   try {
// //     // 4. Verify JWT
// //     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
// //       userId: string;
// //       role: string;
// //       exp: number;
// //     };

// //     const allowedRoles = Object.entries(routeAccessMap).find(([route]) =>
// //       pathname.startsWith(route)
// //     )?.[1];

// //     // 5. Enforce role access
// //     if (allowedRoles && !allowedRoles.includes(decoded.role)) {
// //       return NextResponse.redirect(new URL(`/${decoded.role}`, req.url));
// //     }

// //     // ✅ Token valid and role allowed
// //     return NextResponse.next();
// //   } catch (err) {
// //     // 6. If token expired → redirect to refresh flow
// //     return NextResponse.redirect(new URL("/auth/refresh", req.url));
// //   }
// // }

// // export const config = {
// //   matcher: [
// //     // Skip Next.js internals and all static files, unless found in search params
// //     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
// //     // Always run for API routes
// //     "/(api|trpc)(.*)",
// //   ],
// // };





// function matchRoute(pathname: string) {
//   return Object.entries(routeAccessMap).find(([route]) =>
//     pathname.startsWith(route)
//   );
// }

// export function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Skip Next.js internals and static assets
//   if (pathname.startsWith("/_next") || pathname.match(/\.(.*)$/)) {
//     return NextResponse.next();
//   }

//   // Only protect routes defined in routeAccessMap
//   const matched = matchRoute(pathname);
//   if (!matched) {
//     return NextResponse.next();
//   }

//   // Get token from cookie or header
//   const token =
//     req.cookies.get("accessToken")?.value ||
//     req.headers.get("authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     // Verify JWT
//     const decoded = verifyAccessToken(token, process.env.JWT_SECRET!) as {
//       userId: string;
//       role: string;
//     };

//     const [, allowedRoles] = matched;

//     // Role enforcement
//     if (!allowedRoles.includes(decoded.role)) {
//       return NextResponse.redirect(new URL(`/${decoded.role}`, req.url));
//     }

//     // ✅ Access granted
//     return NextResponse.next();
//   } catch (err) {
//     // Token invalid or expired → redirect to refresh
//     return NextResponse.redirect(new URL("/auth/refresh", req.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/dashboard/:path*", "/api/dashboard/:path*",
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };
