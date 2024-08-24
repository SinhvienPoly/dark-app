import VideoNewForm from '@/app/ui/video-new-form';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const VideoNewPage = async () => {
    const categories = await db.category.findMany();

    return <VideoNewForm categories={categories} />;
};

export default VideoNewPage;
