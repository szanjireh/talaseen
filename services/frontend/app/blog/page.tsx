import React from 'react';

export const metadata = {
  title: 'بلاگ - طلاسین',
  description: 'مقالات و راهنماهای مرتبط با طلا، نگهداری، خرید آنلاین و نکات طلایی.',
};

const posts = [
  {
    title: 'نکات کلیدی خرید طلا',
    slug: 'tips-buying-gold',
    desc: 'نکات مهم برای خرید هوشمندانه طلا.',
  },
  {
    title: 'چگونه ارزش طلا را حفظ کنیم',
    slug: 'preserve-gold-value',
    desc: 'نگهداری و سرمایه‌گذاری برای حفظ ارزش.',
  },
  {
    title: 'فروش آنلاین طلا: راهنمای کامل',
    slug: 'sell-gold-online',
    desc: 'ملاحظات امنیتی و لجستیک فروش آنلاین.',
  },
  {
    title: 'راهنمای انتخاب حلقه نامزدی',
    slug: 'ring-selection-guide',
    desc: 'نکات انتخاب حلقه مناسب.',
  },
  {
    title: 'مراقبت از جواهرات و نگهداری',
    slug: 'jewelry-care',
    desc: 'روش‌های مراقبت و نگهداری جواهرات.',
  },
  {
    title: 'سرمایه‌گذاری در طلا: نکات اولیه',
    slug: 'invest-in-gold',
    desc: 'راهنمای ابتدایی سرمایه‌گذاری در طلا.',
  },
  {
    title: 'روش‌های تشخیص طلای اصل',
    slug: 'identify-real-gold',
    desc: 'روش‌های تشخیص طلای اصل از بدل.',
  },
  {
    title: 'ترندهای طلا و جواهر در سال',
    slug: 'trends-of-year',
    desc: 'نگاهی به ترندها و سبک‌های محبوب.',
  },
  {
    title: 'نحوه خواندن اطلاعات عیار و فاکتور',
    slug: 'reading-gold-info',
    desc: 'آموزش خواندن فاکتور و اطلاعات عیار.',
  },
  {
    title: 'راهنمای خرید هدیه طلا',
    slug: 'gift-guide',
    desc: 'پیشنهاد هدیه برای مناسبت‌ها و بودجه‌ها.',
  },
  {
    title: 'آموزش تمیزکاری طلا در خانه',
    slug: 'cleaning-gold',
    desc: 'روش‌های ایمن تمیزکاری طلا.',
  },
  { title: 'پرسش‌های متداول مشتریان', slug: 'faq', desc: 'پاسخ به سوالات رایج مشتریان.' },
  {
    title: 'نکات قیمت‌گذاری و مقایسه قیمت',
    slug: 'pricing-tips',
    desc: 'عوامل تاثیرگذار بر قیمت طلا و جواهر.',
  },
];

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-white">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight">
              بلاگ طلاسین
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 mb-8 leading-relaxed">
              دانشنامه جامع طلا و جواهرات
            </p>
            <p className="text-lg text-amber-200/80 max-w-2xl mx-auto">
              مقالات تخصصی، راهنماهای عملی و نکات کاربردی درباره خرید هوشمند، نگهداری صحیح و
              سرمایه‌گذاری موفق در طلا و جواهرات
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 bg-amber-50/50 border-b border-amber-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">محتوای پیشنهادی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.slice(0, 3).map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 hover:border-amber-400 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-6 relative z-10">
                  <div className="mb-3 inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                    📌 پیشنهادی
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{post.desc}</p>
                  <span className="text-amber-600 font-semibold flex items-center gap-2">
                    <span>مطالعه بیشتر</span>
                    <span className="group-hover:translate-x-1 transition-transform">←</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">تمام مقالات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 hover:border-amber-400 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-6 relative z-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {post.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-600 font-semibold text-sm">خواندن مقاله</span>
                    <span className="text-amber-400 group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-white border-t border-amber-100">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">سوالی درباره طلا دارید؟</h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            تیم تخصصی ما آماده پاسخگویی به تمام سوالات شما است.
          </p>
          <a
            href="/contact"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
          >
            تماس با ما
          </a>
        </div>
      </section>
    </div>
  );
}
