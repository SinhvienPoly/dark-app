'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { categorySchema } from '@/schema';
import { useState, useTransition } from 'react';
import ResponseMessage from '@/components/response-message';
import Heading from '@/components/heading';
import { Category } from '@prisma/client';
import { restApi } from '@/lib/axios';
import { useRouter } from 'next/navigation';

type Props = {
    data: Category | null;
};

const CategoryUpdateForm = ({ data }: Props) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof categorySchema>>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            title: data?.title,
        },
    });

    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = (values: z.infer<typeof categorySchema>) => {
        startTransition(async () => {
            await restApi
                .put(`/api/category/${data?.id}`, values)
                .then((res) => {
                    setErrorMessage(res.data.errors);
                    setSuccessMessage(res.data.message);
                })
                .then(() => {
                    router.push('/categories');
                });
        });
    };

    return (
        <div className="max-w-full">
            <Heading title="Thêm mới danh mục" backButton />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên danh mục</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="danh mục..." {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {errorMessage && <ResponseMessage type="error">{errorMessage}</ResponseMessage>}
                    {successMessage && <ResponseMessage type="success">{successMessage}</ResponseMessage>}

                    <Button disabled={isPending} type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CategoryUpdateForm;
