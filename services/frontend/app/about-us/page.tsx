import React from 'react';

export const metadata = {
  title: 'درباره ما - طلافروشی زنجیره',
  description: 'درباره طلافروشی زنجیره در خوی - تجربه، کیفیت و اصالت در طلا و جواهر.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">درباره طلافروشی زنجیره</h1>
          <p className="text-lg text-amber-100">
            تاریخی غنی از اعتماد، کیفیت و تعهد به بهترین خدمات
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed text-justify">
            طلافروشی زنجیره با مدیریت حجت زنجیره از پیشگامان فروش طلا و جواهر در منطقه خوی است. ما
            به کیفیت، اصالت و رضایت مشتریان متعهد هستیم و تلاش می‌کنیم بهترین محصولات و خدمات را
            ارائه دهیم.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-lg border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-amber-900 mb-3">کیفیت بی‌نظیر</h3>
            <p className="text-gray-700">
              تمامی محصولات ما تحت نظارت دقیق و با استاندارد‌های بین‌المللی انتخاب و معاملات
              می‌شوند.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-amber-900 mb-3">اصالت تضمینی</h3>
            <p className="text-gray-700">
              هر محصول با گواهی اصالت و مستندات کامل تحویل داده شده و اعتبار کامل دارد.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-amber-900 mb-3">خدمات پس‌فروش</h3>
            <p className="text-gray-700">
              تیم حرفه‌ای ما آماده ارائه مشاوره و خدمات مرتبط در هر زمان است.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg p-10 mb-12 border border-amber-200">
          <h2 className="text-3xl font-bold text-amber-900 mb-6">تجربه و تخصص</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            سال‌ها تجربه در صنعت طلا و جواهرات باعث شده تا مجموعه ما به عنوان مرجع قابل اعتماد برای
            خریداران و علاقه‌مندان شناخته شود. ما نه تنها فروش انجام نمی‌دهیم بلکه مشاوری جامع و
            آموزشی برای مشتریان خود فراهم می‌آوریم.
          </p>
          <p className="text-gray-700 leading-relaxed">
            هر کدام از کارکنان ما آموزش‌دیده و متخصص بوده و می‌توانند شما را در انتخاب بهترین گزینه
            یاری رسانند.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-amber-900 mb-8">اصول و ارزش‌های ما</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">تعهد به بهترین</h3>
                <p className="text-gray-700">
                  ما متعهد هستیم که تنها بهترین محصولات و خدمات را به مشتریان عرضه کنیم.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">💰</div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">قیمت عادلانه</h3>
                <p className="text-gray-700">
                  ارائه محصولات باکیفیت با قیمت منطقی و رقابتی در بازار.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">👨‍👩‍👧</div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">روابط انسانی</h3>
                <p className="text-gray-700">
                  برقراری روابط اعتماد و دوستانه با تمام مشتریان و شرکاء.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🌟</div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">رضایت مشتری</h3>
                <p className="text-gray-700">
                  رضایت شما اولویت اول ما و نیاز مثبت هر مراجع‌کننده بسیار مهم است.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">آماده برای خدمت شما</h2>
          <p className="text-lg mb-6 text-amber-100">
            برای مشاوره و خرید محصولات باکیفیت با ما تماس بگیرید
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-amber-900 font-bold rounded-full hover:bg-amber-50 transition-colors"
          >
            تماس با ما
          </a>
        </section>
      </div>
    </div>
  );
}
