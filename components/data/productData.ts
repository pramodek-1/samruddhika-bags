export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  mainImage: string;
  images: {
    [color: string]: string[];
  };
  variations: {
    color: string[];
    size: string[];
  };
  brand: string;
  outOfStock?: string[];
  image: string;
}

export const product: Product = {
  id: "1",
  name: "COLUMBIA 'L' Back Pack",
  brand: "COLUMBIA",
  price: 2099,
  description: "The FILA Sport Backpack combines style with functionality. Features a spacious main compartment, convenient front zipper pockets, and durable construction. The embroidered FILA branding and clean design make it perfect for everyday use, from school to sports activities. Made with high-quality water-resistant material and finished with premium gold-tone zippers.",
  mainImage: "/images/products/columbiaL_all.jpg",
  images: {
    Red: [
      "/images/products/columbiaL_1.jpg",
      "/images/products/columbiaL_4.jpg",
      "/images/products/columbiaL_7.jpg",
      "/images/products/columbiaL_10.jpg",
      "/images/products/columbiaL_14.jpg",
      "/images/products/columbiaL_17.jpg",
    ],
    Black: [
      "/images/products/columbiaL_3.jpg",
      "/images/products/columbiaL_6.jpg",
      "/images/products/columbiaL_9.jpg",
      "/images/products/columbiaL_13.jpg",
      "/images/products/columbiaL_16.jpg",
      "/images/products/columbiaL_19.jpg",
    ],
    "Dark Blue": [
      "/images/products/columbiaL_2.jpg",
      "/images/products/columbiaL_5.jpg",
      "/images/products/columbiaL_8.jpg",
      "/images/products/columbiaL_11.jpg",
      "/images/products/columbiaL_15.jpg",
      "/images/products/columbiaL_18.jpg",
    ],
    "Light Blue": [
      "/images/products/columbiaL_20.jpg",
      "/images/products/columbiaL_21.jpg",
      "/images/products/columbiaL_22.jpg",
      "/images/products/columbiaL_23.jpg",
      "/images/products/columbiaL_24.jpg",
      "/images/products/columbiaL_25.jpg",
    ],
  },
  variations: {
    color: ["Red", "Black", "Dark Blue", "Light Blue"],
    size: ["One Size"],
  },
  outOfStock: ["Light Blue"],
  image: "/images/products/columbiaL_all.jpg",
};

export const relatedProducts: Product[] = [
  {
    id: "3",
    name: "XG School-Travel BackPack",
    brand: "XG",
    price: 3099,
    description: "Classic sports duffel bag with FILA branding",
    mainImage: "/images/products/XG_main.jpg",
    images: {
      Red: [
        "/images/products/columbiaL_1.jpg",
        "/images/products/columbiaL_4.jpg",
        "/images/products/columbiaL_7.jpg",
        "/images/products/columbiaL_10.jpg",
        "/images/products/columbiaL_14.jpg",
        "/images/products/columbiaL_17.jpg",
      ],
      Black: [
        "/images/products/columbiaL_3.jpg",
        "/images/products/columbiaL_6.jpg",
        "/images/products/columbiaL_9.jpg",
        "/images/products/columbiaL_13.jpg",
        "/images/products/columbiaL_16.jpg",
        "/images/products/columbiaL_19.jpg",
      ],
      "Dark Blue": [
        "/images/products/columbiaL_2.jpg",
        "/images/products/columbiaL_5.jpg",
        "/images/products/columbiaL_8.jpg",
        "/images/products/columbiaL_11.jpg",
        "/images/products/columbiaL_15.jpg",
        "/images/products/columbiaL_18.jpg",
      ],
      "Light Blue": [
        "/images/products/columbiaL_20.jpg",
        "/images/products/columbiaL_21.jpg",
        "/images/products/columbiaL_22.jpg",
        "/images/products/columbiaL_23.jpg",
        "/images/products/columbiaL_24.jpg",
        "/images/products/columbiaL_25.jpg",
      ],
    },
    variations: {
      color: ["Red", "Black", "Dark Blue", "Light Blue"],
      size: ["One Size"],
    },
    image: "/placeholder.svg?height=400&width=400&text=FILA+Classic+Duffel",
  },
  {
    id: "2",
    name: "Field School BackPack",
    brand: "FIELD",
    price: 1999,
    description: "Compact everyday backpack with FILA logo",
    mainImage: "/images/products/field_main.jpg",
    images: {
      Black: ["/placeholder.svg?height=200&width=200&text=FILA+Mini+Backpack"],
    },
    variations: {
      color: ["Black"],
      size: ["One Size"],
    },
    image: "/placeholder.svg?height=400&width=400&text=FILA+Mini+Backpack",
  },
];

