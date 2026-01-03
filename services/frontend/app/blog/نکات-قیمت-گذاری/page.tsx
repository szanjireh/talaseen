import React from 'react'
import Nav from '../../shared/Nav'

export const metadata = {
  title: 'نکات قیمت‌گذاری و مقایسه قیمت - طلافروشی زنجیره',
  description: 'راهنمای مقایسه قیمت و عوامل تاثیرگذار بر قیمت طلا و جواهر.'
}

export default function Post() {
  return (
    <main style={{padding:24}}>
      <Nav />
      <article>
        <h1>نکات قیمت‌گذاری و مقایسه قیمت</h1>
        <p>عوامل مختلف مانند عیار، وزن، اجرت ساخت و بازار روی قیمت نهایی تاثیرگذارند.</p>
      </article>
    </main>
  )
}
