
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import { ArrowRight, ArrowLeft, Eye, EyeOff, Mail } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { getBackendUrl } from '@/lib/backend-url';

const GoogleIcon = () => (
    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
)

const EmailView = ({ onContinue }: { onContinue: (email: string) => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        onContinue(email);
    };

    const handleGoogleLogin = () => {
        // Redirect to Google OAuth
        const backendUrl = getBackendUrl();
        window.location.href = `${backendUrl}/auth/google`;
    };

    return (
        <>
            <DialogHeader className="items-center text-center -mt-2 mb-4">
                <Logo />
                <DialogTitle className="text-2xl font-black pt-4">
                YOUR RETAG BENEFITS AWAIT
                </DialogTitle>
            </DialogHeader>
            <div className="text-center text-sm text-muted-foreground">
              Log in or sign up (it's free)
            </div>
            
            <div className="grid grid-cols-1 gap-2 mt-4">
                <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={handleGoogleLogin}
                >
                    <GoogleIcon /> Sign in with Google
                </Button>
            </div>
            
            <div className="flex items-center gap-4 py-2">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground">EMAIL ADDRESS *</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        required
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                    />
                </div>

                <Button type="submit" variant="default" className="w-full font-bold h-12 text-base mt-6">
                    CONTINUE <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </form>

            <p className="px-4 text-center text-xs text-muted-foreground mt-4">
                By clicking the "Continue" button, you are joining ReTag and agree to the{' '}
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                    Terms of Use
                </a>{' '}
                and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                    Privacy Policy
                </a>
                .
            </p>
        </>
    );
};

const PasswordView = ({ 
    email, 
    onSubmit, 
    onBack, 
    onForgotPassword,
    isSignup = false 
}: { 
    email: string;
    onSubmit: (password: string) => Promise<void>;
    onBack: () => void;
    onForgotPassword: () => void;
    isSignup?: boolean;
}) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSubmit(password);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            
            <DialogHeader className="items-center text-center -mt-2 mb-4">
                <Logo />
                <DialogTitle className="text-2xl font-black pt-4">
                  {isSignup ? 'WELCOME TO ReTag!' : 'WELCOME BACK!'}
                </DialogTitle>
            </DialogHeader>

            <div className="text-center text-sm text-muted-foreground px-4">
              {isSignup 
                ? 'Create a password to have full access to ReTag benefits, save your shipping details, and more.'
                : `Enter your password for ${email}`
              }
            </div>

            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="password">PASSWORD *</Label>
                    <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          required
                          className="pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                </div>
                {isSignup && (
                    <p className="text-xs text-muted-foreground">
                        Minimum 8 characters with at least one uppercase, one lowercase, one special character and a number.
                    </p>
                )}
                {!isSignup && (
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-primary hover:underline text-left"
                    >
                        Forgot your password?
                    </button>
                )}
                <Button 
                    type="submit" 
                    variant="default" 
                    className="w-full font-bold h-12 text-base"
                    disabled={isLoading}
                >
                    {isLoading ? 'Processing...' : (isSignup ? 'CREATE PASSWORD' : 'SIGN IN')} 
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
            </form>
        </>
    );
};

const ForgotPasswordView = ({
    email,
    onBack,
    onOTPSent
}: {
    email: string;
    onBack: () => void;
    onOTPSent: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendOTP = async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest('/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "OTP Sent!",
                    description: "Check your email for the 6-digit OTP code.",
                });
                onOTPSent();
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to send OTP",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            toast({
                title: "Connection Error",
                description: "Unable to send OTP. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            
            <DialogHeader className="items-center text-center -mt-2 mb-4">
                <Logo />
                <DialogTitle className="text-2xl font-black pt-4">
                  FORGOT PASSWORD
                </DialogTitle>
            </DialogHeader>

            <div className="text-center text-sm text-muted-foreground px-4">
              We'll send a 6-digit OTP to your email address to reset your password.
            </div>

            <div className="space-y-4 mt-6">
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="reset-email">EMAIL ADDRESS</Label>
                    <Input
                        id="reset-email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-muted"
                    />
                </div>
                
                <Button 
                    onClick={handleSendOTP}
                    variant="default" 
                    className="w-full font-bold h-12 text-base"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending OTP...' : 'SEND OTP'} 
                    {!isLoading && <Mail className="ml-2 h-5 w-5" />}
                </Button>
            </div>
        </>
    );
};

