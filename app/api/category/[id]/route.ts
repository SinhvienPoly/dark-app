import { db } from '@/lib/db';
import { categorySchema } from '@/schema';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type ParamsProps = {
    params: {
        id: string;
    };
};

export const GET = async (_req: NextRequest, { params: { id } }: ParamsProps) => {
    try {
        const data = await db.category.findFirst({
            where: {
                id,
            },
        });

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
};

export const PUT = async (req: NextRequest, { params: { id } }: ParamsProps) => {
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

    const data = await db.category.update({
        where: {
            id,
        },
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
            message: 'Cập nhật thành công',
            data,
        },
        { status: 200 },
    );
};
