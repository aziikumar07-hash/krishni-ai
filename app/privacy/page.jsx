import Nav from '../../components/Nav.jsx'
import Footer from '../../components/Footer.jsx'
import SkipLink from '../../components/SkipLink.jsx'
import LegalPage from '../../components/LegalPage.jsx'
import { privacy } from '../../lib/legal.js'

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How Krishni AI collects, uses, stores, and shares information from the website, forms, and WhatsApp.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyRoute() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <LegalPage doc={privacy} />
      </main>
      <Footer />
    </>
  )
}
