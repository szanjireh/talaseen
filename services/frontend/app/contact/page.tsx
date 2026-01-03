import React from 'react'
import Nav from '../shared/Nav'

export const metadata = {
  title: 'تماس با ما - طلافروشی زنجیره',
  description: 'اطلاعات تماس، آدرس و راه‌های ارتباطی طلافروشی زنجیره در خوی.'
}

export default function ContactPage() {
  return (
    <main style={{padding:24}}>
      <Nav />
      <h1>تماس با ما</h1>

      <p><strong>نام مالک:</strong> حجت زنجیره</p>
      <p><strong>تلفن:</strong> +989141607551</p>
      <p><strong>آدرس:</strong> آذربایجان غربی، خوی، چارس، طلافروشی زنجیره</p>

      <section style={{marginTop:20}}>
        <h2>شبکه‌های اجتماعی</h2>
        <ul>
          <li><a href="#">اینستاگرام</a></li>
          <li><a href="#">تلگرام</a></li>
          <li><a href="#">تیک‌تاک</a></li>
          <li><a href="#">فیسبوک</a></li>
        </ul>
        <p style={{fontSize:12,color:'#666'}}>لطفاً لینک‌های بالا را با آدرس‌های واقعی پروفایل‌های خود جایگزین کنید.</p>
      </section>
    </main>
  )
}
