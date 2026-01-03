import React from 'react';

export const metadata = {
  title: 'حریم خصوصی - طلافروشی زنجیره',
  description:
    'خط‌مشی حفظ حریم خصوصی طلافروشی زنجیره. اطلاعات مشتریان، حفظ امنیت و پردازش داده‌ها.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">سیاست حفاظت از اطلاعات</h1>
          <p className="text-lg text-amber-100">شفافیت و امنیت اطلاعات شما برای ما اولویت است</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <section className="mb-12 bg-white p-8 rounded-lg border border-amber-100">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">درباره این سیاست</h2>
          <p className="text-gray-700 leading-relaxed">
            طلافروشی زنجیره به حفاظت از حریم خصوصی و اطلاعات شخصی شما متعهد است. این سند جامع شرح
            می‌دهد که چگونه اطلاعات شما جمع‌آوری، استفاده، محافظت و مدیریت می‌شود. ما در تمام
            فعالیات خود از قوانین و مقررات جمهوری اسلامی ایران و استانداردهای بین‌المللی حفاظت از
            داده‌ها پیروی می‌کنیم.
          </p>
        </section>

        {/* Key Principles */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-lg border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-bold text-amber-900 mb-3">محرمانگی</h3>
            <p className="text-gray-700">
              تمام اطلاعات شما محرمانه و ایمن نگهداری می‌شود و تنها برای مقاصد مجاز استفاده می‌گردد.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-bold text-amber-900 mb-3">شفافیت</h3>
            <p className="text-gray-700">
              ما به صورت شفاف درباره نحوه جمع‌آوری و استفاده از اطلاعات شما اطلاع‌رسانی می‌کنیم.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-amber-100 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-lg font-bold text-amber-900 mb-3">انطباق قانونی</h3>
            <p className="text-gray-700">
              تمام فعالیات ما با قوانین ایران و مقررات مربوط به تجارت طلا منطبق است.
            </p>
          </div>
        </section>

        {/* Privacy Policy Sections */}
        <section className="space-y-8 mb-12">
          {/* 1. Collection */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۱. جمع‌آوری اطلاعات</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              ما اطلاعات زیر را جمع‌آوری می‌کنیم:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>
                  <strong>اطلاعات شناسایی:</strong> نام، شماره تماس، آدرس و اطلاعات تماسی
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>
                  <strong>اطلاعات معاملات:</strong> سابقه خرید، محصولات خریداری شده و قیمت‌ها
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>
                  <strong>اطلاعات مالی:</strong> روش‌های پرداخت و صورت‌حساب‌ها (برای مقاصد قانونی)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>
                  <strong>اطلاعات فنی:</strong> درخواست‌های شما، IP و اطلاعات مرورگر
                </span>
              </li>
            </ul>
          </div>

          {/* 2. Usage */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۲. استفاده از اطلاعات</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              اطلاعات شما برای موارد زیر استفاده می‌شود:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>پردازش سفارشات و تحویل محصولات</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>ارائه خدمات پس‌فروش و پشتیبانی</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>انجام الزامات قانونی و مالیاتی طبق قوانین ایران</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>بهبود خدمات و تجربه مشتری</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>ارسال اطلاعات تخفیف‌ها و پیشنهادات (با رضایت شما)</span>
              </li>
            </ul>
          </div>

          {/* 3. Data Protection */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۳. محافظت از داده‌ها</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              ما از اقدامات امنیتی پیشرفته استفاده می‌کنیم:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>رمزگذاری اطلاعات حساس</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>کنترل دسترسی و احراز هویت</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>ذخیره‌سازی ایمن و پشتیبان‌گیری منظم</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>ممنوعیت دسترسی اشخاص ثالث بدون اجازه رسمی</span>
              </li>
            </ul>
          </div>

          {/* 4. Iranian Gold Trading Regulations */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 p-8 rounded-lg border-l-4 border-amber-700">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              ۴. انطباق با مقررات تجارت طلا در ایران
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              طلافروشی زنجیره در تمام فعالیات خود با قوانین زیر انطباق دارد:
            </p>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-bold text-amber-900 mb-2">🏛️ قانون تجارت فلزات گرانبها</p>
                <p>
                  ما به عنوان یک فروشگاه طلا و جواهر از نظارت و مقررات سازمان‌های دولتی ایران پیروی
                  می‌کنیم و تمام معاملات را با شفافیت کامل انجام می‌دهیم.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">💳 الزام‌های مالیاتی</p>
                <p>
                  تمام فروش‌های ما از لحاظ مالیاتی گزارش‌دهی می‌شود و با قوانین سازمان مالیات منطبق
                  است. ما از سیستم‌های حسابداری معتبر استفاده می‌کنیم.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">📊 اطلاعات عیار و وزن</p>
                <p>
                  هر محصول طلا با اطلاعات دقیق عیار، وزن و شناسه‌نامه فروخته می‌شود. این اطلاعات
                  برای مدت معین نگهداری می‌شود.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">✅ گواهی‌های اصالت</p>
                <p>
                  تمام محصولات با گواهی‌های رسمی و اعتبارنامه‌های بین‌المللی تحویل داده می‌شوند که
                  مطابق استاندارد‌های ایران است.
                </p>
              </div>

              <div>
                <p className="font-bold text-amber-900 mb-2">🚫 ممنوعیت‌های قانونی</p>
                <p>
                  ما از ممنوعیت‌های قانونی درباره معاملات طلا اطلاع دارم و از تمام موارد ممنوعه
                  پرهیز می‌کنیم. اطلاعات شما تنها برای مقاصد قانونی استفاده می‌شود.
                </p>
              </div>
            </div>
          </div>

          {/* 5. User Rights */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">۵. حقوق کاربران</h3>
            <p className="text-gray-700 leading-relaxed mb-4">شما حق دارید:</p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>از اطلاعات خود آگاه باشید و درخواست دسترسی کنید</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>اطلاعات نادرست خود را تصحیح کنید</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>حذف اطلاعات خود را درخواست کنید (مگر موارد قانونی)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-600">•</span>
                <span>از دریافت پیام‌های تبلیغی انصراف دهید</span>
              </li>
            </ul>
          </div>

          {/* 6. Contact */}
          <div className="bg-white p-8 rounded-lg border-l-4 border-amber-500">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              ۶. تماس برای مسائل حفاظت از اطلاعات
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              برای هرگونه سوال یا درخواست درباره حریم خصوصی و اطلاعات خود، لطفاً با ما تماس بگیرید:
            </p>
            <div className="bg-amber-50 p-6 rounded border border-amber-200">
              <p className="text-gray-700 mb-2">
                <strong className="text-amber-900">تلفن:</strong> +989141607551
              </p>
              <p className="text-gray-700">
                <strong className="text-amber-900">آدرس:</strong> آذربایجان غربی، خوی، چارس،
                طلافروشی زنجیره
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
            ما ممکن است این سیاست را تغییر دهیم. تغییرات مهم به صورت علنی اطلاع‌رسانی خواهد شد.
          </p>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">سوالی دارید؟</h2>
          <p className="text-lg mb-6 text-amber-100">
            تیم ما آماده پاسخ به تمام سوالات شما درباره حفاظت اطلاعات است
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
