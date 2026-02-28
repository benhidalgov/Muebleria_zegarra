
import Link from 'next/link';
import { Image } from '@/components/ui/image';
import { products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';
import { formatPrice } from '@/lib/utils';

type Product = InferSelectModel<typeof products>;

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            href={`/product/${product.slug}`}
            className="group block rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700/30">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    lqip={product.lqip}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Badge */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600/50">
                    Nuevo
                </div>
            </div>
            <div className="p-4 space-y-2">
                <h3 className="font-serif text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                {product.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {product.description}
                    </p>
                )}
                <p className="text-base font-bold text-gray-900 dark:text-white pt-1">
                    {formatPrice(product.basePrice)}
                </p>
            </div>
        </Link>
    );
}
