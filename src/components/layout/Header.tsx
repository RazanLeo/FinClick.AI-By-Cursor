import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  UserIcon,
  GlobeAltIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  PhoneIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  language?: 'ar' | 'en';
  setLanguage?: (lng: 'ar' | 'en') => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const current = (language || (i18n.language as 'ar' | 'en'));
    const newLang: 'ar' | 'en' = current === 'ar' ? 'en' : 'ar';
    if (setLanguage) setLanguage(newLang);
    i18n.changeLanguage(newLang);
    document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const navItems = [
    { name: t('nav.home'), href: '/', icon: HomeIcon },
    { name: t('nav.dashboard'), href: '/dashboard', icon: ChartBarIcon },
    { name: t('nav.company'), href: '/about', icon: BuildingOfficeIcon },
    { name: t('nav.analysisTypes'), href: '/analysis-types', icon: SparklesIcon },
    { name: t('nav.features'), href: '/features', icon: SparklesIcon },
    { name: t('nav.pricing'), href: '/pricing', icon: CurrencyDollarIcon },
    { name: t('nav.howTo'), href: '/how-to', icon: ChartBarIcon },
    { name: t('nav.contact'), href: '/contact', icon: PhoneIcon },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-effect shadow-gold' : 'bg-background/95'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-16 h-16"
              >
                <Image
                  src="/logo.png"
                  alt="FinClick.AI"
                  fill
                  className="object-contain filter drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  priority
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gradient">FinClick.AI</span>
                <span className="text-xs text-primary/70">
                  {t('slogan')}
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="input-gold w-full pl-10 rtl:pl-4 rtl:pr-10"
                />
                <MagnifyingGlassIcon className="absolute left-3 rtl:right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/50" />
              </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              {/* Language Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                aria-label="Toggle Language"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <GlobeAltIcon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">
                    {(language || i18n.language) === 'ar' ? 'EN' : 'AR'}
                  </span>
                  {(language || i18n.language) === 'ar' ? (
                    <Image src="/flags/us.svg" alt="English" width={20} height={15} />
                  ) : (
                    <Image src="/flags/sa.svg" alt="العربية" width={20} height={15} />
                  )}
                </div>
              </motion.button>

              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors relative"
                  aria-label="Notifications"
                >
                  <BellIcon className="w-6 h-6 text-primary" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full animate-pulse"></span>
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 rtl:left-0 mt-2 w-80 glass-effect rounded-lg shadow-gold p-4"
                    >
                      <h3 className="text-primary font-bold mb-3">{t('notifications.title')}</h3>
                      <div className="space-y-2">
                        <div className="p-2 rounded hover:bg-primary/10 cursor-pointer">
                          <p className="text-sm text-primary">{t('notifications.new_analysis')}</p>
                          <p className="text-xs text-primary/50">2 {t('notifications.minutes_ago')}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Account */}
              {user ? (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <span className="text-sm text-primary">{user.email}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={signOut}
                    className="btn-gold text-sm"
                  >
                    {t('auth.signOut')}
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <Link href="/auth/signin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-primary hover:text-primary-light transition-colors"
                    >
                      {t('auth.signIn')}
                    </motion.button>
                  </Link>
                  <Link href="/auth/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-gold"
                    >
                      {t('auth.signUp')}
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6 text-primary" />
                ) : (
                  <Bars3Icon className="w-6 h-6 text-primary" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block border-t border-primary/20">
            <ul className="flex items-center justify-center space-x-8 rtl:space-x-reverse py-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-all duration-300 ${
                        router.pathname === item.href
                          ? 'bg-primary/20 text-primary'
                          : 'text-primary/70 hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-primary/20 overflow-hidden"
            >
              <ul className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-all duration-300 ${
                          router.pathname === item.href
                            ? 'bg-primary/20 text-primary'
                            : 'text-primary/70 hover:text-primary hover:bg-primary/10'
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </motion.div>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Live Market Ticker */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-background/90 border-b border-primary/20">
        <div className="overflow-hidden">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="flex items-center space-x-8 rtl:space-x-reverse py-2 whitespace-nowrap"
          >
            {[
              { name: 'TASI', value: '11,456.23', change: '+1.23%', color: 'text-success' },
              { name: 'NASDAQ', value: '15,234.56', change: '+0.56%', color: 'text-success' },
              { name: 'S&P 500', value: '4,567.89', change: '-0.34%', color: 'text-danger' },
              { name: 'DOW JONES', value: '35,678.90', change: '+0.78%', color: 'text-success' },
              { name: 'FTSE 100', value: '7,890.12', change: '-0.12%', color: 'text-danger' },
              { name: 'DAX', value: '16,789.34', change: '+0.45%', color: 'text-success' },
              { name: 'NIKKEI', value: '32,456.78', change: '+0.89%', color: 'text-success' },
              { name: 'SSE', value: '3,456.78', change: '-0.23%', color: 'text-danger' },
            ].map((market, index) => (
              <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse px-4">
                <span className="font-bold text-primary">{market.name}</span>
                <span className="text-primary/70">{market.value}</span>
                <span className={`font-medium ${market.color}`}>{market.change}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll to Top/Bottom Buttons */}
      <div className="fixed bottom-8 right-8 rtl:left-8 z-40 flex flex-col space-y-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-3 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors"
          aria-label="Scroll to Top"
        >
          <ChevronUpIcon className="w-5 h-5 text-primary" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="p-3 bg-primary/20 rounded-full hover:bg-primary/30 transition-colors"
          aria-label="Scroll to Bottom"
        >
          <ChevronDownIcon className="w-5 h-5 text-primary" />
        </motion.button>
      </div>
    </>
  );
};

export default Header;
