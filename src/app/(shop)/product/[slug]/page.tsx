import { db } from '@/lib/db';
import { products, variants } from '@/db/schema';
import { ProductCard } from '@/components/commerce/product-card';
import { Image } from '@/components/ui/image';
import { VariantSelector } from '@/components/commerce/variant-selector';
import { formatPrice } from '@/lib/utils';
import { eq, ne } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 3600;

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    // 1. Fetch Product
    const product = await db.query.products.findFirst({
        where: eq(products.slug, slug),
    });

    if (!product) {
        notFound();
    }

    // 2. Fetch Variants
    const productVariants = await db.query.variants.findMany({
        where: eq(variants.productId, product.id),
    });

    // 3. Calculate Dynamic Price
    let currentPrice = Number(product.basePrice);
    Object.values(resolvedSearchParams).forEach((value) => {
        if (typeof value === 'string') {
            const selectedVariant = productVariants.find(v => v.value === value);
            if (selectedVariant && selectedVariant.priceAdjustment) {
                currentPrice += Number(selectedVariant.priceAdjustment);
            }
        }
    });

    // 4. Fetch Related Products
    const relatedProducts = await db
        .select()
        .from(products)
        .where(ne(products.id, product.id))
        .limit(4);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Breadcrumb */}
            <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                    <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <li>
                            <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                                Inicio
                            </Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m9 5 7 7-7 7" />
                            </svg>
                        </li>
                        <li>
                            <Link href="/productos" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                                Productos
                            </Link>
                        </li>
                        <li>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m9 5 7 7-7 7" />
                            </svg>
                        </li>
                        <li className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
                            {product.name}
                        </li>
                    </ol>
                </nav>
            </div>

            {/* Product Section */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">

                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg">
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
                    <div className="mt-10 lg:mt-0 flex flex-col">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white font-serif">
                                {product.name}
                            </h1>

                            {/* Price */}
                            <div className="mt-4 flex items-baseline gap-3">
                                <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                    {formatPrice(currentPrice)}
                                </p>
                                {currentPrice !== Number(product.basePrice) && (
                                    <p className="text-lg text-gray-400 line-through">
                                        {formatPrice(product.basePrice)}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <h2 className="sr-only">Descripción</h2>
                                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                                    {product.description}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="my-8 border-t border-gray-200 dark:border-gray-800" />

                            {/* Variant Selector */}
                            {productVariants.length > 0 && (
                                <div>
                                    <Suspense fallback={<div className="text-gray-400 text-sm">Cargando opciones...</div>}>
                                        <VariantSelector variants={productVariants} />
                                    </Suspense>
                                </div>
                            )}
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-8">
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-3 rounded-xl bg-black dark:bg-white px-8 py-4 text-base font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                                Añadir al Carrito — {formatPrice(currentPrice)}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                </svg>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Envío Gratis</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Garantía 2 años</span>
                            </div>
                            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                                </svg>
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Devolución fácil</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
                        <div className="flex items-baseline justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-serif">
                                También te puede interesar
                            </h2>
                            <Link
                                href="/productos"
                                className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hidden sm:block"
                            >
                                Ver todos →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((rp) => (
                                <ProductCard key={rp.id} product={rp} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
