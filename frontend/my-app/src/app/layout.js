import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header"; // Import header

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Capstone Job Tracker App",
  description: "CS467 Capstone Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <Header />
      <div style={{ height: '80px' }} /> {/* height of your header */}
        {children}
      </body>
    </html>
  );
}
