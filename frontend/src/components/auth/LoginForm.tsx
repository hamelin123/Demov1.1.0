// src/components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { Mail, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LoginForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <Input
        type="email"
        label={t('auth.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        startContent={<Mail className="text-gray-400" size={20} />}
        required
      />
      <Input
        type="password"
        label={t('auth.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        startContent={<Lock className="text-gray-400" size={20} />}
        required
      />
      <Button
        type="submit"
        color="primary"
        className="w-full"
        size="lg"
      >
        {t('auth.login')}
      </Button>
    </form>
  );
}