'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ButtonHTMLAttributes, Fragment, useContext, useState } from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';
import { ToggleSidebarContext } from '@/app/context/root';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    title?: string;
    extandMenu?: any[];
};

const ButtonNavigation = ({ children, className, title, extandMenu, ...props }: Props) => {
    const [extand, setExtand] = useState<boolean>(false);

    const { toggleSidebar } = useContext(ToggleSidebarContext);

    return (
        <Fragment>
            <button
                onClick={() => setExtand(!extand)}
                {...props}
                className={cn(
                    'flex w-full items-center justify-between hover:bg-secondary/30 px-2 py-2 rounded',
                    className,
                )}
            >
                <span>{title}</span>
                <span>
                    <MdKeyboardArrowRight
                        className={cn('transition-all', {
                            'rotate-90': extand,
                        })}
                    />
                </span>
            </button>
            <AnimatePresence>
                {extandMenu && (
                    <motion.ul
                        animate={
                            extand
                                ? { height: 'auto', visibility: 'visible', opacity: 1 }
                                : { height: 0, visibility: 'hidden', opacity: 0 }
                        }
                        transition={{ duration: 0.1 }}
                        exit={{ height: 0 }}
                    >
                        {extandMenu?.map((child) => (
                            <li className="hover:bg-secondary/30 px-1 py-1 rounded" key={child.id}>
                                <Link
                                    onClick={() => {
                                        setExtand(false);
                                        toggleSidebar();
                                    }}
                                    className="flex pl-4 pr-2"
                                    href={child.to}
                                >
                                    {child.label}
                                </Link>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </Fragment>
    );
};

export default ButtonNavigation;
