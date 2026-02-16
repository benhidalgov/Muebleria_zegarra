import { db } from '../src/lib/db';
import { products, variants } from '../src/db/schema';
import * as dotenv from 'dotenv';
import sharp from 'sharp';

dotenv.config({ path: '.env.local' });

// Helper function to generate LQIP
async function generateLqip(imageUrl: string): Promise<string> {
    try {
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();

        const data = await sharp(Buffer.from(buffer))
            .resize(10)
            .webp({ quality: 20 })
            .toBuffer();

        return `data:image/webp;base64,${data.toString("base64")}`;
    } catch (error) {
        console.error(`Error generating LQIP for ${imageUrl}:`, error);
        return "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAADwAQCdASoKAAcAAUAmJaQAAuQA/v02V///754A/v3tFv//9z///8kX/4j/4v/b///ywf/39sP/9/bD//f2w//39sP/9/bD/gAA";
    }
}

const sampleProducts = [
    {
        name: "Sofá Moderno Escandinavo",
        slug: "sofa-moderno-escandinavo",
        description: "Sofá de 3 plazas con diseño minimalista, tapizado en tela de alta calidad. Perfecto para salas de estar contemporáneas.",
        basePrice: "2499.00",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    },
    {
        name: "Mesa de Comedor Rustica",
        slug: "mesa-comedor-rustica",
        description: "Mesa de madera maciza con acabado rústico, capacidad para 6-8 personas. Ideal para espacios amplios.",
        basePrice: "1899.00",
        imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    },
    {
        name: "Silla Moderna Tapizada",
        slug: "silla-moderna-tapizada",
        description: "Silla de comedor con asiento acolchado y patas de madera. Comodidad y estilo en equilibrio perfecto.",
        basePrice: "349.00",
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&q=80",
    },
    {
        name: "Estantería Industrial",
        slug: "estanteria-industrial",
        description: "Estantería de estilo industrial con estructura de metal negro y repisas de madera. 5 niveles de almacenamiento.",
        basePrice: "899.00",
        imageUrl: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80",
    },
    {
        name: "Sillón Relax Premium",
        slug: "sillon-relax-premium",
        description: "Sillón reclinable con reposapiés integrado, tapizado en cuero sintético de primera calidad.",
        basePrice: "1299.00",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    },
    {
        name: "Mesa Centro Cristal",
        slug: "mesa-centro-cristal",
        description: "Mesa de centro con tapa de cristal templado y estructura cromada. Diseño elegante y moderno.",
        basePrice: "549.00",
        imageUrl: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=800&q=80",
    },
    {
        name: "Escritorio Ejecutivo",
        slug: "escritorio-ejecutivo",
        description: "Escritorio de oficina con amplios cajones y superficie de trabajo. Madera de nogal con detalles en metal.",
        basePrice: "1750.00",
        imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
    },
    {
        name: "Cama King Size",
        slug: "cama-king-size",
        description: "Cama de matrimonio con cabecero acolchado, estructura reforzada y diseño contemporáneo.",
        basePrice: "2100.00",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80",
    },
];

async function main() {
    console.log('🌱 Seeding database with sample products...\n');

    // Clear existing data (variants first due to foreign key)
    await db.delete(variants);
    console.log('✓ Cleared existing variants');
    await db.delete(products);
    console.log('✓ Cleared existing products\n');

    for (const product of sampleProducts) {
        console.log(`Processing: ${product.name}...`);

        // Generate LQIP
        const lqip = await generateLqip(product.imageUrl);

        // Insert product
        await db.insert(products).values({
            ...product,
            lqip,
        });

        console.log(`  ✓ Added with LQIP`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`📦 Total products: ${sampleProducts.length}`);
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('❌ Seed failed:', err);
        process.exit(1);
    });
