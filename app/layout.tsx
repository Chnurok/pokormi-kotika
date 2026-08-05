import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.GITHUB_ACTIONS === "true"
  ? "https://chnurok.github.io/pokormi-kotika/"
  : "https://pokormi-kotika-malysh.smusevmikhail.chatgpt.site/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Мои зверята",
  description: "Добрый симулятор питомцев для самых маленьких — покорми котика и лошадку или уложи их спать.",
  manifest: `${siteUrl}manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Мои зверята",
  },
  icons: {
    icon: [{ url: `${siteUrl}icon-192.png`, type: "image/png", sizes: "192x192" }],
    apple: [{ url: `${siteUrl}icon-192.png`, type: "image/png", sizes: "192x192" }],
  },
  openGraph: {
    title: "Мои зверята",
    description: "Покорми Рыжика и Звёздочку или уложи их спать.",
    url: siteUrl,
    images: [{
      url: `${siteUrl}og.png`,
      width: 1536,
      height: 1024,
      alt: "Рыжий котик и маленькая лошадка на солнечном лугу",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Мои зверята",
    description: "Добрый симулятор питомцев без рекламы и проигрыша.",
    images: [`${siteUrl}og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#bcecff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
