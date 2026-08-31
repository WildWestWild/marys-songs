import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mary’s Songs",
  description:
    "Пять дизайн-концепций музыкального сайта, который полностью меняется вместе с песней.",
  icons: {
    icon: "/marys-songs/favicon.svg?v=2",
    shortcut: "/marys-songs/favicon.svg?v=2",
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
