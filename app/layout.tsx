import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDMP — Software Dev Marketplace",
  description:
    "Find expert developers. Build amazing software. Escrow-backed payments, integrated QA testing, and real-time collaboration for software development.",
};

const themeInit = `(function(){try{var t=localStorage.getItem("sdmp-theme")||(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
