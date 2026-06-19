import { ListOrderedIcon } from "lucide-react";

// SIZES
const sizes = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "S",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "M",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "L",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "XL",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "XXL",
  },
];

// CATEGORIES
const categories = [
  {
    id: "7d9b2d91-3f45-4a0f-9c81-446655440001",
    type: "animal",
  },
  {
    id: "7d9b2d91-3f45-4a0f-9c81-446655440002",
    type: "cartoon",
  },
  {
    id: "7d9b2d91-3f45-4a0f-9c81-446655440003",
    type: "anime",
  },
  {
    id: "7d9b2d91-3f45-4a0f-9c81-446655440004",
    type: "fruit",
  },
];

// COLORS
const colors = [
  {
    id: "1f4d8c8d-4a3f-4c8b-9c5a-123456789001",
    name: "White",
  },
  {
    id: "1f4d8c8d-4a3f-4c8b-9c5a-123456789002",
    name: "Pink",
  },
  {
    id: "1f4d8c8d-4a3f-4c8b-9c5a-123456789003",
    name: "Brown",
  },
  {
    id: "1f4d8c8d-4a3f-4c8b-9c5a-123456789004",
    name: "Blue",
  },
  {
    id: "1f4d8c8d-4a3f-4c8b-9c5a-123456789005",
    name: "Yellow",
  },
];

const products = [
  {
    id: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1001",
    name: "Brown Teddy Bear",
    price: 299000,
    stock: 50,
    sold: 12,
    status: "active",
    colorId: [
      "1f4d8c8d-4a3f-4c8b-9c5a-123456789001", // white
      "1f4d8c8d-4a3f-4c8b-9c5a-123456789003", // brown
    ],
    categoryId: "7d9b2d91-3f45-4a0f-9c81-446655440001", // animal
    sizeId: [
      "550e8400-e29b-41d4-a716-446655440001", // S
      "550e8400-e29b-41d4-a716-446655440003", // L
    ],
    mainImageUrl: "https://example.com/images/brown-teddy-main.jpg",
    imageUrl: [
      "https://example.com/images/brown-teddy-1.jpg",
      "https://example.com/images/brown-teddy-2.jpg",
    ],
    description: "Soft brown teddy bear made from premium plush fabric.",
    createdAt: "2026-06-14T10:00:00Z",
    updatedAt: "2026-06-14T10:00:00Z",
  },

  {
    id: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1003",
    name: "Doraemon Plush",
    price: 399000,
    stock: 40,
    sold: 55,
    status: "active",
    colorId: [
      "1f4d8c8d-4a3f-4c8b-9c5a-123456789004", // Blue
    ],
    categoryId: "7d9b2d91-3f45-4a0f-9c81-446655440003", // anime
    sizeId: [
      "550e8400-e29b-41d4-a716-446655440002", // M
      "550e8400-e29b-41d4-a716-446655440005", // XXL
    ],
    mainImageUrl: "https://example.com/images/doraemon-main.jpg",
    imageUrl: [
      "https://example.com/images/doraemon-1.jpg",
      "https://example.com/images/doraemon-2.jpg",
    ],
    description: "Popular Doraemon plush toy for all ages.",
    createdAt: "2026-06-14T10:20:00Z",
    updatedAt: "2026-06-14T10:20:00Z",
  },

  {
    id: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1004",
    name: "Pikachu Plush",
    price: 459000,
    stock: 25,
    sold: 41,
    status: "active",
    colorId: ["1f4d8c8d-4a3f-4c8b-9c5a-123456789005"],
    categoryId: "7d9b2d91-3f45-4a0f-9c81-446655440002",
    sizeId: [
      "550e8400-e29b-41d4-a716-446655440003",
      "550e8400-e29b-41d4-a716-446655440004",
    ],
    mainImageUrl: "https://example.com/images/pikachu-main.jpg",
    imageUrl: [
      "https://example.com/images/pikachu-1.jpg",
      "https://example.com/images/pikachu-2.jpg",
    ],
    description: "Adorable Pikachu plush from Pokémon series.",
    createdAt: "2026-06-14T10:30:00Z",
    updatedAt: "2026-06-14T10:30:00Z",
  },
];

// USERS
const users = [
  {
    id: "970a56c8-2ec7-4b01-a02b-101873f003eb",
    fullName: "Nguyen Van A",
    email: "admin@example.com",
    password: "123456",
    role: "admin",
    address: "Thai Binh",
    phone: "04952864395",
    createdAt: "2026-06-14T08:00:00Z",
    updatedAt: "2026-06-14T08:00:00Z",
  },
  {
    id: "4d61a9e5-c0d7-4fd3-bfcf-9c6b4efc6a11",
    fullName: "Tran Thi B",
    email: "staff@example.com",
    password: "123456",
    role: "staff",
    address: "Ha Noi",
    phone: "0912345678",
    createdAt: "2026-06-14T08:10:00Z",
    updatedAt: "2026-06-14T08:10:00Z",
  },
  {
    id: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",
    fullName: "Le Van C",
    email: "customer@example.com",
    password: "123456",
    role: "customer",
    address: "Hai Phong",
    phone: "0987654321",
    createdAt: "2026-06-14T08:20:00Z",
    updatedAt: "2026-06-14T08:20:00Z",
  },
];

