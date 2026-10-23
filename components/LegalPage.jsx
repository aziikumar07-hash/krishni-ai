import Link from 'next/link'
import { site } from '../lib/site.js'
import { legalUpdated } from '../lib/legal.js'

/**
 * Renders a legal document from lib/legal.js.
 *
 * A server component on purpose: this content is static English (see the note in
 * lib/legal.js about not machine-translating legal text), so it needs neither the
 * language context nor client JS.
 */
export default function LegalPage({ doc }) {
  return (
    <section className="section">
      <div className="container container-narrow legal-doc">
        <h1>{doc.title}</h1>
        <p className="legal-updated">Last updated: {legalUpdated}</p>
        <p>{doc.intro}</p>

        {doc.sections.map((section) => (
          <div key={section.heading}>
            <h2>{section.heading}</h2>

            {section.body?.map((para) => (
              <p key={para}>{para}</p>
            ))}

            {section.link && (
              <p>
                <Link href={section.link.href}>{section.link.label}</Link>
              </p>
            )}

            {/* Contact details come from lib/site.js so they cannot drift out of
                sync with the footer and the form the way the legacy copies did. */}
            {section.contact && (
              <p>
                {section.contact} <a href={`mailto:${site.email}`}>{site.email}</a> or call{' '}
                <a href={`tel:${site.phone}`}>{site.phoneDisplay}</a>.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
