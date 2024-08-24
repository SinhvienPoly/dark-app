'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup } from './ui/radio-group';
import Loader from './loader';

import { ChangeEvent, ReactNode, useState } from 'react';

import Image from 'next/image';
import { Image as ImageType } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { restApi } from '@/lib/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Props = {
    onSave?: (file: ImageType) => void;
    children?: ReactNode;
};

const FormUpload = ({ onSave, children }: Props) => {
    const searchParams = useSearchParams();

    const queryClient = useQueryClient();

    const handleQueryType = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set('type', value);
        } else {
            params.delete('type');
        }
    };

    const [dialog, setDialog] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [file, setFile] = useState<ImageType | null>(null);

    const onOpen = (open: boolean) => {
        setDialog(open);
    };

    const onChange = (item: ImageType) => {
        setFile(item);
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await restApi.post('/api/uploads', formData);
                    setMessage(response.data.message);
                } catch (error) {
                    setMessage(`Upload failed: ${(error as Error).message}`);
                }
            }
        }
    };

    const { data: filesData, isLoading } = useQuery<{ data: ImageType[] }>({
        queryKey: ['files'],
        queryFn: async () => {
            const response = await restApi.get('/api/uploads');

            return response.data;
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (e: ChangeEvent<HTMLInputElement>) => handleFileChange(e),
        onSuccess: (data) => {
            console.log('SUCCESS', data);

            queryClient.invalidateQueries({ queryKey: ['files'] });

            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },

        onError: (error) => {
            console.log('ERROR', error);
        },
    });

    return (
        <Dialog onOpenChange={onOpen} open={dialog}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-secondary text-black space-y-2">
                <DialogHeader>
                    <DialogTitle>Chọn tệp</DialogTitle>
                </DialogHeader>

                <div>
                    {message && (
                        <div className="bg-primary text-secondary absolute rounded px-2 py-1 left-2 bottom-2 text-sm">
                            {message}
                        </div>
                    )}

                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="picture">Picture</Label>
                        <Input name="file" type="file" multiple={true} onChange={mutate} />
                    </div>
                    <div className="border-t border-gray-400">
                        <div className="mt-4">
                            <Select onValueChange={handleQueryType} defaultValue={searchParams.get('type')?.toString()}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Lựa chọn tệp" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Định dạng file</SelectLabel>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="video">Dạng video</SelectItem>
                                        <SelectItem value="image">Dạng ảnh</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="overflow-x-auto overflow-y-auto">
                            <div className="mt-4 space-y-2 max-h-[200px] w-[130%] py-4">
                                {isPending && <Loader className="absolute" />}
                                <Label>Phương tiện hiện có</Label>
                                {isLoading ? (
                                    <Loader style={{ position: 'absolute' }} />
                                ) : (
                                    <RadioGroup className="gap-x-3">
                                        {filesData?.data?.length === 0 ? (
                                            <p>Không có phương tiện nào được tải lên</p>
                                        ) : (
                                            filesData?.data?.map((image) => {
                                                if (image?.type === 'video/mp4') {
                                                    return (
                                                        <div
                                                            key={image?.id}
                                                            className="space-x-2 relative grid grid-cols-5 place-content-start"
                                                        >
                                                            <div className="flex items-center gap-x-2 col-span-3">
                                                                <input
                                                                    type="radio"
                                                                    onChange={() => onChange(image)}
                                                                    value={image?.id}
                                                                    id={image?.id}
                                                                    name={'source'}
                                                                    className="text-red-500 border-gray-500 border-2"
                                                                />
                                                                <Label
                                                                    htmlFor={image?.id}
                                                                    className="cursor-pointer !m-0 flex gap-x-2 items-center"
                                                                >
                                                                    <video width={30} height={30} autoPlay={false}>
                                                                        <source src={image?.url!} />
                                                                    </video>
                                                                    <p className="">
                                                                        {image?.name?.length! > 50
                                                                            ? image.name?.slice(0, 50)
                                                                            : image.name}
                                                                    </p>
                                                                </Label>
                                                            </div>

                                                            <p className="col-span-1">{image?.type?.split('/')[0]}</p>

                                                            <p className="col-span-1 ">
                                                                {new Date(image?.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    );
                                                } else {
                                                    return (
                                                        <div
                                                            key={image?.id}
                                                            className="space-x-2 relative grid grid-cols-5 place-content-center place-items-start"
                                                        >
                                                            <div className="flex items-center gap-x-2 col-span-3">
                                                                <input
                                                                    type="radio"
                                                                    onChange={() => onChange(image)}
                                                                    value={image?.id}
                                                                    id={image?.id}
                                                                    name={'source'}
                                                                    className="text-red-500 border-gray-500 border-2"
                                                                />
                                                                <Label
                                                                    htmlFor={image?.id}
                                                                    className="cursor-pointer !m-0 flex gap-x-2 items-center"
                                                                >
                                                                    <Image
                                                                        src={image?.url!}
                                                                        width={30}
                                                                        height={30}
                                                                        alt="image"
                                                                    />
                                                                    <p className="">
                                                                        {image?.name?.length! > 50
                                                                            ? image.name?.slice(0, 50)
                                                                            : image.name}
                                                                    </p>
                                                                </Label>
                                                            </div>

                                                            <p className="col-span-1 ">{image?.type?.split('/')[0]}</p>

                                                            <p className="col-span-1 ">
                                                                {new Date(image?.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        )}
                                    </RadioGroup>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => {
                            onSave!(file!);
                            setDialog(false);
                        }}
                        type="button"
                    >
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FormUpload;
