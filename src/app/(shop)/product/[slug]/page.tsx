
import { db } from '@/lib/db';
import { products, variants } from '@/db/schema';
import { Image } from '@/components/ui/image';
import { VariantSelector } from '@/components/commerce/variant-selector';
import { formatPrice } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface ProductPageProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

// ISR: Cache this page logic for 1 hour, but revalidate on demand works too
export const revalidate = 3600;

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
    // 1. Fetch Product
    const product = await db.query.products.findFirst({
        where: eq(products.slug, params.slug),
    });

    if (!product) {
        notFound();
    }

    // 2. Fetch Variants
    const productVariants = await db.query.variants.findMany({
        where: eq(variants.productId, product.id),
    });

    // 3. Calculate Dynamic Price based on URL Search Params
    let currentPrice = Number(product.basePrice);

    // Iterate through active variants in searchParams
    Object.values(searchParams).forEach((value) => {
        if (typeof value === 'string') {
            const selectedVariant = productVariants.find(v => v.value === value);
            if (selectedVariant && selectedVariant.priceAdjustment) {
                currentPrice += Number(selectedVariant.priceAdjustment);
            }
        }
    });

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">

                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        lqip={product.lqip}
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>

                {/* Product Info */}
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-serif">
                        {product.name}
                    </h1>

                    <div className="mt-3">
                        <h2 className="sr-only">Información del producto</h2>
                        <p className="text-3xl tracking-tight text-gray-900">
                            {formatPrice(currentPrice)}
                        </p>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Descripción</h3>
                        <div className="space-y-6 text-base text-gray-700">
                            <p>{product.description}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Suspense fallback={<div>Cargando opciones...</div>}>
                            <VariantSelector variants={productVariants} />
                        </Suspense>
                    </div>

                    <div className="mt-10 flex">
                        <button
                            type="button"
                            className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                        >
                            Añadir al Carrito - {formatPrice(currentPrice)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
