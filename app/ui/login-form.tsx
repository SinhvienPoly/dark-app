'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/schema';
import { useState, useTransition } from 'react';
import { login } from '@/actions/auth';
import ResponseMessage from '@/components/response-message';
import { useSearchParams } from 'next/navigation';

const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        startTransition(() => {
            login(values, callbackUrl!).then((data) => {
                setErrorMessage(data?.errors!);
            });
        });
    };

    return (
        <div className="px-4 py-4 w-[400px] bg-secondary rounded-lg max-w-full">
            <h1 className="mt-4 my-2 font-semibold">Đăng nhập tài khoản của bạn</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} placeholder="example@gmail.com" {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input disabled={isPending} type="password" placeholder="..." {...field} />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {errorMessage && <ResponseMessage type="error">{errorMessage}</ResponseMessage>}

                    <Button disabled={isPending} type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;
