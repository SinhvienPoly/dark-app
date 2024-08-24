import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const AuthLayout = ({ children }: Props) => {
    return <div className="max-w-full mx-auto h-screen flex items-center justify-center bg-primary">{children}</div>;
};

export default AuthLayout;
