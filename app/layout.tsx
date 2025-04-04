import "./globals.css";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Suspense } from "react";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <body>
            {children}
          </body>
        </Suspense>
      </ThemeProvider>
    </html>
  );
}
