import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';

const vazir = Vazirmatn({
  variable: "--font-sans",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "طلاسین - بازار طلا و جواهر",
  description: "بازار چند فروشنده‌ای طلا و جواهر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazir.variable} antialiased`}
      >
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white">
            <Header />
            <AnnouncementBar />

            <main>
              {children}
            </main>

            <footer className="relative py-16 bg-charcoal-gradient text-white overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
              </div>
              <div className="container mx-auto px-4 text-center relative z-10">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gold-gradient mb-2">طلاسین</h3>
                  <p className="text-amber-200/80">بازار هوشمند طلا و جواهر</p>
                </div>
                <div className="flex justify-center gap-6 mb-8">
                  <a href="/products" className="text-amber-200 hover:text-amber-400 transition-colors">محصولات</a>
                  <a href="/search" className="text-amber-200 hover:text-amber-400 transition-colors">جستجو</a>
                  <a href="/dashboard" className="text-amber-200 hover:text-amber-400 transition-colors">پنل کاربری</a>
                </div>
                <div className="border-t border-amber-500/20 pt-6">
                  <p className="text-amber-200/70 mb-2">ایمیل: Talagoldseen@gmail.com</p>
                  <p className="text-amber-200/50 text-sm">© ۲۰۲۶ طلاسین - تمامی حقوق محفوظ است</p>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

