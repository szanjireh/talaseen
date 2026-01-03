import React from 'react'
import Nav from '../shared/Nav'

export const metadata = {
  title: 'قوانین و مقررات - طلافروشی زنجیره',
  description: 'قوانین و مقررات استفاده از وب‌سایت و خدمات طلافروشی زنجیره.'
}

export default function RegulationsPage() {
  return (
    <main style={{padding:24}}>
      <Nav />
      <h1>قوانین و مقررات</h1>
      <p>
        استفاده از وب‌سایت به معنای پذیرش قوانین و مقررات ماست. سفارش‌ها پس از تایید از طرف مدیریت
        ارسال خواهند شد. شرایط بازگشت کالا طبق قوانین فروشگاه اجرا می‌شود.
      </p>
      <p>برای جزئیات بیشتر با پشتیبانی تماس بگیرید.</p>
    </main>
  )
}
