export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    images: {
      [color: string]: string[];
    };
    variations: {
      color: string[];
      size: string[];
    };
    brand: string;
  }
  
  export const product: Product = {
    id: "1",
    name: "FILA Sport Backpack",
    brand: "FILA",
    price: 49.99,
    description: "The FILA Sport Backpack combines style with functionality. Features a spacious main compartment, convenient front zipper pockets, and durable construction. The embroidered FILA branding and clean design make it perfect for everyday use, from school to sports activities. Made with high-quality water-resistant material and finished with premium gold-tone zippers.",
    images: {
      Red: [
        "/images/products/columbiaL_main.png",
      ],
      Black: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240116-WA0020.jpg-jrdlB8TgeBHiT4V25JmI1wnQYLBWXB.jpeg",
      ],
      Blue: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20240116-WA0021.jpg-UDIiLmOzJnoVNgXk84NSIaoBTZouAF.jpeg",
      ],
    },
    variations: {
      color: ["Red", "Black", "Blue"],
      size: ["One Size"],
    },
  };
  
  export const relatedProducts: Product[] = [
    {
      id: "2",
      name: "FILA Classic Duffel",
      brand: "FILA",
      price: 39.99,
      description: "Classic sports duffel bag with FILA branding",
      images: {
        Black: ["/placeholder.svg?height=200&width=200"],
      },
      variations: {
        color: ["Black"],
        size: ["One Size"],
      },
    },
    {
      id: "3",
      name: "FILA Mini Backpack",
      brand: "FILA",
      price: 34.99,
      description: "Compact everyday backpack with FILA logo",
      images: {
        Black: ["/placeholder.svg?height=200&width=200"],
      },
      variations: {
        color: ["Black"],
        size: ["One Size"],
      },
    },
  ];
  
  