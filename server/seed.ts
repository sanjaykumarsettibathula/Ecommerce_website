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
      },
      {
        name: "Premium Wireless Headphones",
        description: "High-quality sound with noise cancellation",
        price: "15999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        stock: 45,
        sku: "WH-001",
        status: "active" as const
      },
      {
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals",
        price: "24999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        stock: 12,
        sku: "SW-002",
        status: "active" as const
      },
      {
        name: "Ultra-Thin Laptop",
        description: "Powerful performance in a sleek design",
        price: "89999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
        stock: 8,
        sku: "LT-003",
        status: "active" as const
      },
      {
        name: "Professional Camera",
        description: "Capture memories in stunning detail",
        price: "74999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
        stock: 15,
        sku: "CAM-004",
        status: "active" as const
      },
      {
        name: "Pro Tablet",
        description: "Perfect for work and entertainment",
        price: "44999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        stock: 25,
        sku: "TAB-005",
        status: "active" as const
      },
      {
        name: "Mechanical Keyboard",
        description: "Premium typing experience",
        price: "12999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop",
        stock: 30,
        sku: "KB-006",
        status: "active" as const
      },
      {
        name: "4K Monitor",
        description: "Crystal clear display quality",
        price: "32999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop",
        stock: 18,
        sku: "MON-007",
        status: "active" as const
      },
      {
        name: "Wireless Earbuds",
        description: "Compact and powerful audio",
        price: "11999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=300&fit=crop",
        stock: 50,
        sku: "EB-008",
        status: "active" as const
      },
      {
        name: "Gaming Mouse",
        description: "Precision for gaming and work",
        price: "5999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
        stock: 40,
        sku: "GM-009",
        status: "active" as const
      },
      {
        name: "Smartphone",
        description: "Latest technology in your pocket",
        price: "54999.00",
        category: "Electronics",
        imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
        stock: 22,
        sku: "SP-010",
        status: "active" as const
      },
      
      // Clothing Category
      {
        name: "Cotton T-Shirt",
        description: "Soft and comfortable casual wear",
        price: "899.00",
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
        stock: 100,
        sku: "TS-001",
        status: "active" as const
      },
      {
        name: "Denim Jeans",
        description: "Classic blue denim jeans",
        price: "2499.00",
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
        stock: 75,
        sku: "DJ-002",
        status: "active" as const
      },
      {
        name: "Formal Shirt",
        description: "Professional office wear",
        price: "1899.00",
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop",
        stock: 60,
        sku: "FS-003",
        status: "active" as const
      },
      {
        name: "Winter Jacket",
        description: "Warm and stylish winter wear",
        price: "3999.00",
        category: "Clothing",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
        stock: 30,
        sku: "WJ-004",
        status: "active" as const
      },
      
      // Books Category
      {
        name: "Programming Fundamentals",
        description: "Learn the basics of programming",
        price: "599.00",
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        stock: 50,
        sku: "BK-001",
        status: "active" as const
      },
      {
        name: "Business Strategy",
        description: "Master the art of business planning",
        price: "799.00",
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
        stock: 25,
        sku: "BK-002",
        status: "active" as const
      },
      {
        name: "Fiction Novel",
        description: "Engaging story for your leisure time",
        price: "399.00",
        category: "Books",
        imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop",
        stock: 80,
        sku: "BK-003",
        status: "active" as const
      },
      
      // Home & Garden Category
      {
        name: "Coffee Maker",
        description: "Start your day with perfect coffee",
        price: "3999.00",
        category: "Home & Garden",
        imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop",
        stock: 20,
        sku: "HG-001",
        status: "active" as const
      },
      {
        name: "Garden Plant Pot",
        description: "Beautiful ceramic plant pot",
        price: "899.00",
        category: "Home & Garden",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
        stock: 40,
        sku: "HG-002",
        status: "active" as const
      },
      {
        name: "LED Desk Lamp",
        description: "Modern lighting for your workspace",
        price: "1499.00",
        category: "Home & Garden",
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
        stock: 35,
        sku: "HG-003",
        status: "active" as const
      },
      
      // Sports & Fitness Category
      {
        name: "Yoga Mat",
        description: "Comfortable and durable yoga mat",
        price: "1299.00",
        category: "Sports & Fitness",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        stock: 60,
        sku: "SF-001",
        status: "active" as const
      },
      {
        name: "Dumbbells Set",
        description: "Complete home workout equipment",
        price: "2999.00",
        category: "Sports & Fitness",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        stock: 25,
        sku: "SF-002",
        status: "active" as const
      },
      {
        name: "Running Shoes",
        description: "Comfortable shoes for your runs",
        price: "3499.00",
        category: "Sports & Fitness",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
        stock: 45,
        sku: "SF-003",
        status: "active" as const
      }
    ];

    await db.insert(products).values(sampleProducts);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}