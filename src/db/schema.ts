import { pgTable, text, decimal, integer, uuid, uniqueIndex, pgEnum, timestamp, primaryKey } from 'drizzle-orm/pg-core';
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

// --- Auth.js Schema ---

export const roleEnum = pgEnum('role', ['admin', 'customer']);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    role: roleEnum('role').default('customer').notNull(), // Custom role field
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<import("@auth/core/adapters").AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);
