// Server layout exists only to carry per-route metadata — page.jsx is a client
// component and cannot export it.
export const metadata = {
  title: 'Try Krishni AI — ask a farming question',
  description:
    'Ask Krishni AI a crop, pest, or irrigation question in Hindi or English and get an answer in seconds.',
  alternates: { canonical: '/try' },
}

export default function TryLayout({ children }) {
  return children
}
