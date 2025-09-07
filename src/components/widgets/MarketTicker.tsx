import React from 'react';

const MarketTicker: React.FC = () => {
  const markets = [
    { name: 'TASI', value: '11,456.23', change: '+1.23%', color: 'text-green-400' },
    { name: 'NASDAQ', value: '15,234.56', change: '+0.56%', color: 'text-green-400' },
    { name: 'S&P 500', value: '4,567.89', change: '-0.34%', color: 'text-red-400' },
    { name: 'DOW JONES', value: '35,678.90', change: '+0.78%', color: 'text-green-400' },
    { name: 'FTSE 100', value: '7,890.12', change: '-0.12%', color: 'text-red-400' },
    { name: 'DAX', value: '16,789.34', change: '+0.45%', color: 'text-green-400' },
  ];

  return (
    <div className="bg-black/90 border-b border-gold/20 py-2 overflow-hidden">
      <div className="flex animate-pulse">
        {markets.map((market, index) => (
          <div key={index} className="flex items-center space-x-4 px-6 whitespace-nowrap">
            <span className="font-bold text-gold">{market.name}</span>
            <span className="text-gold/70">{market.value}</span>
            <span className={`font-medium ${market.color}`}>{market.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;