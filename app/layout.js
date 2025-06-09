import 'bootstrap/dist/css/bootstrap.min.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BootstrapClient from './bootstrapClient';
import Navbar from '@/components/navbar/navbar';

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
  description: "Learn Next.js with a simple ecommerce store"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-light`}>
        <BootstrapClient />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
