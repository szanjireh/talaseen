import React from 'react'
import Nav from '../../shared/Nav'

export const metadata = {
  title: 'پرسش‌های متداول مشتریان - طلافروشی زنجیره',
  description: 'پاسخ به سوالات رایج مشتریان درباره خرید، گارانتی و ارسال.'
}

export default function Post() {
  return (
    <main style={{padding:24}}>
      <Nav />
      <article>
        <h1>پرسش‌های متداول مشتریان</h1>
        <p>سوالات متداول درباره سفارش، پرداخت، بازگشت کالا و ضمانت پاسخ داده شده‌اند.</p>
      </article>
    </main>
  )
}
