'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { ImWhatsapp } from "react-icons/im";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-muted-foreground">
              SamruddhikaBags offers premium quality bags for every occasion. We pride ourselves
              on craftsmanship and customer satisfaction.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-primary">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <p>
                  no.290 2<sup>nd</sup> Step, Thambuttegama
                </p>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                +94 72 414 9720
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                contact@samruddhikabags.lk
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61570478726983&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/invites/contact/?igsh=bk9389up9wv5&utm_content=wib86xq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://wa.me/94724149720"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <ImWhatsapp className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Pramod Vishmitha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;