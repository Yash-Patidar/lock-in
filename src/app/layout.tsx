import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lock-In - Ultimate Productivity & Focus App | Pomodoro Timer, Task Manager & Heatmap",
  description: "Boost your productivity with Lock-In - the ultimate focus app featuring Pomodoro timer, task management, progress heatmap, and beautiful themes. Get more done with less distraction.",
  keywords: "pomodoro timer, productivity app, focus app, task manager, time tracking, productivity heatmap, work timer, concentration app, study timer, deep work",
  authors: [{ name: "Yash Patidar", url: "https://twitter.com/yash__patidar_" }],
  creator: "Yash Patidar",
  publisher: "PicxStudio",
  robots: "index, follow",
  category: "Productivity",
  metadataBase: new URL('https://picxstudio.com/'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://picxstudio.com/',
    siteName: 'Lock-In - Productivity App',
    title: 'Lock-In - Ultimate Productivity & Focus App | Pomodoro Timer & Task Manager',
    description: 'Boost your productivity with Lock-In - the ultimate focus app featuring Pomodoro timer, task management, progress heatmap, and beautiful themes. Get more done with less distraction.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Lock-In - Ultimate Productivity & Focus App',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yash__patidar_',
    creator: '@yash__patidar_',
    title: 'Lock-In - Ultimate Productivity & Focus App',
    description: 'Boost your productivity with Lock-In - the ultimate focus app featuring Pomodoro timer, task management, progress heatmap, and beautiful themes.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Lock-In",
              "description": "Ultimate productivity & focus app featuring Pomodoro timer, task management, progress heatmap, and beautiful themes. Get more done with less distraction.",
              "url": "https://picxstudio.com/",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Person",
                "name": "Yash Patidar",
                "url": "https://twitter.com/yash__patidar_"
              },
              "publisher": {
                "@type": "Organization",
                "name": "PicxStudio",
                "url": "https://picxstudio.com/"
              },
              "featureList": [
                "Pomodoro Timer",
                "Task Management",
                "Progress Heatmap",
                "Multiple Themes",
                "Keyboard Shortcuts",
                "Focus Sessions",
                "Productivity Analytics"
              ],
              "screenshot": "https://picxstudio.com/og.png"
            })
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/og.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lock-In" />
        <meta name="application-name" content="Lock-In" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="google-site-verification" content="your-google-verification-code" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
