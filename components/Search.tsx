'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Product } from '@/lib/types/product';
import { products } from '@/lib/data/products';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Search({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchResults.length > 0) {
      router.push(`/products/${searchResults[0].id}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-x-0 top-full bg-background border-b shadow-lg">
      <div className="container mx-auto p-4">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              className="w-full pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button 
            variant="default"
            size="icon"
            onClick={handleSearch}
            disabled={searchResults.length === 0}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {searchResults.length > 0 && (
          <Card className="mt-2">
            <CardContent className="p-2">
              <div className="max-h-[60vh] overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.brand} • LKR {product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {searchQuery && searchResults.length === 0 && (
          <Card className="mt-2">
            <CardContent className="p-4 text-center text-muted-foreground">
              No products found for &quot;{searchQuery}&quot;
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 