import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gold/70 mb-4">Page Not Found</h2>
        <p className="text-gold/50 mb-8">The page you are looking for does not exist.</p>
        <Link href="/" className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-300">
          Go Home
        </Link>
      </div>
    </div>
  )
}
