'use client';

import { useState } from 'react';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-50">
      <div className="relative w-full max-w-md">
        <div
          className={`transition-all duration-500 ease-in-out ${
            isLogin
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 -translate-x-4 pointer-events-none absolute inset-0'
          }`}
          style={{ zIndex: isLogin ? 10 : 0 }}
        >
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        </div>
        <div
          className={`transition-all duration-500 ease-in-out ${
            !isLogin
              ? 'opacity-100 translate-x-0 pointer-events-auto'
              : 'opacity-0 translate-x-4 pointer-events-none absolute inset-0'
          }`}
          style={{ zIndex: !isLogin ? 10 : 0 }}
        >
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        </div>
      </div>
    </div>
  );
}