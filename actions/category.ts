import { db } from '@/lib/db';
import { categorySchema } from '@/schema';

export const newCategory = async (values: any) => {
    const validatedFields = categorySchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: 'Invalid fields',
        };
    }

    const { title } = validatedFields.data;

    await db.category.create({
        data: {
            title,
        },
    });

    return {
        success: 'Tạo danh mục thành công',
    };
};

export const getCategoryById = async (id: string) => {
    const data = await db.category.findFirst({
        where: {
            id,
        },
    });

    return data;
};

export const updateCategory = async (id: string, values: any) => {
    const validatedFields = categorySchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            errors: 'Invalid fields',
        };
    }

    const { title } = validatedFields.data;

    await db.category.update({
        where: {
            id,
        },
        data: {
            title,
        },
    });

    return {
        success: 'Lưu danh mục thành công',
    };
};
