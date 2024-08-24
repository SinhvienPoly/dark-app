import { getCategoryById } from '@/actions/category';
import CategoryUpdateForm from '@/app/ui/category-update-form';

type ParamsProps = {
    params: {
        id: string;
    };
};

const Page = async ({ params: { id } }: ParamsProps) => {
    const data = await getCategoryById(id);

    return <CategoryUpdateForm data={data!} />;
};

export default Page;
