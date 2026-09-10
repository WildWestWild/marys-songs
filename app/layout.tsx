import type { Metadata, Viewport } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Мэри",
  description:
    "Пять дизайн-концепций музыкального сайта, который полностью меняется вместе с песней.",
  icons: {
    icon: `${basePath}/favicon.svg?v=2`,
    shortcut: `${basePath}/favicon.svg?v=2`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111111",
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
