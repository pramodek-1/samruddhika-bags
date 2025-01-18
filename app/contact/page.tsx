'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ContactPage() {
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Add your Web3Forms access key
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY!);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());

      if (res.success) {
        // Show success message
        await Swal.fire({
          title: "Success!",
          text: "Your message has been sent successfully!",
          icon: "success",
          confirmButtonColor: '#dc2626',
          customClass: {
            confirmButton: 'bg-red-600 hover:bg-red-700'
          }
        });
        // Reset the form
        (event.target as HTMLFormElement).reset();
      } else {
        // Show error message
        await Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: '#dc2626',
          customClass: {
            confirmButton: 'bg-red-600 hover:bg-red-700'
          }
        });
      }
    } catch (error) {
      // Show error message
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: '#dc2626',
        customClass: {
          confirmButton: 'bg-red-600 hover:bg-red-700'
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Input name="name" placeholder="Your Name" required />
              </div>
              <div>
                <Input name="email" type="email" placeholder="Your Email" required />
              </div>
              <div>
                <Input name="subject" placeholder="Subject" required />
              </div>
              <div>
                <Textarea name="message" placeholder="Your Message" className="min-h-[150px]" required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <p className="text-muted-foreground">
                  no.290 2<sup>nd</sup> Step, Thambuttegama
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <p className="text-muted-foreground">+94 72 414 9720</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <p className="text-muted-foreground">contact@samruddhikabags.lk</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}