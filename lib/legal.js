/**
 * Legal page content, ported verbatim from legacy/privacy-policy.html and
 * legacy/terms-of-service.html.
 *
 * Deliberately NOT run through the i18n dictionary and NOT rewritten. Two reasons:
 *
 *  1. Machine-translating liability and consent language creates a second,
 *     divergent legal text with no reviewer. Legal copy needs a human.
 *  2. Rewriting it is not a porting decision.
 *
 * FLAG FOR THE OWNER — this policy is now out of date, because the site does
 * more than the legacy mock did. Needs a lawyer's review before launch:
 *   - Section 1/3 do not disclose that chat messages are sent to Google
 *     (Gemini API) for processing. app/api/chat + lib/gemini.js do exactly that.
 *   - Nothing covers the WhatsApp channel (app/api/whatsapp), where inbound
 *     message content also reaches Google.
 *   - There is no DPDP Act 2023 language (consent, notice, grievance officer,
 *     data-principal rights) even though the lead form now records consent.
 *   - Section 8 mentions cookies and analytics; the site currently sets none.
 *   - "Children under 18" is stricter than the DPDP threshold, which is fine,
 *     but should be an intentional choice rather than an inherited default.
 */

export const legalUpdated = 'June 4, 2026'

export const privacy = {
  title: 'Privacy Policy',
  intro:
    'Krishni AI (“we”, “our”, “us”) values your privacy. This Privacy Policy explains how we collect, use, store, and share information when you visit our website, submit a form, contact us, or use our services.',
  sections: [
    {
      heading: '1. Information we collect',
      body: [
        'We may collect personal information that you voluntarily provide, including your name, phone number, state, crop details, email address, and any message you submit through our forms.',
        'We may also collect non-personal information such as browser type, device information, pages visited, and basic website usage analytics.',
      ],
    },
    {
      heading: '2. How we use information',
      body: [
        'We use collected information to respond to your inquiries, provide early access updates, improve our services, understand user interest, communicate product information, and maintain website security.',
      ],
    },
    {
      heading: '3. Form submissions',
      body: [
        'Our website may use third-party form handling services such as Formspree to process contact or early-access submissions. Information you submit through a form may be stored and forwarded to our email inbox for follow-up.',
      ],
    },
    {
      heading: '4. Sharing of information',
      body: [
        'We do not sell your personal information. We may share information with service providers who help us operate our website, process submissions, or support communications, subject to appropriate safeguards.',
        'We may also disclose information if required by law, legal process, or to protect our legal rights and security.',
      ],
    },
    {
      heading: '5. Data retention',
      body: [
        'We retain personal information for as long as reasonably necessary to fulfill the purpose for which it was collected, comply with legal obligations, resolve disputes, or enforce agreements.',
      ],
    },
    {
      heading: '6. Security',
      body: [
        'We take reasonable steps to protect information from unauthorized access, misuse, loss, or disclosure. However, no website or internet transmission is completely secure.',
      ],
    },
    {
      heading: '7. Your choices',
      body: [
        'You may contact us to request access, correction, or deletion of personal information that you have submitted, subject to legal and operational requirements.',
      ],
    },
    {
      heading: '8. Cookies and analytics',
      body: [
        'We may use cookies or similar technologies to improve user experience, remember preferences, and understand website usage. You can control cookies through your browser settings.',
      ],
    },
    {
      heading: '9. Children’s privacy',
      body: [
        'Our website is not intended for children under 18 without parental or guardian involvement. We do not knowingly collect personal information from children in violation of applicable law.',
      ],
    },
    { heading: '10. Contact us', contact: 'If you have questions about this Privacy Policy or your data, contact us at' },
  ],
}

export const terms = {
  title: 'Terms of Service',
  intro:
    'These Terms of Service (“Terms”) govern your use of the Krishni AI website and any related services, content, forms, and communications provided by Krishni AI (“we”, “our”, “us”). By using our website, you agree to these Terms.',
  sections: [
    {
      heading: '1. Use of the website',
      body: [
        'You may use the website only for lawful purposes. You agree not to misuse the website, interfere with its operation, submit false information, or attempt unauthorized access to any system or data.',
      ],
    },
    {
      heading: '2. Informational nature of services',
      body: [
        'Krishni AI may provide agricultural insights, crop recommendations, alerts, predictions, or other informational outputs. These are provided for general informational purposes and should not be treated as guaranteed results, professional agronomy advice, or a substitute for on-ground verification.',
      ],
    },
    {
      heading: '3. No warranty',
      body: [
        'The website and its content are provided on an “as is” and “as available” basis. We do not guarantee uninterrupted service, absolute accuracy, completeness, suitability, or reliability of website content or recommendations.',
      ],
    },
    {
      heading: '4. Limitation of liability',
      body: [
        'To the maximum extent permitted by law, Krishni AI will not be liable for any indirect, incidental, special, consequential, or business losses arising from use of the website or reliance on its information.',
      ],
    },
    {
      heading: '5. User submissions',
      body: [
        'If you submit information through forms, you confirm that the information is accurate and that you have the right to share it. You remain responsible for the content you submit.',
      ],
    },
    {
      heading: '6. Intellectual property',
      body: [
        'Unless otherwise stated, the website design, branding, text, graphics, and other content belong to Krishni AI or its licensors and may not be copied, reused, or distributed without permission, except as allowed by law.',
      ],
    },
    {
      heading: '7. Third-party services',
      body: [
        'We may use third-party tools or services such as form processors, hosting providers, analytics tools, and communication platforms. Your use of any third-party service may also be subject to that provider’s terms and policies.',
      ],
    },
    {
      // Legacy linked to privacy-policy.html; the route is /privacy now.
      heading: '8. Privacy',
      body: ['Your use of the website is also subject to our Privacy Policy.'],
      link: { href: '/privacy', label: 'Privacy Policy' },
    },
    {
      heading: '9. Changes to these Terms',
      body: [
        'We may update these Terms from time to time. Continued use of the website after updates means you accept the revised Terms.',
      ],
    },
    {
      heading: '10. Governing law',
      body: [
        'These Terms are governed by the laws of India, without regard to conflict of law principles. Any disputes will be subject to the jurisdiction of competent courts in India.',
      ],
    },
    { heading: '11. Contact', contact: 'For questions about these Terms, contact' },
  ],
}
