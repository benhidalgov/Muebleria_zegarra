'use server';

import { signIn, signOut } from '@/auth';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { AuthError } from 'next-auth';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirectTo: '/',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales inválidas.';
                default:
                    return 'Algo salió mal.';
            }
        }
        throw error;
    }
}

export async function register(
    prevState: string | undefined,
    formData: FormData,
) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        return 'Todos los campos son obligatorios.';
    }

    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden.';
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (existingUser) {
        return 'Ya existe una cuenta con este correo electrónico.';
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
        role: 'customer',
    });

    redirect('/auth/login?registered=true');
}

export async function logout() {
    await signOut({ redirectTo: '/auth/login' });
}
