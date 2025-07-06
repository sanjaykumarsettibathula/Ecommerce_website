import { db } from "./db";
import { users, products } from "@shared/schema";
import bcrypt from "bcrypt";

export async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Check if we already have data
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await db.insert(users).values({
      email: 'admin@shopcraft.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    });

    // Create sample products
    const sampleProducts = [
      {
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with advanced Pro camera system',
        price: '999.99',
        category: 'Electronics',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-naturalti-titanium-select?wid=476&hei=476&fmt=jpeg&qlt=90&.v=1693011038309',
        stock: 50,
        sku: 'IPH15P-001',
        status: 'active' as const,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen',
        price: '1199.99',
        category: 'Electronics',
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/us/2401/gallery/us-galaxy-s24-ultra-s928-sm-s928uzaaxaa-539572131',
        stock: 30,
        sku: 'SGS24U-001',
        status: 'active' as const,
      },
      {
        name: 'MacBook Air M3',
        description: 'Ultra-thin laptop powered by Apple M3 chip',
        price: '1399.99',
        category: 'Electronics',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-13-m3-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034',
        stock: 25,
        sku: 'MBA13M3-001',
        status: 'active' as const,
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling wireless headphones',
        price: '399.99',
        category: 'Electronics',
        imageUrl: 'https://www.sony.com/image/5d02da5df55f2b7e55dac14af05b5c68?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF',
        stock: 75,
        sku: 'SWXM5-001',
        status: 'active' as const,
      },
      {
        name: 'Dell XPS 13',
        description: 'Premium ultrabook with InfinityEdge display',
        price: '1299.99',
        category: 'Electronics',
        imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-13-9340/media-gallery/silver/notebook-xps-13-9340-nt-silver-gallery-2.psd?fmt=pjpg&pscan=auto&scl=1&wid=3588&hei=2924&qlt=100,0&resMode=sharp2&size=3588,2924&chrss=full&imwidth=5000',
        stock: 40,
        sku: 'DXP13-001',
        status: 'active' as const,
      },
      {
        name: 'iPad Pro 12.9"',
        description: 'Professional tablet with M2 chip and Liquid Retina display',
        price: '1099.99',
        category: 'Electronics',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202210?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1664411207213',
        stock: 35,
        sku: 'IPP129-001',
        status: 'active' as const,
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Gaming console with vibrant OLED screen',
        price: '349.99',
        category: 'Electronics',
        imageUrl: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58',
        stock: 60,
        sku: 'NSW-OLED-001',
        status: 'active' as const,
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Advanced smartwatch with health monitoring',
        price: '429.99',
        category: 'Electronics',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT3J3ref_VW_34FR+watch-45-alum-midnight-nc-9s_VW_34FR_WF_CO?wid=750&hei=712&trim=1%2C0&fmt=p-jpg&qlt=95&.v=1694507270866',
        stock: 55,
        sku: 'AWS9-001',
        status: 'active' as const,
      },
      {
        name: 'Airpods Pro 2nd Gen',
        description: 'Wireless earbuds with active noise cancellation',
        price: '249.99',
        category: 'Electronics',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1660803972361',
        stock: 100,
        sku: 'APP2-001',
        status: 'active' as const,
      },
      {
        name: 'Samsung 65" QLED TV',
        description: '4K Smart TV with Quantum Dot technology',
        price: '1799.99',
        category: 'Electronics',
        imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/us/qn65q70cafxza/gallery/us-qled-4k-q70c-qn65q70cafxza-537175043',
        stock: 15,
        sku: 'SQ65-001',
        status: 'active' as const,
      }
    ];

    await db.insert(products).values(sampleProducts);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}