import Link from 'next/link';
import { auth } from '@/auth';
import { logout } from '@/actions/auth';
import { ThemeToggle } from './theme-toggle';

export async function Navbar() {
    const session = await auth();

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            Mueblería Zegarra
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Inicio
                        </Link>
                        <Link
                            href="/productos"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Productos
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        {session?.user ? (
                            <>
                                <span className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
                                    Hola, {session.user.name || session.user.email}
                                </span>
                                {session.user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <form action={logout}>
                                    <button className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        Cerrar Sesión
                                    </button>
                                </form>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
