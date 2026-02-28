
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { ProductCard } from '@/components/commerce/product-card';
import { FilterSidebar } from '@/components/commerce/filter-sidebar';
import { Suspense } from 'react';

// ISR: Revalidate every hour
export const revalidate = 3600;

interface ShopPageProps {
    searchParams: Promise<{
        category?: string;
        material?: string;
    }>;
}

export default async function ProductosPage({ searchParams }: ShopPageProps) {
    const resolvedSearchParams = await searchParams;
    const allProducts = await db.select().from(products);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Page Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 pt-20">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white font-serif">
                        Colección Zegarra
                    </h1>
                    <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl">
                        Descubrí nuestra selección de muebles de alta calidad, diseñados para transformar cada espacio de tu hogar.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                            {allProducts.length} productos
                        </span>
                        {resolvedSearchParams.category && (
                            <span className="inline-flex items-center rounded-full bg-black dark:bg-white px-3 py-1 text-sm font-medium text-white dark:text-black capitalize">
                                {resolvedSearchParams.category}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <section aria-labelledby="products-heading">
                    <h2 id="products-heading" className="sr-only">
                        Productos
                    </h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        {/* Filters */}
                        <aside className="hidden lg:block lg:col-span-1">
                            <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 font-serif">Filtros</h3>
                                <Suspense fallback={<div className="text-gray-400 text-sm">Cargando filtros...</div>}>
                                    <FilterSidebar />
                                </Suspense>
                            </div>
                        </aside>

                        {/* Product Grid */}
                        <div className="lg:col-span-3">
                            {allProducts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                    {allProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                    <span className="text-5xl mb-4 block">🔍</span>
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                                        No se encontraron productos.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
