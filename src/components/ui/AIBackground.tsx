'use client'

import React from 'react'

const AIBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-gold/5" />
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl animate-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold/10 rounded-full blur-2xl animate-glow" style={{ animationDelay: '2s' }} />
    </div>
  )
}

export default AIBackground
