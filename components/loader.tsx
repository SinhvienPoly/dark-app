import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {};

const Loader = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/45 z-[503]',
                className,
            )}
        >
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                    <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
