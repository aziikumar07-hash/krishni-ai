// Metadata carrier — page.jsx is a client component. noindex because this is a
// post-submission confirmation with no standalone search value.
export const metadata = {
  title: 'Thank you',
  description: 'Your details have been received. We will get back to you within 48 hours.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/thank-you' },
}

export default function ThankYouLayout({ children }) {
  return children
}
