'use client';

import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();

    return (
        <Button onClick={() => router.back()} variant="default" size="icon">
            <MdOutlineKeyboardArrowLeft size={16} />
        </Button>
    );
};

export default BackButton;
