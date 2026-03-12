import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "../components/whatsapp/WhatsAppButton";

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
  description: "Professional counselling and psychological support for individuals, children, and families in Hyderabad.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jakarta.variable}`}>
        {children}
        <WhatsAppButton />
        <body className={`${cormorant.variable} ${jakarta.variable}`} suppressHydrationWarning></body>
      </body>
    </html>
  );
}