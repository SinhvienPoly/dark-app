'use client';

import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

type Props = {
    children: ReactNode;
};

type ToggleContextProps = {
    isOpenSidebar: boolean;
    toggleSidebar: () => void;
    setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
};

export const ToggleSidebarContext = createContext<ToggleContextProps>({
    isOpenSidebar: false,
    toggleSidebar: () => {},
    setIsOpenSidebar: () => false,
});

const queryClient = new QueryClient();

const RootContext = ({ children }: Props) => {
    const [isOpenSidebar, setIsOpenSidebar] = useState<boolean>(false);
    const [showChild, setShowChild] = useState<boolean>(false);

    useEffect(() => {
        setShowChild(true);
    }, []);

    const toggleSidebar = () => {
        setIsOpenSidebar(!isOpenSidebar);
    };

    if (!showChild) {
        return null;
    }

    if (typeof window === 'undefined') {
        return <></>;
    } else {
        return (
            <QueryClientProvider client={queryClient}>
                <ToggleSidebarContext.Provider value={{ isOpenSidebar, toggleSidebar, setIsOpenSidebar }}>
                    {children}
                    <Toaster />
                </ToggleSidebarContext.Provider>
            </QueryClientProvider>
        );
    }
};

export default RootContext;
