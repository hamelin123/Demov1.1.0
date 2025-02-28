'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Mail, Lock, AlertCircle} from 'lucide-react';
import {useLanguage} from '@/providers/LanguageProvider';
import {authService} from '@/services/api';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({onSuccess}: LoginFormProps) {
  const router = useRouter();
  const {language} = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({email: '', password: '', rememberMe: false});

  const t = {
    en: {
      email: 'Email', password: 'Password', rememberMe: 'Remember me',
      login: 'Sign in', forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?", register: 'Register',
      invalidCredentials: 'Invalid email or password',
      emailRequired: 'Email is required', passwordRequired: 'Password is required',
    },
    th: {
      email: 'อีเมล', password: 'รหัสผ่าน', rememberMe: 'จดจำฉัน',
      login: 'เข้าสู่ระบบ', forgotPassword: 'ลืมรหัสผ่าน?',
      noAccount: 'ยังไม่มีบัญชี?', register: 'ลงทะเบียน',
      invalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
      emailRequired: 'กรุณากรอกอีเมล', passwordRequired: 'กรุณากรอกรหัสผ่าน',
    }
  }[language];

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setFormData({...formData, [name]: type === 'checkbox' ? checked : value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email) return setError(t.emailRequired);
    if (!formData.password) return setError(t.passwordRequired);
    
    setIsLoading(true);
    
    try {
      const response = await authService.login(formData.email, formData.password);
      
      if (formData.rememberMe) {
        document.cookie = `rememberUser=true; max-age=${60*60*24*30}`;
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(response.user.role === 'admin' 
          ? '/admin/dashboard' 
          : response.user.role === 'staff' 
            ? '/staff/dashboard' 
            : '/dashboard');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(t.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-200 flex">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">{t.email}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email" name="email" type="email" autoComplete="email" required
              value={formData.email} onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">{t.password}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password" name="password" type="password" autoComplete="current-password" required
              value={formData.password} onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 rounded-md border"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe" name="rememberMe" type="checkbox"
              checked={formData.rememberMe} onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm">{t.rememberMe}</label>
          </div>
          
          <Link href="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            {t.forgotPassword}
          </Link>
        </div>
        
        <button
          type="submit" disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {`${t.login}...`}
            </>
          ) : t.login}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t.noAccount}{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {t.register}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}