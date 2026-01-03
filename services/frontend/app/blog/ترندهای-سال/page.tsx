import React from 'react'
import Nav from '../../shared/Nav'

export const metadata = {
  title: 'ترندهای طلا و جواهر در سال - طلافروشی زنجیره',
  description: 'نگاهی به ترندها و سبک‌های محبوب در طراحی جواهرات هر سال.'
}

export default function Post() {
  return (
    <main style={{padding:24}}>
      <Nav />
      <article>
        <h1>ترندهای طلا و جواهر در سال</h1>
        <p>آشنایی با سبک‌های محبوب و آنچه مشتریان امسال بیشتر دنبال آن هستند.</p>
      </article>
    </main>
  )
}
