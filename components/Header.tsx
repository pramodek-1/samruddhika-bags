'use client';

import React from 'react';
import Marquee from 'react-fast-marquee';

const Header = () => {
  return (
    <div className="text-xs bg-red-600 text-white py-1">
      <Marquee speed={50} gradient={false}>
      <span className="mr-8">The Lowest Price In The SriLanka. A+ Grade Products & A+ Grade Service. More Than 20+ Years Expereince 🛍️</span>    
      </Marquee>
    </div>
  );
};

export default Header;