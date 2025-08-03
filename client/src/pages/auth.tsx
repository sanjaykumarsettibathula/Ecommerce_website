import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register: registerUser, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle Google OAuth token in query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    if (error) {
      toast({
        title: 'Authentication Error',
        description: error === 'GoogleAuthFailed' ? 'Google authentication failed' : 
                    error === 'NoUser' ? 'No user found' :
                    error === 'TokenGenerationFailed' ? 'Failed to generate authentication token' :
                    'Authentication failed',
        variant: 'destructive',
      });
      return;
    }
    
    if (token) {
      localStorage.setItem('token', token);
      // Fetch user data and update auth state
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to validate token');
          }
          return response.json();
        })
        .then(userData => {
          console.log('Google OAuth successful:', userData);
          toast({
            title: 'Success',
            description: 'Successfully signed in with Google',
          });
          // Update auth context by triggering a page reload
          window.location.href = '/';
        })
        .catch((error) => {
          console.error('Google OAuth error:', error);
          localStorage.removeItem('token');
          toast({
            title: 'Error',
            description: 'Failed to authenticate with Google',
            variant: 'destructive',
          });
        });
    }
  }, [toast]);

  // Redirect if already logged in (fix: useEffect, not early return)
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      // Error handling is done in the auth context
      console.error('Login error:', error);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      navigate('/');
    } catch (error) {
      // Error handling is done in the auth context
      console.error('Register error:', error);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: 'Coming Soon',
      description: `${provider} login will be available soon!`,
    });
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Auth Toggle */}
      <Card className="mb-6">
        <CardContent className="p-1">
          <div className="flex">
            <Button
              variant={activeTab === 'login' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('login')}
              className="flex-1 rounded-lg"
            >
              Login
            </Button>
            <Button
              variant={activeTab === 'register' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('register')}
              className="flex-1 rounded-lg"
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Login Form */}
      {activeTab === 'login' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-secondary mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  {...loginForm.register('email')}
                  className="mt-1"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="login-password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    {...loginForm.register('password')}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    {...loginForm.register('rememberMe')}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <Button type="button" variant="link" className="text-sm p-0 h-auto">
                  Forgot password?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.location.href = '/api/auth/google'}
                >
                  <FaGoogle className="w-5 h-5" />
                  Continue with Google
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Register Form */}
      {activeTab === 'register' && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-secondary mb-2">Create Account</h2>
              <p className="text-gray-600">Join our community today</p>
            </div>

            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    type="text"
                    {...registerForm.register('firstName')}
                    className="mt-1"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    type="text"
                    {...registerForm.register('lastName')}
                    className="mt-1"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  {...registerForm.register('email')}
                  className="mt-1"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="register-password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    {...registerForm.register('password')}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...registerForm.register('confirmPassword')}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Controller
                  control={registerForm.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <Checkbox
                      id="agree-terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  )}
                />
                <Label htmlFor="agree-terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:text-blue-700 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="#" className="text-primary hover:text-blue-700 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {registerForm.formState.errors.agreeToTerms && (
                <p className="text-sm text-red-500">
                  {registerForm.formState.errors.agreeToTerms.message}
                </p>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
