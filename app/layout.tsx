import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "G. Suma Kavitha | Counselling Psychologist – Hyderabad",
  description: "Professional counselling and psychological support for individuals, teens, couples and families in Hyderabad. Book a session online or in-person.",
  keywords: ["counselling psychologist hyderabad", "psychologist hyderabad", "online counselling hyderabad", "therapy hyderabad", "mental health hyderabad"],
  openGraph: {
    title: "G. Suma Kavitha | Counselling Psychologist – Hyderabad",
    description: "Professional psychological support in Hyderabad. Compassionate. Confidential. Life-changing.",
    url: "https://sumakavitha.online",
    siteName: "G. Suma Kavitha",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jakarta.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}