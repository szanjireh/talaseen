import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Header } from '@/components/header';
import { AnnouncementBar } from '@/components/announcement-bar';

const vazir = Vazirmatn({
  variable: '--font-sans',
  subsets: ['arabic'],
});

export const metadata: Metadata = {
  title: 'طلاسین - بازار طلا و جواهر',
  description: 'بازار چند فروشنده‌ای طلا و جواهر',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.variable} antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white">
            <Header />
            <AnnouncementBar />

            <main>{children}</main>

            <footer className="relative py-16 bg-charcoal-gradient text-white overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl"></div>
              </div>
              <div className="container mx-auto px-4 relative z-10">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                  {/* Brand Section */}
                  <div className="text-center md:text-right">
                    <h3 className="text-3xl font-bold text-gold-gradient mb-2">طلاسین</h3>
                    <p className="text-amber-200/80 mb-4">بازار هوشمند طلا و جواهر</p>
                    <div className="flex justify-center md:justify-start gap-4">
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 transition-colors"
                      >
                        <span className="text-lg">📷</span>
                      </a>
                      <a
                        href="https://telegram.me"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 transition-colors"
                      >
                        <span className="text-lg">✈️</span>
                      </a>
                      <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 transition-colors"
                      >
                        <span className="text-lg">🎵</span>
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-600 hover:bg-amber-500 transition-colors"
                      >
                        <span className="text-lg">👍</span>
                      </a>
                    </div>
                  </div>

                  {/* Links Section 1 */}
                  <div className="text-center md:text-right">
                    <h4 className="text-lg font-semibold text-amber-300 mb-4">منو اصلی</h4>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="/"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          صفحه اول
                        </a>
                      </li>
                      <li>
                        <a
                          href="/products"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          محصولات
                        </a>
                      </li>
                      <li>
                        <a
                          href="/search"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          جستجو
                        </a>
                      </li>
                      <li>
                        <a
                          href="/blog"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          بلاگ
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Links Section 2 */}
                  <div className="text-center md:text-right">
                    <h4 className="text-lg font-semibold text-amber-300 mb-4">اطلاعات</h4>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="/about-us"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          درباره ما
                        </a>
                      </li>
                      <li>
                        <a
                          href="/contact"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          تماس با ما
                        </a>
                      </li>
                      <li>
                        <a
                          href="/privacy"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          حریم خصوصی
                        </a>
                      </li>
                      <li>
                        <a
                          href="/regulations"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          شرایط و ضوابط
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Contact Section */}
                  <div className="text-center md:text-right">
                    <h4 className="text-lg font-semibold text-amber-300 mb-4">تماس</h4>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="mailto:talagoldseen@gmail.com"
                          className="text-amber-200 hover:text-amber-400 transition-colors"
                        >
                          ایمیل
                        </a>
                      </li>
                      <li>
                        <p className="text-amber-200">تلفن: ۰۹۱۴۵۵۰۵۱۳۸</p>
                      </li>
                      <li>
                        <p className="text-amber-200">خوی، آذربایجان غربی</p>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-amber-500/20 pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Copyright Left */}
                    <div className="text-center md:text-left">
                      <p className="text-amber-200/60 text-xs">© ۲۰۲۶ طلاسین</p>
                      <p className="text-amber-200/50 text-xs">تمامی حقوق محفوظ است</p>
                    </div>

                    {/* Developer Credit Center */}
                    <div className="text-center border-t md:border-t-0 md:border-l md:border-r border-amber-500/10 py-4 md:py-0 md:px-6">
                      <p className="text-amber-200/70 text-xs mb-2 font-semibold">طراحی و توسعه</p>
                      <p className="text-amber-300 text-xs font-bold">سجاد زنجیره</p>
                    </div>

                    {/* Contact Info Right */}
                    <div className="text-center md:text-right">
                      <div className="flex flex-col md:flex-col gap-2 text-xs">
                        <a
                          href="mailto:s.zanjireh@gmail.com"
                          className="text-amber-300 hover:text-amber-200 transition-colors flex items-center justify-center md:justify-end gap-1"
                        >
                          <span>📧</span>
                          <span>s.zanjireh@gmail.com</span>
                        </a>
                        <a
                          href="tel:+989141608334"
                          className="text-amber-300 hover:text-amber-200 transition-colors flex items-center justify-center md:justify-end gap-1"
                        >
                          <span>📱</span>
                          <span>09141608334</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
