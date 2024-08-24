import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .email({
            message: 'Email là bắt buộc',
        })
        .trim(),
    password: z.string().min(1, { message: 'Mật khẩu là bắt buộc' }).trim(),
});

export const registerSchema = z.object({
    username: z.string({ message: 'Username là bắt buộc' }).min(3, { message: 'Tối thiểu 3 ký tự' }).trim(),
    email: z
        .string()
        .email({
            message: 'Email là bắt buộc',
        })
        .trim(),
    password: z.string({ message: 'Mật khẩu là bắt buộc' }).min(3, { message: 'Mật khẩu ít nhất 3 ký tự' }).trim(),
});

export const videoSchema = z.object({
    title: z.string({ message: 'Bắt buộc' }).min(3, { message: 'Tối thiểu 3 ký tự' }).trim(),
    description: z.string({ message: 'Bắt buộc' }).min(3, { message: 'Tối thiểu 3 ký tự' }).trim(),
    activate: z.string(),
});

export const categorySchema = z.object({
    title: z.string({ message: 'Bắt buộc' }).min(2, { message: 'Tối thiểu 2 ký tự' }).trim(),
});
