/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'finclick.ai', 'supabase.co'],
    unoptimized: true,
  },
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: false,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    FMP_API_KEY: process.env.FMP_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    PAYTABS_SERVER_KEY: process.env.PAYTABS_SERVER_KEY,
    PAYTABS_CLIENT_KEY: process.env.PAYTABS_CLIENT_KEY,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    JWT_SECRET: process.env.JWT_SECRET,
    ADMIN_EMAIL: 'Razan@FinClick.AI',
    ADMIN_PASSWORD: 'RazanFinClickAI@056300',
    GUEST_EMAIL: 'Guest@FinClick.AI',
    GUEST_PASSWORD: 'GuestFinClickAI@123321',
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
}

module.exports = nextConfig
