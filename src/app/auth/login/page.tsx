'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/actions/auth';

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <main className="flex items-center justify-center md:h-screen bg-gray-50">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex w-full items-end rounded-lg bg-black p-3 md:h-36">
                    <div className="w-32 text-white md:w-36">
                        <h1 className="text-2xl font-serif font-bold">Mueblería Zegarra</h1>
                    </div>
                </div>
                <LoginForm errorMessage={errorMessage} dispatch={dispatch} />
            </div>
        </main>
    );
}

function LoginForm({ errorMessage, dispatch }: { errorMessage?: string, dispatch: any }) {
    return (
        <form action={dispatch} className="space-y-3">
            <div className="flex-1 rounded-lg bg-white px-6 pb-4 pt-8 shadow-sm">
                <h1 className="mb-3 text-2xl font-bold text-gray-900">
                    Iniciar Sesión
                </h1>
                <div className="w-full">
                    <div>
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 focus:border-black focus:ring-black"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Ingrese su correo"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Contraseña
                        </label>
                        <div className="relative">
                            <input
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-3 text-sm outline-2 placeholder:text-gray-500 focus:border-black focus:ring-black"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Ingrese contraseña"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>
                </div>
                <LoginButton />
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                </div>
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500">
                        Demo Admin: <span className="font-mono">admin@zegarra.com</span>
                    </p>
                </div>
            </div>
        </form>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button
            className="mt-4 w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
            aria-disabled={pending}
        >
            {pending ? 'Ingresando...' : 'Ingresar'}
        </button>
    );
}
