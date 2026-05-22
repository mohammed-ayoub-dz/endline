// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HugeiconsIcon } from '@hugeicons/react';
import { Eye, EyeOff } from '@hugeicons/core-free-icons';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const route = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setIsLoading(true);
    try {
      await login(username, password);

      setTimeout(() => {
        route.push("/app")
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle className="text-2xl text-right">تسجيل الدخول</CardTitle>
        <CardDescription className="text-right">
          أدخل اسم المستخدم وكلمة المرور للوصول إلى حسابك
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-right block">
              اسم المستخدم
            </Label>
            <Input
              id="username"
              placeholder="أحمد"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-right"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-right block">
              كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-right pl-10"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <HugeiconsIcon icon={showPassword ? EyeOff : Eye} size={18} />
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-right">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full mt-3" disabled={isLoading}>
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            ليس لديك حساب؟{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary underline-offset-4  hover:underline"
            >
              إنشاء حساب
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}