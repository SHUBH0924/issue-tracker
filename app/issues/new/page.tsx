"use client";
import { TextField, Button, Callout, Text } from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/validationSchema';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema)
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    return (
        <div className='max-w-xl'>
            {error && <Callout.Root className='mb-5' color='red'>
                <Callout.Text>{error}</Callout.Text>
            </Callout.Root>}

            <form
                onSubmit={handleSubmit(async (data) => {
                    try {
                        setIsLoading(true);
                        axios.post('/api/issues', data);
                        router.push('/issues');
                    } catch (error) {
                        setIsLoading(false);
                        setError('An unecpected error occured')
                    }
                })}
                className=' space-y-3' >
                <TextField.Root>
                    <TextField.Input placeholder='Title' {...register('title')} />
                </TextField.Root>
                <ErrorMessage>{errors.title?.message}</ErrorMessage>
                <Controller
                    name='description'
                    control={control}
                    render={({ field }) => <SimpleMDE placeholder="Write Issue" {...field} />}
                />
                <ErrorMessage>{errors.description?.message}</ErrorMessage>
                <Button className='float-end' disabled={isLoading}>
                    Submit Issue {isLoading && <Spinner/>}
                </Button>
            </form>
        </div>
    )
}

export default NewIssuePage