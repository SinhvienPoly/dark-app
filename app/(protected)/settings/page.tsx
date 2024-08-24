import SettingCard from '@/app/ui/setting';
import { auth } from '@/auth';

const SettingPage = async () => {
    const session = await auth();

    return (
        <div className="">
            <SettingCard session={session} />
        </div>
    );
};

export default SettingPage;
