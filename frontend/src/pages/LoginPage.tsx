import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ShoppingCart } from 'lucide-react';
import type { LoginRequest } from '@/types/user';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/';

    const loginMutation = useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: () => {
            navigate(from, { replace: true });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        loginMutation.mutate({ email, password });
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4'>
            <Card className='w-full max-w-md'>
                <CardHeader className='space-y-1 text-center'>
                    <div className='flex items-center justify-center gap-2 mb-2'>
                        <ShoppingCart className='h-6 w-6 text-blue-600' />
                        <h1 className='text-2xl font-bold text-blue-600'>GroceryApp</h1>
                    </div>
                    <CardTitle className='text-2xl'>Welcome back</CardTitle>
                    <CardDescription>Sign in to your account to manage your family grocery</CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className='space-y-4'>
                        {loginMutation.error && (
                            <Alert variant='destructive'>
                                <AlertDescription>
                                    {loginMutation.error instanceof Error
                                        ? loginMutation.error.message
                                        : 'Login failed. Please check your credentials and try again.'}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className='space-y-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={loginMutation.isPending}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='password'>Password</Label>
                            <Input
                                id='password'
                                type='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                disabled={loginMutation.isPending}
                            />
                        </div>

                        <div className='text-sm'>
                            <Link
                                to='/forgot-password'
                                className='text-blue-600 hover:text-blue-500 hover:underline'
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </CardContent>

                    <CardFooter className='flex flex-col space-y-4'>
                        <Button
                            type='submit'
                            className='w-full'
                            disabled={loginMutation.isPending || !email || !password}
                        >
                            {loginMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Sign in
                        </Button>

                        <div className='text-sm text-center text-gray-600'>
                            Don't have an account?{' '}
                            <Link
                                to='/register'
                                className='text-blue-600 hover:text-blue-500 hover:underline font-medium'
                            >
                                Create one here
                            </Link>
                        </div>

                        <div className='text-xs text-center text-gray-500'>
                            For family members: Ask your family admin for the family code to join
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
