import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(), // Camisetas, Hoodies, Pantalones, Chaquetas, Accesorios
  collection: text("collection").notNull(), // CAOS CREATIVO, ORIGEN, NO SIGNAL, DROP 04
  price: integer("price").notNull(), // cents
  compareAt: integer("compare_at"),
  description: text("description").notNull(),
  fabric: text("fabric").notNull(),
  fit: text("fit").notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  sizes: jsonb("sizes").$type<string[]>().notNull(),
  colors: jsonb("colors").$type<{name:string; hex:string}[]>().notNull(),
  tag: text("tag"), // NUEVO, BEST SELLER, -30%, ÚLTIMAS UNIDADES
  isNew: boolean("is_new").default(false),
  isBestSeller: boolean("is_best_seller").default(false),
  stock: integer("stock").default(40),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  author: text("author").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  sizeBought: text("size_bought"),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  email: text("email").notNull(),
  customerName: text("customer_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  paymentMethod: text("payment_method").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
  items: jsonb("items").$type<any[]>().notNull(),
  status: text("status").default("confirmado"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
