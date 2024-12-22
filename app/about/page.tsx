import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">About LuxeBags</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground">
              Founded in 2007, SumruddhikaBags has been dedicated to providing high-quality bags
              that combine style, functionality, and durability. Our passion for
              craftsmanship and attention to detail sets us apart in the industry.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              We strive to offer premium quality bags that meet the diverse needs of our
              customers while maintaining the highest standards of customer service and
              satisfaction.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li>✓ Premium Quality Materials</li>
              <li>✓ Expert Craftsmanship</li>
              <li>✓ Wide Product Range</li>
              <li>✓ Excellent Customer Service</li>
              <li>✓ Fast & Secure Shipping</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}