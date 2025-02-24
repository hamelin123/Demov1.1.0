// src/components/auth/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';
import { User, Mail, Lock, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function RegisterForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement register logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      <Input
        type="text"
        label={t('auth.name')}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        startContent={<User className="text-gray-400" size={20} />}
        required
      />
      <Input
        type="email"
        label={t('auth.email')}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        startContent={<Mail className="text-gray-400" size={20} />}
        required
      />
      <Input
        type="tel"
        label={t('auth.phone')}
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        startContent={<Phone className="text-gray-400" size={20} />}
        required
      />
      <Input
        type="password"
        label={t('auth.password')}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        startContent={<Lock className="text-gray-400" size={20} />}
        required
      />
      <Input
        type="password"
        label={t('auth.confirmPassword')}
        value={formData.confirmPassword}
        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        startContent={<Lock className="text-gray-400" size={20} />}
        required
      />
      <Button
        type="submit"
        color="primary"
        className="w-full"
        size="lg"
      >
        {t('auth.register')}
      </Button>
    </form>
  );
}