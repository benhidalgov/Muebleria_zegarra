
import Link from 'next/link';
import { Image } from '@/components/ui/image';
import { products } from '@/db/schema';
import { InferSelectModel } from 'drizzle-orm';

type Product = InferSelectModel<typeof products>;

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/product/${product.slug}`} className="group block space-y-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    lqip={product.lqip}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Badge example */}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 text-xs font-medium uppercase tracking-wider backdrop-blur-sm rounded">
                    Nuevo
                </div>
            </div>
            <div className="space-y-1">
                <h3 className="font-serif text-lg text-gray-900 group-hover:underline decoration-1 underline-offset-4">
                    {product.name}
                </h3>
                <p className="text-sm font-medium text-gray-500">
                    ${product.basePrice}
                </p>
            </div>
        </Link>
    );
}
