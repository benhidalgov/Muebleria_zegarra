import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { updateProduct, deleteProduct } from '@/actions/admin';

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;

    const product = await db.query.products.findFirst({
        where: eq(products.id, id),
    });

    if (!product) {
        notFound();
    }

    const updateWithId = updateProduct.bind(null, id);
    const deleteWithId = deleteProduct.bind(null, id);

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
                <form action={deleteWithId}>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                            // This will show browser confirm dialog
                        }}
                    >
                        Eliminar Producto
                    </button>
                </form>
            </div>

            <form action={updateWithId} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input
                        name="name"
                        type="text"
                        required
                        defaultValue={product.name}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                        <input
                            name="slug"
                            type="text"
                            required
                            defaultValue={product.slug}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio Base</label>
                        <input
                            name="basePrice"
                            type="number"
                            step="0.01"
                            required
                            defaultValue={product.basePrice}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        name="description"
                        rows={3}
                        required
                        defaultValue={product.description || ''}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen URL</label>
                    <input
                        name="imageUrl"
                        type="url"
                        required
                        defaultValue={product.imageUrl}
                        placeholder="https://..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">Si cambiás la URL, el LQIP se regenerará automáticamente.</p>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Guardar Cambios
                </button>
            </form>
        </div>
    );
}
