'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from './ui/sheet';
import { Menu, Sun, Moon, Search as SearchIcon } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { Badge } from './ui/badge';
import Sidebar from './Sidebar';
import { Search } from './Search';
import { useSession, signOut } from 'next-auth/react';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { data: session } = useSession();

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
              <SearchIcon />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
              <FaShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    variant="destructive"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <RiAccountCircleFill className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                asChild
              >
                <Link href="/auth/signin">
                  <RiAccountCircleFill className="h-6 w-6" />
                </Link>
              </Button>
            )}

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

        <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </nav>
  );
};

export default Navbar;