import type { Metadata } from "next";
import PWARegistrar from "@/components/PWARegistrar";

export const metadata: Metadata = {
  title: "Conjita's Dashboard",
  description: "Dashboard de productividad personal con IA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Conjita",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Syne:wght@700;800&display=swap" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"/>
        <meta name="theme-color" content="#a855f7"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="apple-mobile-web-app-title" content="Conjita"/>
        <link rel="apple-touch-icon" href="/bunny-icon.svg"/>
        <link rel="icon" href="/bunny-icon.svg" type="image/svg+xml"/>
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0d0a1a" }}>
        <PWARegistrar />
        {children}
      </body>
    </html>
  );
}
