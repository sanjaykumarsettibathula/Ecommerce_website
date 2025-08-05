import { db } from './db';
import { products as productsTable } from './types/schema';
import { initialProducts } from './storage';
import { eq } from 'drizzle-orm';

async function seedProducts() {
  let inserted = 0;
  for (const product of initialProducts) {
    try {
      // Check for duplicate SKU
      const existing = await db.select().from(productsTable).where(eq(productsTable.sku, product.sku));
      if (existing.length > 0) {
        console.log(`Skipping duplicate SKU: ${product.sku}`);
        continue;
      }
      // Ensure status is 'active' | 'inactive'
      const status = (product.status === 'active' || product.status === 'inactive') ? product.status : 'active';
      await db.insert(productsTable).values({ ...product, status }).returning();
      inserted++;
      console.log(`Inserted: ${product.name} (${product.sku})`);
    } catch (err) {
      console.error(`Error inserting ${product.name} (${product.sku}):`, err);
    }
  }
  console.log(`\nSeeding complete. Inserted ${inserted} products.`);
}

seedProducts().then(() => process.exit(0)); 