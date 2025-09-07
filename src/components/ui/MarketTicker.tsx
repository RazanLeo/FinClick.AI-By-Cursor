import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MarketTickerProps {
  language: 'ar' | 'en';
}

const MarketTicker: React.FC<MarketTickerProps> = ({ language }) => {
  const t = (ar: string, en: string) => (language === 'ar' ? ar : en);
  const [currentIndex, setCurrentIndex] = useState(0);

  const marketData = [
    {
      symbol: 'TASI',
      name: t('مؤشر تاسي', 'TASI Index'),
      value: '12,456.78',
      change: '+2.34%',
      positive: true
    },
    {
      symbol: 'USD/SAR',
      name: t('الدولار الأمريكي', 'US Dollar'),
      value: '3.75',
      change: '+0.12%',
      positive: true
    },
    {
      symbol: 'BTC',
      name: t('البيتكوين', 'Bitcoin'),
      value: '$45,678',
      change: '-1.23%',
      positive: false
    },
    {
      symbol: 'GOLD',
      name: t('الذهب', 'Gold'),
      value: '$2,045.50',
      change: '+0.87%',
      positive: true
    },
    {
      symbol: 'OIL',
      name: t('النفط', 'Oil'),
      value: '$78.45',
      change: '-0.45%',
      positive: false
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % marketData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/90 border-b border-gold/20 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gold/70 text-sm font-semibold">
              {t('الأسواق المالية', 'Financial Markets')}
            </span>
          </div>
          
          <div className="flex-1 mx-8">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center space-x-4">
                <span className="text-gold font-bold text-sm">
                  {marketData[currentIndex].symbol}
                </span>
                <span className="text-gold/80 text-sm">
                  {marketData[currentIndex].name}
                </span>
                <span className="text-gold font-semibold">
                  {marketData[currentIndex].value}
                </span>
                <span className={`text-sm font-semibold ${
                  marketData[currentIndex].positive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {marketData[currentIndex].change}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gold/70 text-sm">
              {t('محدث الآن', 'Updated Now')}
            </span>
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
