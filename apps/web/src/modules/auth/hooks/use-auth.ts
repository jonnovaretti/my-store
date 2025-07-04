'use client';

import { toast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth-api';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      queryClient.setQueryData(['user'], data.user);
      router.push('/');
      toast({
        title: 'Welcome back!',
        description: `Signed in as ${data.user.email}`,
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Login failed',
      });
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: data => {
      queryClient.setQueryData(['user'], data.user);
      router.push('/');
      toast({
        title: 'Welcome!',
        description: `Account created successfully`,
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Registration failed',
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      router.push('/');
      queryClient.setQueryData(['user'], null);
      toast({
        title: 'Signed out',
        description: 'You have been signed out',
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: 'Unexpected error happened while logout',
      });
    },
  });
}
