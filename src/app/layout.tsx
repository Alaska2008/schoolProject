import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider  } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });
// const dmSans = DM_Sans({
//   subsets: ["latin"],
// })

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
        {/* <body className={`${dmSans.className}`}> */}
        <body className={inter.className}>
          {children}
          <ToastContainer position="bottom-right" theme="dark"/>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
