import { auth } from '@/auth';
import { db } from '@/lib/db';
import { videoSchema } from '@/schema';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

type ParamsProps = {
    params: {
        id: string;
    };
};

export const GET = async (_req: NextRequest, { params: { id } }: ParamsProps) => {
    const data = await db.video.findFirst({
        where: {
            id,
        },
        include: {
            thumbnail: true,
            video: true,
            category_for_videos: {
                include: {
                    category: true,
                },
            },
        },
    });

    if (!data) {
        return NextResponse.json({ message: 'Không tìm thấy video yêu cầu' }, { status: 200 });
    }

    return NextResponse.json({ data });
};

export const PUT = async (req: NextRequest, { params: { id } }: ParamsProps) => {
    const body = await req.json();

    const { title, description, video_id, thumbnail_id, categories, tags, activate } = body;

    const validatedField = videoSchema.safeParse({
        title,
        description,
        activate,
    });

    if (!validatedField.success) {
        return NextResponse.json(
            {
                errors: validatedField.error.flatten().fieldErrors,
            },
            { status: 400 },
        );
    }

    const data = await db.video.update({
        where: {
            id,
        },
        data: {
            title,
            description,
            tags,
            video: {
                connect: {
                    id: video_id,
                },
            },
            thumbnail: {
                connect: {
                    id: thumbnail_id,
                },
            },
            activate,
            category_for_videos: {
                deleteMany: {},
            },
        },
    });

    if (categories) {
        await db.categoryForVideos.createMany({
            data: categories?.map((id: string) => ({
                category_id: id,
                video_id: data.id,
            })),
        });
    }

    revalidatePath(`/videos/${data.id}`);

    return NextResponse.json({ data }, { status: 200 });
};
