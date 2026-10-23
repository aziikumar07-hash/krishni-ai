import Nav from '../../components/Nav.jsx'
import Footer from '../../components/Footer.jsx'
import SkipLink from '../../components/SkipLink.jsx'
import LegalPage from '../../components/LegalPage.jsx'
import { terms } from '../../lib/legal.js'

export const metadata = {
  title: 'Terms of Service',
  description:
    'The terms governing use of the Krishni AI website, its informational outputs, and its forms.',
  alternates: { canonical: '/terms' },
}

export default function TermsRoute() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <LegalPage doc={terms} />
      </main>
      <Footer />
    </>
  )
}
