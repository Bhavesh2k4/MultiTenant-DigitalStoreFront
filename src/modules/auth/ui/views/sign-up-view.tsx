"use client"
import React from 'react'
import { Form , FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import { registerSchema } from '../../schemas';
import Link from 'next/link';
import { Boldonse } from 'next/font/google';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const boldonse = Boldonse({
  subsets: ['latin'],
  weight: ['400'],
});

const SignUpView = () => {
  const router =useRouter();

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const register = useMutation(trpc.auth.register.mutationOptions(
    {
      onError: (error) => {
        toast.error(error.message || 'An error occurred during registration');
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push('/');
      }
    }
  ));
  const form = useForm<z.infer<typeof registerSchema>>({
    mode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    register.mutate(values);
  };
  const username=form.watch('username');
  const usernameErrors = form.formState.errors.username;
  const showPreview = username && !usernameErrors;
  return (
    <div className='grid grid-cols-1 lg:grid-cols-5'>
        <div className="h-screen w-full lg:col-span-2 hidden lg:block" style={{ backgroundImage: 'url(/auth-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 p-4 lg:p-14">
                <div className='flex items-center justify-between b-8'>
                  <Button asChild variant={'elevated'} size={'sm'} className='bg-black text-white hover:bg-pink-400'>
                    <Link prefetch href='/sign-in'>Sign In</Link>
                  </Button>
                  <Link href='/'>
                    <span className={cn("text-2xl font-semibold", boldonse.className, "text-black" )}>Mercado</span>
                  </Link>
                </div>
                <h1 className='text-4xl font-medium'>
                  The digital products marketplace
                </h1>
                <FormField 
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your username' {...field} />
                    </FormControl>
                    <FormDescription className={cn("hidden", showPreview && "block")}>
                      Your Store Subdomain will be &nbsp;
                      <strong>{username}</strong>.shop.com
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField 
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <FormField 
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-base'>Password</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter your Password' {...field}  type='password'/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <Button disabled={register.isPending} type='submit' size="lg" variant="elevated" className='bg-black text-white hover:bg-pink-400 hover:text-primary'>
                  Sign Up
                </Button>

              </form> 
            </Form>

        </div>
    </div>
  )
}

export default SignUpView