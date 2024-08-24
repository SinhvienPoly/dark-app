import { Category, CategoryForVideos, Image, Video } from '@prisma/client';

export type ExtandCategory = CategoryForVideos & {
    category: Category | null;
};

export type ExtandVideo = Video & {
    category_for_videos: ExtandCategory[];
    thumbnail?: Image | null;
    video?: Image | null;
};
