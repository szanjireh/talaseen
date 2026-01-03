import React from 'react'

export default function Nav() {
  return (
    <nav style={{padding: '12px 0', borderBottom: '1px solid #e5e7eb', marginBottom: 20}}>
      <a href="/" style={{marginRight:16}}>خانه</a>
      <a href="/about-us" style={{marginRight:16}}>درباره ما</a>
      <a href="/blog" style={{marginRight:16}}>بلاگ</a>
      <a href="/contact" style={{marginRight:16}}>تماس با ما</a>
      <a href="/privacy" style={{marginRight:16}}>حریم خصوصی</a>
      <a href="/regulations" style={{marginRight:16}}>قوانین</a>
    </nav>
  )
}
