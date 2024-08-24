'use client';

import { ReactNode } from 'react';
import BackButton from './back-button';

type Props = { title?: string; backButton?: boolean; children?: ReactNode };

const Heading = ({ title, backButton, children }: Props) => {
    return (
        <div className="flex items-center gap-x-2 mb-6 mt-6">
            {backButton && <BackButton />}
            <h1 className="text-lg md:text-xl">{title}</h1>
            {children && children}
        </div>
    );
};

export default Heading;
