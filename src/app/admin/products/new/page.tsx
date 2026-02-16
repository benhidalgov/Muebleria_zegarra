
import { createProduct } from '@/actions/admin';

export default function NewProductPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>

            <form action={createProduct} className="space-y-6 bg-white p-6 rounded-lg shadow">

                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input name="name" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                        <input name="slug" type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio Base</label>
                        <input name="basePrice" type="number" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea name="description" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Imagen URL (Unsplash, etc)</label>
                    <input name="imageUrl" type="url" required placeholder="https://..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm border p-2" />
                    <p className="text-xs text-gray-500 mt-1">El sistema generará automáticamente el efecto blur (LQIP).</p>
                </div>

                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    Guardar Producto
                </button>
            </form>
        </div>
    );
}
