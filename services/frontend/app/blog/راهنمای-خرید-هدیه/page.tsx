import React from 'react'
import Nav from '../../shared/Nav'

export const metadata = {
  title: 'راهنمای خرید هدیه طلا - طلافروشی زنجیره',
  description: 'نکات انتخاب هدیه طلا برای مناسبت‌ها و راهنمای خرید برای بازه‌های قیمتی مختلف.'
}

export default function Post() {
  return (
    <main style={{padding:24}}>
      <Nav />
      <article>
        <h1>راهنمای خرید هدیه طلا</h1>
        <p>انتخاب هدیه بر اساس سلیقه، مناسبت و بودجه؛ پیشنهاداتی برای هر رده قیمتی.</p>
      </article>
    </main>
  )
}
