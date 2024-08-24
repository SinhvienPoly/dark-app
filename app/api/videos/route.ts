import { db } from '@/lib/db';
import { videoSchema } from '@/schema';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';

export const GET = async (req: NextRequest) => {
    const params = req;

    try {
        const data = await db.video.findMany();

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
};

export const POST = async (req: NextRequest) => {
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

    const data = await db.video.create({
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

    revalidatePath('/videos/new');

    return NextResponse.json({ data }, { status: 200 });
};
