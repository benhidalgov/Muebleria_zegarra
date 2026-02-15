import { pgTable, text, decimal, integer, uuid, uniqueIndex, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define Enums
export const variantTypeEnum = pgEnum('variant_type', ['wood', 'fabric', 'size']);

// Products Table
export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    imageUrl: text('image_url').notNull(),
    // CRITICAL: Stores the base64 blur placeholder for Next/Image
    // Generated at ingestion time (e.g. via script or CMS webhook)
    lqip: text('lqip').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
    return {
        slugIdx: uniqueIndex('slug_idx').on(table.slug),
    };
});

// Variants Table (for configurator)
export const variants = pgTable('variants', {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id').references(() => products.id).notNull(),
    type: variantTypeEnum('type').notNull(), // 'wood', 'fabric', or 'size'
    name: text('name').notNull(), // e.g. "Oak", "Velvet Blue"
    value: text('value').notNull(), // e.g. "#8B4513", "velvet-blue-code"
    priceAdjustment: decimal('price_adjustment', { precision: 10, scale: 2 }).default('0'),
    imageUrl: text('image_url'), // Optional: specific image for this variant
});
