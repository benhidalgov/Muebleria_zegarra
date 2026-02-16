
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { ProductCard } from '@/components/commerce/product-card';
import { FilterSidebar } from '@/components/commerce/filter-sidebar';
import { ilike, or } from 'drizzle-orm';
import { Suspense } from 'react';

// Force dynamic rendering to handle searchParams properly if needed,
// but for pure filtering, allow caching.
export const revalidate = 3600; // ISR: Revalidate every hour

interface ShopPageProps {
    searchParams: {
        category?: string;
        material?: string;
    };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    // Simulate filtering logic (in a real app, you'd map these params to SQL where clauses)
    // For this seed data, we just fetch all products as a starting point.
    // Advanced filtering would be: db.select().from(products).where(...)
    const allProducts = await db.select().from(products);

    return (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 font-serif">
                    Colección Zegarra
                </h1>
                <div className="flex items-center">
                    {/* Sort dropdown could go here */}
                    <span className="text-sm text-gray-500">
                        {allProducts.length} productos
                    </span>
                </div>
            </div>

            <section aria-labelledby="products-heading" className="pb-24 pt-6">
                <h2 id="products-heading" className="sr-only">
                    Productos
                </h2>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {/* Filters */}
                    <aside className="hidden lg:block lg:col-span-1">
                        <Suspense fallback={<div>Cargando filtros...</div>}>
                            <FilterSidebar />
                        </Suspense>
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {allProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                {allProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                No se encontraron productos.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