// CARTITEMS
const cartItems = [
  {
    id: "c7a8b4f1-5d92-4d16-9c1f-446655440001",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91", // customer

    productId: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1001", // Brown Teddy Bear

    sizeId: "550e8400-e29b-41d4-a716-446655440001", // S
    colorId: "1f4d8c8d-4a3f-4c8b-9c5a-123456789003", // Brown

    quantity: 2,
    totalPrice: 598000, // 299000 * 2
  },

  {
    id: "c7a8b4f1-5d92-4d16-9c1f-446655440002",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",

    productId: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1003", // Doraemon

    sizeId: "550e8400-e29b-41d4-a716-446655440002", // M
    colorId: "1f4d8c8d-4a3f-4c8b-9c5a-123456789004", // Blue

    quantity: 1,
    totalPrice: 399000,
  },

  {
    id: "c7a8b4f1-5d92-4d16-9c1f-446655440003",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",

    productId: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1004", // Pikachu

    sizeId: "550e8400-e29b-41d4-a716-446655440004", // XL
    colorId: "1f4d8c8d-4a3f-4c8b-9c5a-123456789005", // Yellow

    quantity: 3,
    totalPrice: 1377000, // 459000 * 3
  },
];

// ORDERS
const orders = [
  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-446655440001",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",

    receiverName: "Le Van C",
    phone: "0987654321",
    address: "123 Tran Hung Dao, Hai Phong",

    totalPriceCart: 2374000,

    status: "pending",

    createdAt: "2026-06-14T12:00:00Z",
    updatedAt: "2026-06-14T12:00:00Z",
  },

  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-446655440002",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",

    receiverName: "Le Van C",
    phone: "0987654321",
    address: "456 Le Loi, Hai Phong",

    totalPriceCart: 598000,

    status: "confirmed",

    createdAt: "2026-06-13T09:00:00Z",
    updatedAt: "2026-06-13T10:00:00Z",
  },

  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-446655440003",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",

    receiverName: "Le Van C",
    phone: "0987654321",
    address: "789 Nguyen Hue, Hai Phong",

    totalPriceCart: 399000,

    status: "shipping",

    createdAt: "2026-06-12T10:00:00Z",
    updatedAt: "2026-06-13T08:00:00Z",
  },

  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-446655440004",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",

    receiverName: "Le Van C",
    phone: "0987654321",
    address: "321 Hai Ba Trung, Hai Phong",

    totalPriceCart: 1377000,

    status: "delivered",

    createdAt: "2026-06-10T10:00:00Z",
    updatedAt: "2026-06-12T15:20:00Z",
  },

  {
    id: "a1b2c3d4-e5f6-4a7b-8c9d-446655440005",
    userId: "f89ab7a2-2a72-4c6d-a7f2-5f4f7e2d8c91",

    receiverName: "Le Van C",
    phone: "0987654321",
    address: "555 Lach Tray, Hai Phong",

    totalPriceCart: 299000,

    status: "cancelled",

    createdAt: "2026-06-09T08:00:00Z",
    updatedAt: "2026-06-09T09:30:00Z",
  },
];

// ORDERITEMS
const orderItems = [
  {
    id: "e7c3b9f1-2a45-4d88-b6c7-9f1a2e3d0001",
    orderId: "d1f5a4e8-7b3c-4f6a-9d21-8c5e7a1b0001",

    productId: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1001",
    sizeId: "550e8400-e29b-41d4-a716-446655440001",
    colorId: "1f4d8c8d-4a3f-4c8b-9c5a-123456789003",

    quantity: 2,
    price: 299000,
    totalPrice: 598000,
  },

  {
    id: "e7c3b9f1-2a45-4d88-b6c7-9f1a2e3d0002",
    orderId: "d1f5a4e8-7b3c-4f6a-9d21-8c5e7a1b0001",

    productId: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1003",
    sizeId: "550e8400-e29b-41d4-a716-446655440002",
    colorId: "1f4d8c8d-4a3f-4c8b-9c5a-123456789004",

    quantity: 1,
    price: 399000,
    totalPrice: 399000,
  },

  {
    id: "e7c3b9f1-2a45-4d88-b6c7-9f1a2e3d0003",
    orderId: "d1f5a4e8-7b3c-4f6a-9d21-8c5e7a1b0001",

    productId: "8c5d2b2f-3c89-4a17-bf63-6f7b2f9e1004",
    sizeId: "550e8400-e29b-41d4-a716-446655440004",
    colorId: "1f4d8c8d-4a3f-4c8b-9c5a-123456789005",

    quantity: 3,
    price: 459000,
    totalPrice: 1377000,
  },
];
