
import SmoothScroller from "@/animation/SmoothScrolling";
import "./globals.css";
import Navbar from "../components/navbar";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("../components/footer"));
import { AuthProvider } from "../context/AuthContext";
import { SubComponentCotextProvider } from "@/context/SubComponentsContext";
import { AnimationProvider } from "../context/AnimationContext";
import { Toaster } from "sonner";
import AuthForms from "@/components/AuthForm";
import localFont from "next/font/local";
import Join from "./about/components/join";

const satoshi = localFont({
  src: '../../public/fonts/Satoshi-Regular.woff2',
  variable: '--font-satoshi',
  display: 'swap',
  weight: '100 900',
  preload: true,
});


const bedon = localFont({
  src: '../../public/fonts/BodoniFLF-Bold.woff',
  variable: '--font-bedon',
  display: 'swap',
  weight: '100 900',
  preload: true,
})

const kiona = localFont({
  src: '../../public/fonts/Kiona Regular.woff',
  variable: '--font-kiona',
  display: 'swap',
  weight: '100 900',
  preload: true,
})



export const viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: "yes",
  viewportFit: "cover",
  themeColor: "var(--background-color)",
}

export function generateMetadata() {
  return {
    title: "Almuse",
    description: "Almuse is a creative agency in Dubai, specializing in wellness and career coaching for young influencers and entrepreneurs. We offer a range of services to help you achieve your goals.",
    url: "https://almuse.com",
    openGraph: {
      type: "website",
      title: "Almuse",
      description: "Almuse is a creative agency in Dubai, specializing in wellness and career coaching for young influencers and entrepreneurs. We offer a range of services to help you achieve your goals.",
      images: "https://almuse/images/landing.jpg",
      url: "https://almuse.com",
      site_name: "Almuse",
    },
    twitter: {
      title: "Almuse",
      description: "Almuse is a creative agency in Dubai, specializing in wellness and career coaching for young influencers and entrepreneurs. We offer a range of services to help you achieve your goals.",
      images: "https://almuse/images/landing.jpg",
      cardType: 'summary_large_image',
    },

    keywords: [
      "Global",
      "Dubai",
      "Global Dubai",
      "wellness",
      "career coaching",
      "wellness coaching",
      "career coaching",
      "wellness coaching Dubai",
      "career coaching Dubai",
      "wellness coaching UAE",
      "career coaching UAE",
      "wellness coaching Middle East",
      "career coaching Middle East",
      "wellness coaching influencers",
      "career coaching influencers",
      "wellness coaching entrepreneurs",
      "career coaching entrepreneurs",
      "wellness coaching young influencers",
      "career coaching young influencers",
      "wellness coaching young entrepreneurs",
      "career coaching young entrepreneurs",
      "wellness coaching wellness brands",
    ],
  }

}

export default function RootLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${satoshi.variable} ${bedon.variable} ${kiona.variable}`}>
      <body className="App" >
        <AuthProvider>
          <SubComponentCotextProvider>
            <AnimationProvider>
              <Navbar />
              <SmoothScroller />
              {children}
              <Toaster />
              <AuthForms />
              <Join />
              <Footer />
            </AnimationProvider>
          </SubComponentCotextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
