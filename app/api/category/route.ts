import { db } from '@/lib/db';
import { categorySchema } from '@/schema';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async () => {
    try {
        const data = await db.category.findMany();

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const { title } = body;

    const validatedField = categorySchema.safeParse({
        title,
    });

    if (!validatedField.success) {
        return NextResponse.json(
            {
                errors: validatedField.error.flatten().fieldErrors,
            },
            { status: 400 },
        );
    }

    const data = await db.category.create({
        data: {
            title,
        },
    });

    const path = req.nextUrl.searchParams.get('path');
    if (path) {
        revalidatePath(path);
    }

    return NextResponse.json(
        {
            message: 'Tạo danh mục thành công',
            data,
        },
        { status: 200 },
    );
};
