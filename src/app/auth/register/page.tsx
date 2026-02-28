'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/actions/auth';
import Link from 'next/link';

export default function RegisterPage() {
    const [errorMessage, dispatch] = useFormState(register, undefined);

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4">
            <div className="relative mx-auto flex w-full max-w-[440px] flex-col space-y-3 md:-mt-16">
                {/* Header */}
                <div className="flex w-full items-end rounded-2xl bg-gradient-to-br from-gray-900 to-black dark:from-gray-800 dark:to-gray-900 p-6 md:h-36">
                    <div className="w-full">
                        <h1 className="text-2xl font-serif font-bold text-white">Mueblería Zegarra</h1>
                        <p className="text-sm text-gray-400 mt-1">Creá tu cuenta</p>
                    </div>
                </div>

                {/* Form */}
                <form action={dispatch} className="space-y-3">
                    <div className="rounded-2xl bg-white dark:bg-gray-900 px-6 pb-6 pt-8 shadow-sm border border-gray-100 dark:border-gray-800">
                        <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">
                            Crear Cuenta
                        </h2>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
                                    Nombre Completo
                                </label>
                                <input
                                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-colors"
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                                    Correo Electrónico
                                </label>
                                <input
                                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-colors"
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="password">
                                    Contraseña
                                </label>
                                <input
                                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-colors"
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300" htmlFor="confirmPassword">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    className="block w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-2.5 px-3 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white outline-none transition-colors"
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Repetí tu contraseña"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <RegisterButton />

                        {/* Error message */}
                        <div className="flex h-8 items-end" aria-live="polite" aria-atomic="true">
                            {errorMessage && (
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            )}
                        </div>

                        {/* Link to login */}
                        <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ¿Ya tenés cuenta?{' '}
                                <Link href="/auth/login" className="font-medium text-black dark:text-white hover:underline">
                                    Iniciá sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}

function RegisterButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="mt-6 w-full rounded-lg bg-black dark:bg-white px-4 py-2.5 text-sm font-semibold text-white dark:text-black transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
            disabled={pending}
        >
            {pending ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
    );
}
