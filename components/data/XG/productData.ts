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
  id: "3",
  name: "XG School-Travel BackPack",
  brand: "XG",
  price: 3099,
  description: "Classic sports duffel bag with FILA branding",
  mainImage: "/images/products/XG_main.jpg",
  images: {
    Red: [
      "/images/products/XG_1.jpg",
      "/images/products/XG_44.jpg",
      "/images/products/XG_7.jpg",
      "/images/products/XG_10.jpg",
      "/images/products/XG_14.jpg",
      "/images/products/XG_17.jpg",
      "/images/products/XG_27.jpg",
      "/images/products/XG_28.jpg",
      "/images/products/XG_29.jpg",
    ],
    Black: [
      "/images/products/XG_3.jpg",
      "/images/products/XG_46.jpg",
      "/images/products/XG_9.jpg",
      "/images/products/XG_13.jpg",
      "/images/products/XG_16.jpg",
      "/images/products/XG_19.jpg",
      "/images/products/XG_26.jpg",
      "/images/products/XG_30.jpg",
      "/images/products/XG_31.jpg",
    ],
    "Dark Blue": [
      "/images/products/XG_2.jpg",
      "/images/products/XG_5.jpg",
      "/images/products/XG_8.jpg",
      "/images/products/XG_11.jpg",
      "/images/products/XG_15.jpg",
      "/images/products/XG_18.jpg",
      "/images/products/XG_32.jpg",
      "/images/products/XG_33.jpg",
      "/images/products/XG_34.jpg",
    ],
    "Light Blue": [
      "/images/products/XG_20.jpg",
      "/images/products/XG_21.jpg",
      "/images/products/XG_22.jpg",
      "/images/products/XG_23.jpg",
      "/images/products/XG_24.jpg",
      "/images/products/XG_25.jpg",
      "/images/products/XG_35.jpg",
      "/images/products/XG_36.jpg",
      "/images/products/XG_37.jpg",
    ],
  },
  variations: {
    color: ["Red", "Black", "Dark Blue", "Light Blue"],
    size: ["One Size"],
  },
  image: "/images/products/XG_all.jpg",
};

export const relatedProducts: Product[] = [
  {
    id: "1",
  name: "COLUMBIA 'L' Back Pack",
  brand: "COLUMBIA",
  price: 2099,
  description: "The FILA Sport Backpack combines style with functionality. Features a spacious main compartment, convenient front zipper pockets, and durable construction. The embroidered FILA branding and clean design make it perfect for everyday use, from school to sports activities. Made with high-quality water-resistant material and finished with premium gold-tone zippers.",
  mainImage: "/images/products/columbiaL_main.png",
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
  image: "/images/products/columbiaL_all.jpg",
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