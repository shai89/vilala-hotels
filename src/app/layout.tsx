import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vilala - צימרים וחופשות בישראל",
  description: "המקום הטוב ביותר למצוא צימרים, וילות ובקתות נופש בישראל. חפשו, השוו והזמינו את החופשה המושלמת שלכם.",
  keywords: ["צימרים", "חופשות", "נופש", "ישראל", "וילות", "בקתות"],
  authors: [{ name: "Vilala Team" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider session={session}>
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  );
}
