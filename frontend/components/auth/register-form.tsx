// components/auth/RegisterForm.tsx
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

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    if (!username.trim()) return 'اسم المستخدم مطلوب';
    if (username.length < 3) return 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    if (!password) return 'كلمة المرور مطلوبة';
    if (password.length < 8) return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    if (password !== confirmPassword) return 'كلمات المرور غير متطابقة';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await register(username, password);
      onSwitchToLogin(); 
    } catch (err: any) {
      setError(err.message || 'فشل إنشاء الحساب');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle className="text-2xl text-right">إنشاء حساب</CardTitle>
        <CardDescription className="text-right">
          أنشئ حساباً جديداً للبدء
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
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <HugeiconsIcon icon={showPassword ? EyeOff : Eye} size={18} />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-right block">
              تأكيد كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-right pl-10"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <HugeiconsIcon icon={showConfirmPassword ? EyeOff : Eye} size={18} />
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500 text-right">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full mt-3" disabled={isLoading}>
            {isLoading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            لديك حساب بالفعل؟{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary underline-offset-4 mt-3 hover:underline"
            >
              تسجيل الدخول
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}