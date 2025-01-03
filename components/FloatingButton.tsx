'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Facebook, Instagram, Phone, X } from 'lucide-react';
import { ImWhatsapp } from "react-icons/im";
import { FaHeadset } from "react-icons/fa";

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      href: 'https://www.facebook.com/profile.php?id=61570478726983&mibextid=ZbWKwL',
      bg: 'bg-blue-600',
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: 'https://www.instagram.com/invites/contact/?igsh=bk9389up9wv5&utm_content=wib86xq',
      bg: 'bg-pink-600',
    },
    {
      icon: <ImWhatsapp className="h-5 w-5" />,
      href: 'https://wa.me/94724149720',
      bg: 'bg-green-600',
    },
    {
      icon: <Phone className="h-5 w-5" />,
      href: 'tel:+94724149720',
      bg: 'bg-blue-400',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-2">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${link.bg} hover:opacity-90 transition-opacity`}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
        <Button
          size="icon"
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <FaHeadset className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FloatingButton;