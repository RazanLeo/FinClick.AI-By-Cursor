'use client'

import React, { useState, useEffect } from 'react'

const MarketTicker: React.FC = () => {
  const [tickerData, setTickerData] = useState([
    { symbol: 'AAPL', price: 175.43, change: 2.34, changePercent: 1.35 },
    { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85 },
    { symbol: 'MSFT', price: 378.91, change: 4.67, changePercent: 1.25 },
    { symbol: 'TSLA', price: 248.12, change: -3.45, changePercent: -1.37 },
    { symbol: 'AMZN', price: 155.78, change: 1.89, changePercent: 1.23 },
    { symbol: 'META', price: 312.45, change: 5.23, changePercent: 1.70 },
    { symbol: 'NVDA', price: 875.34, change: 12.45, changePercent: 1.44 },
    { symbol: 'NFLX', price: 456.78, change: -2.34, changePercent: -0.51 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => 
        prev.map(item => ({
          ...item,
          price: item.price + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 4,
          changePercent: (Math.random() - 0.5) * 2,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-b border-gold/20 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto">
          <div className="flex items-center space-x-2 text-gold/70 text-sm font-medium whitespace-nowrap">
            <span>Live Market Data</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          
          {tickerData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm whitespace-nowrap">
              <span className="text-gold/90 font-medium">{item.symbol}</span>
              <span className="text-white">${item.price.toFixed(2)}</span>
              <span className={`${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketTicker
