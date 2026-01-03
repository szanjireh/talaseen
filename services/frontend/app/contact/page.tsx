import React from 'react'

export const metadata = {
  title: 'تماس با ما - طلافروشی زنجیره',
  description: 'اطلاعات تماس، آدرس و راه‌های ارتباطی طلافروشی زنجیره در خوی.'
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-amber-900 mb-6">تماس با ما</h1>

      <p className="text-gray-700 mb-2"><strong className="text-amber-900">نام مالک:</strong> حجت زنجیره</p>
      <p className="text-gray-700 mb-2"><strong className="text-amber-900">تلفن:</strong> +989141607551</p>
      <p className="text-gray-700 mb-6"><strong className="text-amber-900">آدرس:</strong> آذربایجان غربی، خوی، چارس، طلافروشی زنجیره</p>

      <section className="mt-8 pt-8 border-t">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">شبکه‌های اجتماعی</h2>
        <div className="flex gap-4 flex-wrap">
          <a href="#" className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg text-amber-900 hover:shadow-lg hover:border-amber-400 transition-all">
            <span className="text-2xl">📷</span>
            <span className="font-semibold">اینستاگرام</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg text-amber-900 hover:shadow-lg hover:border-amber-400 transition-all">
            <span className="text-2xl">✈️</span>
            <span className="font-semibold">تلگرام</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg text-amber-900 hover:shadow-lg hover:border-amber-400 transition-all">
            <span className="text-2xl">🎵</span>
            <span className="font-semibold">تیک‌تاک</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg text-amber-900 hover:shadow-lg hover:border-amber-400 transition-all">
            <span className="text-2xl">👍</span>
            <span className="font-semibold">فیسبوک</span>
          </a>
        </div>
      </section>
    </div>
  )
}
