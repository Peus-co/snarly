import React, { useState, useEffect } from "react";
import GooeyNav from './GooeyNav';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Chat', href: '/chat' },
  { label: 'About', href: '#about' },
  { label: 'Developer', href: 'https://peus-shukla.vercel.app/' },
  { label: 'Pricing', href: '/upgrade' }
];

// Items shown on small screens (About removed to prevent overflow)
const mobileItems = items.filter(i => i.label !== 'About');

export default function Nave({ activeIndex = 0, onGetStarted, showLogo = true, showCta = true }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  const handleCtaClick = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      window.location.href = "/signup"; // Default signup path
    }
  };

  const ctaButton = (
    <button 
      onClick={handleCtaClick}
      className="glass-button cursor-pointer p-1.5 sm:p-2 text-xs sm:text-sm whitespace-nowrap shrink-0"
    >
      Get Started
    </button>
  );

  // Keep activeIndex in sync when item list changes on small screens
  const activeItem = (isMobile ? mobileItems : items)[Math.min(activeIndex, (isMobile ? mobileItems : items).length - 1)];

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 ${showLogo || showCta ? "flex justify-between items-center gap-2" : "flex justify-center"} bg-transparent pointer-events-none px-3 sm:px-6 py-3`}>
      {/* Logo on the left */}
      {showLogo && (
        <a href="/" className="pointer-events-auto flex items-center gap-2 sm:gap-3 overflow-hidden rounded-md transition-colors hover:opacity-80 shrink-0">
          <img
            src="/logo.png"
            alt="Snarly AI Logo"
            className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 object-contain brightness-0 invert"
          />
          <span className="font-bold text-base sm:text-lg text-white whitespace-nowrap hidden sm:inline">Snarly AI</span>
        </a>
      )}

      <div className="pointer-events-auto mt-2 sm:mt-3 min-w-0 flex-1 flex justify-center overflow-hidden">
        <GooeyNav
          items={isMobile ? mobileItems : items}
          activeIndex={activeItem ? (isMobile ? mobileItems : items).indexOf(activeItem) : activeIndex}
          onChange={(index, item) => {
            if (item.href.startsWith('#')) {
              if (window.location.pathname !== '/') {
                window.location.href = '/' + item.href;
              } else {
                const element = document.querySelector(item.href);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }
              return;
            }
            if (window.location.pathname === item.href) return;
            window.location.href = item.href;
          }}
          theme="dark"
          size={isMobile ? "sm" : "md"}
          frame
          particleCount={isMobile ? 8 : 15}
          spread={isMobile ? 36 : 56}
          animationTime={600}
          timeVariance={300}
          gooeyness={0.5}
          wobble={0.5}
          hoverEffect
          style={{ background: 'transparent', backdropFilter: 'blur(10px)' }}
        />
      </div>
      {/* CTA Button on the right */}
      {showCta && (
        <div className="pointer-events-auto shrink-0">
          {ctaButton}
        </div>
      )}
    </div>
  );
}

