import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'بلاگ - طلاسین',
  description: 'مقالات و راهنماهای مرتبط با طلا، نگهداری، خرید آنلاین و نکات طلایی.'
}

const posts = [
  { title: 'نکات کلیدی خرید طلا', slug: 'نکات-خرید-طلا', eng: 'tips-buying-gold', desc: 'نکات مهم برای خرید هوشمندانه طلا.' },
  { title: 'چگونه ارزش طلا را حفظ کنیم', slug: 'افزایش-ارزش-طلا', eng: 'preserve-gold-value', desc: 'نگهداری و سرمایه‌گذاری برای حفظ ارزش.' },
  { title: 'فروش آنلاین طلا: راهنمای کامل', slug: 'فروش-آنلاین-طلا', eng: 'sell-gold-online', desc: 'ملاحظات امنیتی و لجستیک فروش آنلاین.' },
  { title: 'راهنمای انتخاب حلقه نامزدی', slug: 'راهنمای-انتخاب-حلقه', eng: 'ring-selection-guide', desc: 'نکات انتخاب حلقه مناسب.' },
  { title: 'مراقبت از جواهرات و نگهداری', slug: 'مراقبت-از-جواهرات', eng: 'jewelry-care', desc: 'روش‌های مراقبت و نگهداری جواهرات.' },
  { title: 'سرمایه‌گذاری در طلا: نکات اولیه', slug: 'سرمایه-گذاری-در-طلا', eng: 'invest-in-gold', desc: 'راهنمای ابتدایی سرمایه‌گذاری در طلا.' },
  { title: 'روش‌های تشخیص طلای اصل', slug: 'تشخیص-طلا-اصل', eng: 'identify-real-gold', desc: 'روش‌های تشخیص طلای اصل از بدل.' },
  { title: 'ترندهای طلا و جواهر در سال', slug: 'ترندهای-سال', eng: 'trends-of-year', desc: 'نگاهی به ترندها و سبک‌های محبوب.' },
  { title: 'نحوه خواندن اطلاعات عیار و فاکتور', slug: 'نحوه-اطلاعات-عیار', eng: 'reading-gold-info', desc: 'آموزش خواندن فاکتور و اطلاعات عیار.' },
  { title: 'راهنمای خرید هدیه طلا', slug: 'راهنمای-خرید-هدیه', eng: 'gift-guide', desc: 'پیشنهاد هدیه برای مناسبت‌ها و بودجه‌ها.' },
  { title: 'آموزش تمیزکاری طلا در خانه', slug: 'آموزش-تمیزکاری', eng: 'cleaning-gold', desc: 'روش‌های ایمن تمیزکاری طلا.' },
  { title: 'پرسش‌های متداول مشتریان', slug: 'پاسخ-به-پرسش-ها', eng: 'faq', desc: 'پاسخ به سوالات رایج مشتریان.' },
  { title: 'نکات قیمت‌گذاری و مقایسه قیمت', slug: 'نکات-قیمت-گذاری', eng: 'pricing-tips', desc: 'عوامل تاثیرگذار بر قیمت طلا و جواهر.' },
]

export default function BlogIndex() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">بلاگ طلاسین</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">مقالات تخصصی، راهنماها و نکات کاربردی درباره خرید، نگهداری و سرمایه‌گذاری در طلا و جواهر.</p>
        <div className="mt-6">
          <Button onClick={() => window.location.href = '/'} className="mr-3">بازگشت به صفحه اصلی</Button>
          <Button onClick={() => window.location.href = '/contact'} variant="outline">تماس با ما</Button>
        </div>
      </section>

      {/* Posts Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.slug} className="p-6 hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{post.desc}</p>
              <div className="flex gap-2">
                <a href={`/blog/${post.slug}`} className="text-amber-600 font-semibold">مشاهده مطلب</a>
                <a href={`/blog/${post.eng}`} className="text-gray-500 text-xs">(ascii link)</a>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
