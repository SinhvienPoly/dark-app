'use server';

import { loginSchema, registerSchema } from '@/schema';
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { getUserByEmail } from './user';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';

export const login = async (values: any, callbackUrl?: string) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: 'Invalid field',
        };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { errors: 'Invalid credentials!' };
                default:
                    return { errors: 'Something went wrong!' };
            }
        }

        throw error;
    }
};

export const register = async (values: z.infer<typeof registerSchema>) => {
    const validatedFields = registerSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: 'Invalid fields',
        };
    }

    const { username, email, password } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await getUserByEmail(email);

    if (existing) {
        return { errors: 'Email đã tồn tại' };
    }

    await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    return {
        success: 'Đăng ký thành công',
    };
};
