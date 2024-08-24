import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { CiWarning } from 'react-icons/ci';
import { GoCheck } from 'react-icons/go';

type Props = {
    children: ReactNode;
    type?: 'error' | 'success';
};

const ResponseMessage = ({ children, type }: Props) => {
    return (
        <div
            className={cn('p-2 mt-2 flex items-center rounded-lg', {
                'bg-red-200 text-red-500': type === 'error',
                'bg-green-200 text-green-500': type === 'success',
            })}
        >
            {type === 'success' && (
                <p className="gap-x-2 flex items-center">
                    <span>
                        <GoCheck size={16} />
                    </span>
                    <span>{children}</span>
                </p>
            )}
            {type === 'error' && (
                <p className="gap-x-2 flex items-center">
                    <span>
                        <CiWarning size={16} />
                    </span>
                    <span>{children}</span>
                </p>
            )}
        </div>
    );
};

export default ResponseMessage;
