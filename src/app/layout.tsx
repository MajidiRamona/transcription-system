import type { Metadata } from "next";
import { SessionProvider } from "./components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNHCR Transcription System",
  description: "AI-powered transcription processing and validation system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
