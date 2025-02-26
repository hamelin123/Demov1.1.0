'use client';

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Input, Textarea, Button } from '@nextui-org/react';
import { User, Mail, MessageSquare, Building, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

interface FormStatus {
  submitted: boolean;
  success: boolean;
  message: string;
}

const ContactForm: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): { valid: boolean; message: string } => {
    const { name, email, message } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.trim()) {
      return { 
        valid: false, 
        message: t('contact.form.errorName') 
      };
    }

    if (!email.trim() || !emailRegex.test(email)) {
      return { 
        valid: false, 
        message: t('contact.form.errorEmail') 
      };
    }

    if (!message.trim()) {
      return { 
        valid: false, 
        message: t('contact.form.errorMessage') 
      };
    }

    return { valid: true, message: '' };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.valid) {
      setFormStatus({
        submitted: true,
        success: false,
        message: validation.message
      });
      return;
    }

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      setFormStatus({
        submitted: true,
        success: true,
        message: t('contact.form.successMessage')
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: t('contact.form.errorSubmit')
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formStatus.submitted && (
        <div 
          className={`
            p-4 rounded-md 
            ${formStatus.success 
              ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
              : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
            }
          `}
        >
          {formStatus.message}
        </div>
      )}

      <Input
        type="text"
        label={t('contact.form.name')}
        name="name"
        value={formData.name}
        onChange={handleChange}
        startContent={<User className="text-default-400" />}
        variant="bordered"
      />

      <Input
        type="email"
        label={t('contact.form.email')}
        name="email"
        value={formData.email}
        onChange={handleChange}
        startContent={<Mail className="text-default-400" />}
        variant="bordered"
      />

      <Input
        type="text"
        label={t('contact.form.company')}
        name="company"
        value={formData.company}
        onChange={handleChange}
        startContent={<Building className="text-default-400" />}
        variant="bordered"
      />

      <Input
        type="tel"
        label={t('contact.form.phone')}
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        startContent={<PhoneCall className="text-default-400" />}
        variant="bordered"
      />

      <Textarea
        label={t('contact.form.message')}
        name="message"
        value={formData.message}
        onChange={handleChange}
        startContent={<MessageSquare className="text-default-400" />}
        variant="bordered"
        minRows={4}
      />

      <Button 
        type="submit" 
        color="primary" 
        fullWidth 
        size="lg"
      >
        {t('contact.form.submit')}
      </Button>
    </form>
  );
};

export default ContactForm;