const OTPVerificationView = ({
    email,
    onBack,
    onPasswordReset
}: {
    email: string;
    onBack: () => void;
    onPasswordReset: (token: string) => Promise<void>;
}) => {
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "Please make sure both passwords are the same.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiRequest('/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Password Reset Successful!",
                    description: "Your password has been updated and you're now logged in.",
                });
                await onPasswordReset(data.token);
            } else {
                toast({
                    title: "Reset Failed",
                    description: data.message || "Failed to reset password",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast({
                title: "Connection Error",
                description: "Unable to reset password. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="absolute top-4 left-4"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            
            <DialogHeader className="items-center text-center -mt-2 mb-4">
                <Logo />
                <DialogTitle className="text-2xl font-black pt-4">
                  ENTER OTP
                </DialogTitle>
            </DialogHeader>

            <div className="text-center text-sm text-muted-foreground px-4">
              Enter the 6-digit OTP sent to your email and create a new password.
            </div>

            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="otp">OTP CODE *</Label>
                    <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        maxLength={6}
                        required
                        disabled={isLoading}
                        className="text-center text-lg font-mono tracking-widest"
                    />
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="new-password">NEW PASSWORD *</Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="new-password"
                            required
                            className="pr-10"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="confirm-password">CONFIRM PASSWORD *</Label>
                    <Input
                        type="password"
                        id="confirm-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <p className="text-xs text-muted-foreground">
                    Minimum 8 characters with at least one uppercase, one lowercase, one special character and a number.
                </p>

                <Button 
                    type="submit" 
                    variant="default" 
                    className="w-full font-bold h-12 text-base"
                    disabled={isLoading}
                >
                    {isLoading ? 'Resetting Password...' : 'RESET PASSWORD'} 
                    {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
            </form>
        </>
    );
};

export function LoginButton({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<'email' | 'password' | 'forgot-password' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const { loginWithToken } = useUser();
    const { toast } = useToast();

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            // Reset state when dialog is closed, with a delay for the animation
            setTimeout(() => {
              setView('email');
              setEmail('');
              setIsSignup(false);
            }, 300);
        }
    }

    const handleEmailContinue = async (enteredEmail: string) => {
        if (enteredEmail) {
            setEmail(enteredEmail);
            
            // Check if user exists by attempting to login
            try {
                const response = await apiRequest('/auth/check-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: enteredEmail }),
                });
                
                const data = await response.json();
                setIsSignup(!data.exists); // If user doesn't exist, it's a signup
                setView('password');
            } catch (error) {
                console.error('Error checking user:', error);
                // Default to signup if we can't check
                setIsSignup(true);
                setView('password');
            }
        }
    };

    const handlePasswordSubmit = async (password: string) => {
        try {
            const endpoint = isSignup ? '/auth/signup' : '/auth/login';
            const body = isSignup 
                ? { email, password, displayName: email.split('@')[0] }
                : { email, password };

            const response = await apiRequest(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                await loginWithToken(data.token);
                handleOpenChange(false);
                toast({
                    title: isSignup ? "Account created successfully!" : "Welcome back!",
                    description: isSignup 
                        ? "Your account has been created and you're now logged in."
                        : "You've been successfully logged in.",
                });
            } else {
                // Show error message
                toast({
                    title: "Authentication failed",
                    description: data.message || "Please check your credentials and try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Authentication error:', error);
            toast({
                title: "Connection error",
                description: "Unable to connect to the server. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleForgotPassword = () => {
        setView('forgot-password');
    };

    const handleOTPSent = () => {
        setView('otp');
    };

    const handlePasswordReset = async (token: string) => {
        await loginWithToken(token);
        handleOpenChange(false);
    };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-8">
        <DialogTitle className="sr-only">
          {view === 'email' && 'Sign In'}
          {view === 'password' && (isSignup ? 'Create Account' : 'Sign In')}
          {view === 'forgot-password' && 'Reset Password'}
          {view === 'otp' && 'Verify OTP'}
        </DialogTitle>
        {view === 'email' && (
          <EmailView onContinue={handleEmailContinue} />
        )}
        {view === 'password' && (
          <PasswordView
            email={email}
            onSubmit={handlePasswordSubmit}
            onBack={() => setView('email')}
            onForgotPassword={handleForgotPassword}
            isSignup={isSignup}
          />
        )}
        {view === 'forgot-password' && (
          <ForgotPasswordView
            email={email}
            onBack={() => setView('password')}
            onOTPSent={handleOTPSent}
          />
        )}
        {view === 'otp' && (
          <OTPVerificationView
            email={email}
            onBack={() => setView('forgot-password')}
            onPasswordReset={handlePasswordReset}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
