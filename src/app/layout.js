import { Poppins, Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import AuthProvider from "./components/AuthProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "EfdiApp — Simpan Kenangan Bersama",
  description: "Platform penyimpanan momen dan kenangan bersama geng kamu. Upload foto dan video, simpan selamanya.",
  keywords: "foto, video, album, grup, kenangan, penyimpanan, efdiapp",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${nunito.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-nunito, 'Nunito', sans-serif)" }}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-20 md:pb-0">
            {children}
          </main>
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
