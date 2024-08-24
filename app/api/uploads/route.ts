import { db } from '@/lib/db';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export const GET = async (req: NextRequest) => {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('type');

        const images = await db.image.findMany({
            where: {
                type: query ? query?.toString() : undefined,
            },
        });

        if (images.length === 0) {
            return Response.json({ message: 'Phương tiện đang trống', data: [] }, { status: 200 });
        }

        return NextResponse.json({ message: 'Đã tìm thấy phương tiện đang có', data: images }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return Response.json({ message: 'Không tìm thấy phương tiện' }, { status: 201 });
    }

    const types = ['image/webp', 'image/jpg', 'image/png', 'image/jpeg', 'video/mp4'];
    if (!types.includes(file.type)) {
        return Response.json({ message: 'Phương tiện không hợp lệ' }, { status: 201 });
    }

    const byteData = await file.arrayBuffer();

    const buffer = Buffer.from(byteData);

    const path = `./public/uploads/${file.name}`;

    await writeFile(path, buffer);

    const duplucated = await db.image.findUnique({
        where: {
            name: file.name,
        },
    });

    if (duplucated) {
        return Response.json({ message: 'một số phương tiện đã được lưu trữ' }, { status: 200 });
    }

    await db.image.createMany({
        data: {
            url: `/uploads/${file.name}`,
            name: file.name,
            size: file.size,
            type: file.type,
        },
    });

    return Response.json(
        {
            message: 'Nạp file thành công',
            url: `${process.env.NEXT_REDIRECT_URL}/uploads/${file.name}`,
        },
        { status: 200 },
    );
};
