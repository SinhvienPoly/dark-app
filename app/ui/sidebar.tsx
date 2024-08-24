'use client';

import ButtonNavigation from '@/components/button-navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CiMenuBurger } from 'react-icons/ci';

import Link from 'next/link';

const Sidebar = () => {
    const menus = [
        {
            id: 'admin-home',
            label: 'Bảng điều khiển',
            to: '/dashboard',
        },
        {
            id: 'admin-video',
            label: 'Video',
            to: null,
            children: [
                {
                    id: 'admin-video-table',
                    label: 'Tổng hợp',
                    to: '/videos',
                },
                {
                    id: 'admin-video-new',
                    label: 'Thêm mới',
                    to: '/videos/new',
                },
            ],
        },
        {
            id: 'admin-video-category',
            label: 'Thể loại',
            to: null,
            children: [
                {
                    id: '/admin-category-table',
                    label: 'Tổng hợp',
                    to: '/categories',
                },
                {
                    id: '/admin-category-new',
                    label: 'Thêm mới',
                    to: '/categories/new',
                },
            ],
        },
        {
            id: 'settings',
            label: 'Cài đặt',
            to: '/settings',
        },
    ];

    return (
        <div>
            <Sheet>
                <SheetTrigger>
                    <CiMenuBurger size={20} />
                </SheetTrigger>
                <SheetContent side={'left'}>
                    <SheetHeader>
                        <SheetTitle>Chuyển hướng</SheetTitle>
                        <ul className="px-2 py-4">
                            {menus.map((menu) => {
                                if (menu.to) {
                                    return (
                                        <li key={menu.id}>
                                            <Link
                                                className="flex w-full hover:bg-secondary/30 px-2 py-2 rounded"
                                                href={menu.to}
                                            >
                                                {menu.label}
                                            </Link>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li key={menu.id}>
                                            <ButtonNavigation title={menu.label} extandMenu={menu.children} />
                                        </li>
                                    );
                                }
                            })}
                        </ul>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default Sidebar;
