import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider  } from "@clerk/nextjs";

// const inter = Inter({ subsets: ["latin"] });
const dmSans = DM_Sans({
  subsets: ["latin"],
})
export const metadata: Metadata = {
  title: "School Management Software",
  description: "School Management Software to Improve Management of School Activities in Basic School.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${dmSans.className}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
    
  );
}
