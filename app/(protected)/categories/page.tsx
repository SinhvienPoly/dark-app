import { db } from '@/lib/db';
import { DataTable } from './data-table';
import { columns } from './columns';

const Page = async () => {
    const categories = await db.category.findMany();

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={categories} />
        </div>
    );
};

export default Page;
