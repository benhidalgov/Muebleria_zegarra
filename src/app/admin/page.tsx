
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { auth } from '@/auth';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import { deleteProduct } from '@/actions/admin';

export default async function AdminDashboard() {
    const session = await auth();

    // @ts-ignore
    if (session?.user?.role !== 'admin') {
        return <div>No autorizado</div>;
    }

    const allProducts = await db.select().from(products);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">{allProducts.length} productos en catálogo</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    + Nuevo Producto
                </Link>
            </div>

            <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Base</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allProducts.map((product) => {
                            const deleteWithId = deleteProduct.bind(null, product.id);
                            return (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatPrice(product.basePrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                        /{product.slug}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <Link
                                            href={`/product/${product.slug}`}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                            target="_blank"
                                        >
                                            Ver
                                        </Link>
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                        >
                                            Editar
                                        </Link>
                                        <form action={deleteWithId} className="inline">
                                            <button
                                                type="submit"
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                            >
                                                Eliminar
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
