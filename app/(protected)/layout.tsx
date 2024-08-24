import { ReactNode } from 'react';
import Sidebar from '../ui/sidebar';
import { cn } from '@/lib/utils';

type Props = {
    children: ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
    return (
        <div className="bg-primary h-screen flex items-center py-4">
            <div className="w-[800px] mx-auto relative bg-secondary rounded-lg p-4 overflow-y-auto h-full">
                <Sidebar />
                <div className={cn('pt-4 px-4', 'transition-all')}>{children}</div>
            </div>
        </div>
    );
};

export default ProtectedLayout;
