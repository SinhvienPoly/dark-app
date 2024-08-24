import { db } from '@/lib/db';
import { DataTable } from './data-table';
import { columns } from './columns';

const VideoPage = async () => {
    const data = await db.video.findMany({
        include: {
            category_for_videos: {
                include: {
                    category: true,
                },
            },
            thumbnail: true,
            video: true,
        },
    });

    return <DataTable columns={columns} data={data} />;
};

export default VideoPage;
