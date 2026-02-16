
import Link from 'next/link';
import { logout } from '@/actions/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:block">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-bold font-serif">Zegarra Admin</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Productos
                    </Link>
                    <Link href="/admin/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                        Pedidos
                    </Link>
                    <hr className="my-2" />
                    <Link href="/" className="block px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
                        ← Volver a la Tienda
                    </Link>
                    <form action={logout}>
                        <button className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md">
                            Cerrar Sesión
                        </button>
                    </form>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
