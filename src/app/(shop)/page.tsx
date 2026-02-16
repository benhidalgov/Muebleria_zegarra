import Link from 'next/link';
import { Image } from '@/components/ui/image';

export default function LandingPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-black dark:via-gray-900 dark:to-gray-800">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                        Mueblería Zegarra
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">
                        Muebles de alta calidad que transforman espacios en hogares
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/productos"
                            className="px-8 py-4 bg-white text-black dark:bg-gray-100 dark:text-black font-semibold rounded-md hover:bg-gray-100 dark:hover:bg-gray-200 transition-all shadow-lg"
                        >
                            Explorar Colección
                        </Link>
                        <Link
                            href="#sobre-nosotros"
                            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-black transition-all"
                        >
                            Conocer Más
                        </Link>
                    </div>
                </div>
            </section>

            {/* Sobre Nosotros */}
            <section id="sobre-nosotros" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                            Nuestra Historia
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Desde hace más de 20 años, creamos muebles que combinan artesanía tradicional
                            con diseño contemporáneo.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🪑</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Calidad Superior
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Materiales premium seleccionados cuidadosamente para garantizar durabilidad.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✨</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Diseño Único
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Cada pieza es diseñada con atención al detalle y estética moderna.
                            </p>
                        </div>

                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🤝</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Compromiso
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Tu satisfacción es nuestra prioridad, con garantía y servicio post-venta.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Final */}
            <section className="py-20 px-4 bg-black dark:bg-gray-950">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold text-white mb-6">
                        Encuentra tu Mueble Perfecto
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Explora nuestra colección y descubre cómo podemos transformar tu hogar.
                    </p>
                    <Link
                        href="/productos"
                        className="inline-block px-10 py-4 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-all text-lg"
                    >
                        Ver Productos
                    </Link>
                </div>
            </section>
        </>
    );
}
