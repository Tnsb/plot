import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Public_Sans, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import { Backdrop } from "@/components/backdrop";
import { StoryProgress } from "@/components/story-progress";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

const publicSans = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "plot — doing it for the plot",
  description:
    "Text one sentence, get a whole party — with an AI cohost, one cinematic shot each, and a morning-after everyone opens.",
};

export const viewport: Viewport = {
  themeColor: "#f9f8f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* set theme pre-paint: stored choice wins, else system, else paper */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("plot-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${schibsted.variable} ${publicSans.variable} ${instrument.variable} ${plexMono.variable} antialiased min-h-dvh`}
      >
        <StoryProgress />
        <Backdrop />
        <div className="relative z-10 min-h-dvh">{children}</div>
      </body>
    </html>
  );
}
