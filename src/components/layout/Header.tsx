'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Menu, X, Globe, User, LogIn } from 'lucide-react'

interface HeaderProps {
  language: 'ar' | 'en'
  onLanguageToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageToggle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const t = (ar: string, en: string) => (language === 'ar' ? ar : en)

  const navigation = [
    { name: t('الرئيسية', 'Home'), href: '/' },
    { name: t('المميزات', 'Features'), href: '#features' },
    { name: t('أنواع التحليل', 'Analysis Types'), href: '#analysis-types' },
    { name: t('الأسعار', 'Pricing'), href: '#pricing' },
    { name: t('اتصل بنا', 'Contact'), href: '#contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="FinClick.AI"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-2xl font-bold text-gold font-playfair">
              FinClick.AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gold/70 hover:text-gold transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Language Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onLanguageToggle}
              className="flex items-center space-x-2 text-gold/70 hover:text-gold transition-colors duration-200"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === 'ar' ? 'EN' : 'عربي'}
              </span>
            </button>
            
            <button className="flex items-center space-x-2 bg-gold text-black px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors duration-200 font-medium">
              <LogIn className="w-4 h-4" />
              <span>{t('تسجيل الدخول', 'Sign In')}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gold/70 hover:text-gold transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gold/20">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gold/70 hover:text-gold transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              <div className="flex items-center justify-between pt-4 border-t border-gold/20">
                <button
                  onClick={onLanguageToggle}
                  className="flex items-center space-x-2 text-gold/70 hover:text-gold transition-colors duration-200"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    {language === 'ar' ? 'EN' : 'عربي'}
                  </span>
                </button>
                
                <button className="flex items-center space-x-2 bg-gold text-black px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors duration-200 font-medium">
                  <LogIn className="w-4 h-4" />
                  <span>{t('تسجيل الدخول', 'Sign In')}</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
