import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["cyrillic", "latin"],
  weight: ["700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "Покорми котика",
    description: "Очень простая игра для самых маленьких — без рекламы и проигрыша.",
    openGraph: {
      title: "Покорми котика",
      description: "Нажми на угощение — и котик сам его съест.",
      images: [{ url: imageUrl, width: 1536, height: 1024, alt: "Рыжий котик и три угощения" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Покорми котика",
      description: "Очень простая игра без рекламы и проигрыша.",
      images: [imageUrl],
    },
  };
}

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
      <body className={nunito.variable}>{children}</body>
    </html>
  );
}
