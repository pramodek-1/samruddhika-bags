'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { Menu, Sun, Moon, ShoppingBag, Search } from 'lucide-react';
import Sidebar from './Sidebar';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Prevent hydration mismatch by mounting after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>

          <div className="flex-1 text-center">
            <Link href="/" className="flex items-center justify-center gap-2">
              {theme === 'dark' ? (
                <img src="/images/logo.png" width="50" height="50" alt="Dark Mode Logo" />
              ) : (
                <img src="/images/logo_l.png" width="50" height="50" alt="Light Mode Logo" />
              )}
              <main className="flex flex-col items-center justify-center gap-0.1">
              <span className="text-2xl font-bold font-titles">SAMRUDDHIKA BAGS</span>
              <span className="text-xs text-gray-500 font-medium mt-0.1">The Best Place to Buy Bags</span>
              </main>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetTitle>Menu</SheetTitle>
                <Sidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isSearchOpen && (
          <div className="py-2">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full"
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;