
import { db } from '../src/lib/db';
import { products, variants } from '../src/db/schema';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Pre-computed LQIPs (generated via scripts/generate-lqip.ts)
// These represent the "blurry" version of the high-res images below.
const LQIP_GRAY = "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoKAAcAAUAmJaQAAuQA/v02V///754A/v3tFv//9z///8kX/4j/4v/b///ywf/39sP/9/bD//f2w//39sP/9/bD/gAA";
const LQIP_BROWN = "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoKAAcAAUAmJaQAAuQA/v02V///754A/v3tFv//9z///8kX/4j/4v/b///ywf/39sP/9/bD//f2w//39sP/9/bD/gAA"; // Reusing for demo

async function main() {
    console.log('🌱 Seeding database...');

    try {
        // 1. Sofa "Cloud"
        const [sofa] = await db.insert(products).values({
            name: 'Sofá Cloud Modular',
            slug: 'sofa-cloud-modular',
            description: 'Sofá modular de diseño italiano, tapizado en lino de alta resistencia.',
            basePrice: '2499.00',
            imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
            lqip: LQIP_GRAY,
        }).returning();

        console.log(`Created product: ${sofa.name}`);

        // Variants for Sofa
        await db.insert(variants).values([
            {
                productId: sofa.id,
                type: 'fabric',
                name: 'Lino Gris',
                value: '#e5e7eb',
                priceAdjustment: '0',
            },
            {
                productId: sofa.id,
                type: 'fabric',
                name: 'Terciopelo Azul',
                value: '#1e3a8a',
                priceAdjustment: '200.00',
            }
        ]);

        // 2. Mesa de Centro "Nogal"
        const [table] = await db.insert(products).values({
            name: 'Mesa de Centro Nogal',
            slug: 'mesa-centro-nogal',
            description: 'Mesa de centro esculpida en madera maciza de nogal.',
            basePrice: '899.00',
            imageUrl: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=2068&auto=format&fit=crop',
            lqip: LQIP_BROWN,
        }).returning();

        console.log(`Created product: ${table.name}`);

        // 3. Sillón "Eames Style"
        await db.insert(products).values({
            name: 'Sillón Lounge Cuero',
            slug: 'sillon-lounge-cuero',
            description: 'Icono del diseño moderno. Cuero italiano y madera contrachapada.',
            basePrice: '3200.00',
            imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2068&auto=format&fit=crop',
            lqip: LQIP_BROWN,
        });

        // 4. Lámpara de Pie "Arco"
        await db.insert(products).values({
            name: 'Lámpara de Pie Arco',
            slug: 'lampara-pie-arco',
            description: 'Base de mármol Carrara y arco de acero inoxidable.',
            basePrice: '550.00',
            imageUrl: 'https://images.unsplash.com/photo-1513506003011-3b6444450f72?q=80&w=2070&auto=format&fit=crop',
            lqip: LQIP_GRAY,
        });

        console.log('✅ Seeding completed!');
    } catch (error) {
        console.error('❌ Error seeding:', error);
    } finally {
        process.exit(0);
    }
}

main();
