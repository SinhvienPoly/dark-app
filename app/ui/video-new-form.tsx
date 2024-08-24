'use client';

import { z } from 'zod';
import { Category, Image as ImageType } from '@prisma/client';
import { ChangeEvent, useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { GoUpload } from 'react-icons/go';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { videoSchema } from '@/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormUpload from '@/components/form-upload';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Heading from '@/components/heading';
import { restApi } from '@/lib/axios';
import ResponseMessage from '@/components/response-message';

type Props = {
    categories: Category[];
};

const VideoNewForm = ({ categories }: Props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [tags, setTags] = useState<string[]>([]);
    const [categoryIds, setCategoryIds] = useState<string[]>([]);
    const [thumbnail, setThumbnail] = useState<ImageType | null>(null);
    const [video, setVideo] = useState<ImageType | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const form = useForm<z.infer<typeof videoSchema>>({
        resolver: zodResolver(videoSchema),
        defaultValues: {
            title: '',
            description: '',
            activate: 'active',
        },
    });

    const onTags = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;

        const valueArray = value.split(',').map((v) => v.trim());
        const newValues = [...new Set(valueArray)];

        setTags(newValues);
    };

    const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>, id: string) => {
        if (e.target.checked) {
            setCategoryIds((prev) => [...prev, id]);
        } else {
            setCategoryIds((prev) => prev.filter((c) => c !== id));
        }
    };

    const onSave = (file: ImageType) => {
        if (file) {
            if (file.type === 'video/mp4') {
                toast({
                    description: 'Thumbnail nhận chỉ định dạng là ảnh.',
                    style: {
                        padding: '12px 14px',
                    },
                });
            } else {
                setThumbnail!(file!);
            }
        }
    };

    const onSaveVideo = (file: ImageType) => {
        if (file) {
            if (file.type !== 'video/mp4') {
                toast({
                    description: 'Video nhận chỉ định dạng là mp4.',
                    style: {
                        padding: '12px 14px',
                    },
                });
            } else {
                setVideo!(file!);
            }
        }
    };

    const onSubmit = (values: z.infer<typeof videoSchema>) => {
        if (!thumbnail || !video) {
            return toast({
                description: 'Video và ảnh là bắt buộc',
                style: {
                    padding: '12px 14px',
                    backgroundColor: '#ff5656',
                    color: 'white',
                },
            });
        }

        if (categoryIds.length === 0) {
            return toast({
                description: 'Vui lòng chọn ít nhất một thể loại',
                style: {
                    padding: '12px 14px',
                    backgroundColor: '#ff5656',
                    color: 'white',
                },
            });
        }

        startTransition(async () => {
            await restApi
                .post('/api/videos', {
                    ...values,
                    thumbnail_id: thumbnail?.id,
                    video_id: video?.id,
                    categories: categoryIds,
                    tags: tags,
                })
                .then((res) => {
                    setErrorMessage(res.data.errors);
                    setSuccessMessage(res.data.message);
                })
                .then(() => {
                    router.push('/videos');
                });
        });
    };

    return (
        <div>
            <Heading title="Thêm mới VIDEO" backButton />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tiêu đề</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="video..." {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mô tả</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="Nội dung video..." {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {categories.length === 0 ? (
                        <p>Chưa có danh mục nào</p>
                    ) : (
                        <div className="space-y-1">
                            <Label>Thể loại</Label>
                            <div className="w-full max-h-[300px] overflow-y-auto rounded border border-gray-400 py-4 px-4 space-y-3">
                                {categories?.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            onChange={(e) => onCheckboxChange(e, category.id)}
                                            className="border border-secondary"
                                            id={category.id}
                                        />
                                        <label
                                            htmlFor={category.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {category.title}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="activate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Trạng thái</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="active">Hoạt động</SelectItem>
                                        <SelectItem value="inActive">Bản nháp</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-1">
                        <Label htmlFor="thumbnail_id">Thumbnail</Label>

                        {thumbnail && (
                            <button onClick={() => setThumbnail(null)} type="button" className="float-right underline">
                                Clear
                            </button>
                        )}
                        <div className="flex gap-x-4">
                            {thumbnail && (
                                <Image
                                    className="rounded-xl shadow-lg"
                                    src={thumbnail.url!}
                                    width={128}
                                    height={128}
                                    alt="thumbnail_id"
                                />
                            )}
                            <FormUpload onSave={onSave}>
                                <div className="relative group w-24 h-full">
                                    <div className="relative z-40 cursor-pointer group-hover:translate-x-8 group-hover:shadow-2xl group-hover:-translate-y-8 transition-all duration-500 bg-neutral-900 flex items-center justify-center h-32 w-32 mx-auto rounded-xl">
                                        <GoUpload size={20} color="#fff" />
                                    </div>
                                    <div className="absolute border opacity-0 group-hover:opacity-80 transition-all duration-300 border-dashed border-gray-800 inset-0 z-30 bg-transparent flex items-center justify-center h-32 w-32 mx-auto rounded-xl"></div>
                                </div>
                            </FormUpload>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="video">Đăng tải video</Label>

                        {video && (
                            <video controls>
                                <source src={video.url!} />
                            </video>
                        )}

                        {video && (
                            <button onClick={() => setVideo(null)} type="button" className="float-right underline">
                                Clear
                            </button>
                        )}

                        <FormUpload onSave={onSaveVideo}>
                            <div className="relative group w-24 h-full">
                                <div className="relative z-40 cursor-pointer group-hover:translate-x-8 group-hover:shadow-2xl group-hover:-translate-y-8 transition-all duration-500 bg-neutral-900 flex items-center justify-center h-32 w-32 mx-auto rounded-xl">
                                    <GoUpload size={20} color="#fff" />
                                </div>
                                <div className="absolute border opacity-0 group-hover:opacity-80 transition-all duration-300 border-dashed border-gray-800 inset-0 z-30 bg-transparent flex items-center justify-center h-32 w-32 mx-auto rounded-xl"></div>
                            </div>
                        </FormUpload>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="video">Tags ( giá trị cách nhau bằng dấu &quot;, &quot; )</Label>
                        <Input placeholder="tag...." onChange={(e) => onTags(e)} />

                        {tags.length > 0 &&
                            tags.map((tag, index) => {
                                if (tag.length === 0) {
                                    return;
                                }

                                return (
                                    <Badge variant={'default'} className="mr-2 text-secondary py-1" key={index}>
                                        {tag}
                                    </Badge>
                                );
                            })}
                    </div>

                    {errorMessage && <ResponseMessage type="error">{errorMessage}</ResponseMessage>}
                    {successMessage && <ResponseMessage type="success">{successMessage}</ResponseMessage>}

                    <Button disabled={isPending} type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default VideoNewForm;
