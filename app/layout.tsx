import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DDC | Центр цифрового развития",
  description: "Цифровые решения для финансовой стабильности государства.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
