import { redirect } from 'next/navigation'

export default function Page() {
  redirect(encodeURI('/blog/پاسخ-به-پرسش-ها'))
}
