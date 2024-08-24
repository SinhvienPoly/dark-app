import VideoUpdateForm from '@/app/ui/video-update-form';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type SearchParams = {
    params: {
        id: string;
    };
};

const Page = async ({ params: { id } }: SearchParams) => {
    const categories = await db.category.findMany();
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

    if (!data) return notFound();

    return <VideoUpdateForm categories={categories} data={data!} />;
};

export default Page;
