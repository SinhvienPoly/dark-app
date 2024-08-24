import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Session } from 'next-auth';
import { signOut } from '@/auth';
import { Button } from '@/components/ui/button';

type CardProps = React.ComponentProps<typeof Card> & {
    session?: Session | null;
};

const SettingCard = ({ className, session, ...props }: CardProps) => {
    const notifications = [
        {
            title: `Xin chào ${session?.user.username?.toUpperCase()}`,
            description: new Date(Date.now()).toLocaleDateString(),
        },
        {
            title: 'Click vào thanh menu để có thể chuyển hướng đến những trang khác',
            description: '',
        },
        {
            title: <a href="/videos/new">Tạo video 👈</a>,
            description: '',
        },
    ];

    return (
        <Card className={cn('w-full', className)} {...props}>
            <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div>
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                        >
                            <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                            </div>
                        </div>
                    ))}
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <Button>Đăng xuất</Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
};

export default SettingCard;
