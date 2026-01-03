import React from 'react';

export const metadata = {
  title: 'قوانین و مقررات - طلافروشی زنجیره',
  description: 'قوانین و مقررات استفاده از وب‌سایت و خدمات طلافروشی زنجیره.',
};

export default function RegulationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">قوانین و شرایط استفاده</h1>
          <p className="text-lg text-amber-100">شرایط کامل و شفاف برای تمام خدمات ما</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-12 bg-white p-8 rounded-lg border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">🔔 توجه مهم</h2>
          <p className="text-gray-700 leading-relaxed">
            با استفاده از وب‌سایت و خدمات طلافروشی زنجیره، شما تمامی قوانین و شرایط زیر را
            می‌پذیرید. لطفاً این متن را با دقت مطالعه کنید. در صورت عدم موافقت با هر بخش، از استفاده
            از سرویس‌های ما خودداری کنید.
          </p>
        </section>

        {/* Terms Sections */}
        <section className="space-y-8 mb-12">
          {/* 1. Product Information */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۱. اطلاعات محصولات</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">📊 مشخصات دقیق</p>
                <p>
                  تمام محصولات طلا و جواهرات با اطلاعات دقیق عیار، وزن و شناسه تفصیلی معرفی می‌شوند.
                  ما مسئول دقت اطلاعات فنی محصولات هستیم.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">✅ تصاویر و توضیحات</p>
                <p>
                  تصاویر محصولات تا حد ممکن شبیه محصول واقعی است. رنگ‌ها ممکن است کمی متفاوت باشند
                  بسته به تنظیمات دستگاه شما.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">🔍 بررسی محصول</p>
                <p>
                  شما حق دارید محصول دریافتی را به دقت بررسی کنید. در صورت عدم تطابق با توضیحات، از
                  حق برگشت استفاده کنید.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Ordering */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۲. فرآیند سفارش‌دهی</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">📝 تأیید سفارش</p>
                <p>
                  هر سفارش پس از پرداخت باید توسط تیم مدیریت تأیید شود. در صورت عدم تأیید (مثلاً
                  تموجود نبودن کالا)، مبلغ به صورت کامل برگردانده خواهد شد.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">⏱️ مهلت تأیید</p>
                <p>
                  معمولاً سفارشات در مدت ۲۴ تا ۴۸ ساعت تأیید و برای ارسال آماده می‌شوند. در روزهای
                  تعطیل ممکن است تأخیر بیفتد.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">📞 اطلاع‌رسانی</p>
                <p>پس از تأیید سفارش، ما از طریق تلفن یا پیام شما را مطلع می‌کنیم.</p>
              </div>
            </div>
          </div>

          {/* 3. Payments */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۳. پرداخت و قیمت‌گذاری</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">💰 روش‌های پرداخت</p>
                <p>
                  ما روش‌های متعددی برای پرداخت قبول می‌کنیم: درگاه بانکی، انتقال مستقیم، و پرداخت
                  در محل تحویل.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">📈 تغییر قیمت</p>
                <p>
                  قیمت‌های طلا بر اساس نرخ روز بازار تعیین می‌شوند. قیمت نهایی پس از تأیید سفارش
                  ثابت می‌شود.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">🧾 صورت‌حساب</p>
                <p>
                  برای هر خرید صورت‌حساب رسمی صادر می‌شود. صورت‌حساب‌ها برای مقاصد مالیاتی و
                  حسابداری نگهداری می‌شوند.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Delivery */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۴. ارسال و تحویل</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">🚚 روش تحویل</p>
                <p>
                  ارسال به دو صورت انجام می‌شود: تحویل مستقیم در محل فروشگاه یا ارسال از طریق پیک و
                  پست معتبر.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">📮 هزینه ارسال</p>
                <p>
                  هزینه ارسال در شهر خوی رایگان است. برای سایر نقاط، هزینه به صورت جداگانه محاسبه
                  می‌شود.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">⏰ مدت زمان</p>
                <p>
                  معمولاً تحویل در مدت ۳ تا ۵ روز کاری انجام می‌شود. اقلام خاص ممکن است زمان بیشتری
                  نیاز داشته باشند.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">📸 بسته‌بندی</p>
                <p>
                  تمام محصولات در بسته‌های ایمن و حفاظت‌شده ارسال می‌شوند. شما مسئول بررسی محتویات
                  در لحظه تحویل هستید.
                </p>
              </div>
            </div>
          </div>

          {/* 5. Returns & Refunds */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 p-8 rounded-lg border-l-4 border-amber-700">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۵. بازگشت و بازپرداخت</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">⏳ مهلت بازگشت</p>
                <p>
                  شما تا ۷ روز بعد از تحویل محصول می‌توانید آن را برگردانید (در صورت عدم استفاده).
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">🔄 شرایط بازگشت</p>
                <ul className="space-y-2 ml-4">
                  <li>• محصول باید در وضعیت اصلی و بدون تغییر باشد</li>
                  <li>• بسته‌بندی اصلی باید سالم باشد</li>
                  <li>• گواهی اصالت و مستندات باید همراه باشد</li>
                  <li>• محصول نباید استفاده شده باشد</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">💵 فرآیند بازپرداخت</p>
                <p>بعد از بررسی محصول برگشتی، مبلغ در مدت ۵ تا ۷ روز کاری برگردانده می‌شود.</p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">❌ موارد غیر قابل برگشت</p>
                <ul className="space-y-2 ml-4">
                  <li>• محصولات سفارشی و اختصاصی</li>
                  <li>• اقلامی که خراب یا تغییر شده باشند</li>
                  <li>• محصولاتی که پس از مهلت ۷ روز برگردانده شوند</li>
                  <li>• محصولاتی که علائم استفاده داشته باشند</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 6. Warranty */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۶. گارانتی</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">✔️ گارانتی اصالت</p>
                <p>
                  ما گارانتی می‌دهیم که تمام محصولات اصل و با عیار اعلام‌شده هستند. در صورت عدم صحت،
                  تعویض یا بازپرداخت کامل انجام می‌شود.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">🔧 خدمات اصلاح</p>
                <p>ما خدمات اصلاح، تعمیر و تغییرات جزیی را برای محصولات ارائه می‌دهیم.</p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">⏱️ دوره گارانتی</p>
                <p>
                  گارانتی اصالت برای مدت ۲ سال از تاریخ خرید معتبر است. گارانتی در صورت سوء‌استفاده
                  یا تعدیل محصول باطل می‌شود.
                </p>
              </div>
            </div>
          </div>

          {/* 7. Prohibited Transactions */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۷. معاملات ممنوعه</h3>
            <div className="space-y-4 text-gray-700">
              <p className="mb-4">طبق قوانین جمهوری اسلامی ایران، موارد زیر ممنوع هستند:</p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>معاملات با صندوق‌های ریالی بدون مجوز</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>فروش طلا برای مقاصد تحریم‌شده</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>معاملات غیرقانونی و پولی‌شویی</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>فروش محصولات جعلی یا تقلبی</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 8. Legal Compliance */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۸. انطباق با قوانین ایران</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">⚖️ قانون تجارت</p>
                <p>تمام فعالیات ما با قانون تجارت و مقررات سازمان‌های دولتی ایران منطبق است.</p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">📊 مسئولیت‌های مالیاتی</p>
                <p>ما مسئول گزارش‌دهی تمام معاملات به سازمان مالیات ایران هستیم.</p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">📋 نگهداری مدارک</p>
                <p>تمام سندها، رسیدها و مستندات برای حداقل ۷ سال نگهداری می‌شود.</p>
              </div>
            </div>
          </div>

          {/* 9. User Responsibilities */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۹. مسئولیت‌های کاربر</h3>
            <div className="space-y-4 text-gray-700">
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>صحت اطلاعات شخصی و آدرس تحویل</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>عدم انجام معاملات مشکوک یا غیرقانونی</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>بررسی محصول در لحظه تحویل</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-600">•</span>
                  <span>نگهداری مناسب محصولات خریداری‌شده</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 10. Contact & Support */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۱۰. پشتیبانی و تماس</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              برای هرگونه سوال یا شکایت درباره قوانین و شرایط، لطفاً از طریق موارد زیر با ما تماس
              بگیرید:
            </p>
            <div className="bg-amber-50 p-6 rounded border border-amber-200 space-y-3">
              <p className="text-gray-700">
                <strong className="text-amber-900">📞 تلفن:</strong> +989141607551
              </p>
              <p className="text-gray-700">
                <strong className="text-amber-900">📍 آدرس:</strong> آذربایجان غربی، خوی، چارس،
                طلافروشی زنجیره
              </p>
              <p className="text-gray-700">
                <strong className="text-amber-900">⏰ ساعات کاری:</strong> شنبه تا پنج‌شنبه، ۹ صبح
                تا ۸ شب
              </p>
            </div>
          </div>
        </section>

        {/* Last Update */}
        <section className="bg-amber-50 p-6 rounded-lg border border-amber-200 mb-12">
          <p className="text-sm text-gray-600">
            <strong>آخرین به‌روزرسانی:</strong> ۱۴۰۲/۱۰/۱۲
          </p>
          <p className="text-sm text-gray-600 mt-2">
            این قوانین ممکن است تغییر کند. تغییرات اساسی از طریق وب‌سایت اطلاع‌رسانی خواهد شد.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">درک کامل شرایط؟</h2>
          <p className="text-lg mb-6 text-amber-100">
            اگر سوالی دارید یا نیاز به توضیح بیشتر دارید، تیم ما آماده کمک است
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-amber-900 font-bold rounded-full hover:bg-amber-50 transition-colors"
          >
            تماس با پشتیبانی
          </a>
        </section>
      </div>
    </div>
  );
}
