'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Facebook, Instagram } from 'lucide-react';
import { ImWhatsapp } from "react-icons/im";

const categories = [
  { name: 'School Bags', href: '/category/school-bags' },
  { name: 'Class Bags', href: '/category/class-bags' },
  { name: 'Hand Bags', href: '/category/hand-bags' },
  { name: 'Pre School Bags', href: '/category/pre-school-bags' },
  { name: 'Travelling Bags', href: '/category/travelling-bags' },
  { name: 'Pocket Bags', href: '/category/pocket-bags' },
];

const Sidebar = () => {
  const { theme } = useTheme();
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 p-4">
        {theme === 'dark' ? (
          <img src="/images/logo.png" width="50" height="50" alt="Dark Mode Logo" />
        ) : (
          <img src="/images/logo_l.png" width="50" height="50" alt="Light Mode Logo" />
        )}
        <main className="flex flex-col items-center justify-center gap-0.1">
          <span className="text-sm font-bold font-titles">SAMRUDDHIKA BAGS MANUFACTURER</span>
          <span className="text-xs text-gray-500 font-medium mt-0.1">#1 Bags Manufacturer in SriLanka</span>
        </main>
      </div>

      <Separator />

      <nav className="flex-1 px-2 py-4">
        <div className="space-y-1">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>

          <Link href="/products/all">
            <Button variant="ghost" className="w-full justify-start">
              Products
            </Button>
          </Link>

          <Accordion type="single" collapsible>
            <AccordionItem value="categories">
              <AccordionTrigger className="px-4">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Link key={category.href} href={category.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start pl-8"
                      >
                        {category.name}
                      </Button>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link href="/cart">
            <Button variant="ghost" className="w-full justify-start">
              Cart
            </Button>
          </Link>

          <Link href="/contact">
            <Button variant="ghost" className="w-full justify-start">
              Contact
            </Button>
          </Link>

          <Link href="/about">
            <Button variant="ghost" className="w-full justify-start">
              About
            </Button>
          </Link>
        </div>
      </nav>

      <Separator />

      <div className="p-4">
        <div className="flex justify-center space-x-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://instagram.com" target="_blank">
              <Instagram className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://twitter.com" target="_blank">
            <ImWhatsapp className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;