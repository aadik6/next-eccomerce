import "bootstrap/dist/css/bootstrap.min.css";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BootstrapClient from "./bootstrapClient";
import Navbar from "@/components/navbar/navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ecoommerce Store",
  description: "Learn Next.js with a simple ecommerce store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-light`}>
        <GoogleOAuthProvider
          clientId={
            "493362069656-9kl0fv6ih3d6h7p2dqtl2dku3327uh5f.apps.googleusercontent.com"
          }
        >
          <BootstrapClient />
          <Navbar />
          {/* <ExampleNavbar /> */}
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
