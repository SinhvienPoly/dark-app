'use client';

import { Image as ImageType, Video } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';

export const columns: ColumnDef<Video>[] = [
    {
        id: 'select',

        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: 'thumbnail',
        header: 'Ảnh',
        cell: ({ row }) => {
            const url = (row.getValue('thumbnail') as ImageType)?.url;

            return <Image width={40} height={40} src={url!} alt="thumbnail" />;
        },
    },
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button
                    className="px-0"
                    variant="link"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Tiêu đề
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'category_for_videos',
        header: 'Thể loại',
        cell: ({ row }) => {
            const categories = row?.getValue('category_for_videos') as any[];

            return (
                <div className="truncate max-w-[200px]">
                    {categories?.map((cate) => cate.category.title).join(', ')}
                </div>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: () => <div className="text-right">Ngày tạo</div>,
        cell: ({ row }) => {
            const date = row.getValue('createdAt') as Date;
            const newDate = date?.toLocaleDateString();
            const newTime = date?.toLocaleTimeString();

            return (
                <div className="text-right font-medium">
                    {newTime} - {newDate}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const video = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(video.id)}>
                            Copy video ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link className="flex w-full" href={`videos/${video.id}`}>
                                Chi tiết
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
