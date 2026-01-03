import React from 'react'
import Nav from '../../shared/Nav'

export const metadata = {
  title: 'آموزش تمیزکاری طلا در خانه - طلافروشی زنجیره',
  description: 'روش‌های ساده و ایمن تمیزکاری طلا با وسایل خانگی.'
}

export default function Post() {
  return (
    <main style={{padding:24}}>
      <Nav />
      <article>
        <h1>آموزش تمیزکاری طلا در خانه</h1>
        <p>روش‌های ملایم برای تمیز کردن طلا بدون آسیب رساندن به سنگ‌ها و آبکاری.</p>
      </article>
    </main>
  )
}
