import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";
import { ToastContainer } from "react-toastify";
export const metadata: Metadata = {
  title: "Lora Muzik ♫",
  description: "We are the next generation of music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <Providers>
          <ToastContainer position="top-right" autoClose={3000} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
