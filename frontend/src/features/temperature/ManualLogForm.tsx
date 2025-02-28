// frontend/src/features/temperature/ManualLogForm.tsx
import { useState } from 'react';
import { useI18n } from '@/i18n';
import { temperatureService } from '@/services/api';
import { useRouter } from 'next/navigation';

interface ManualLogFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export const ManualLogForm = ({ orderId, onSuccess }: ManualLogFormProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate input
      const temp = parseFloat(formData.temperature);
      if (isNaN(temp)) {
        throw new Error(t('temperature.validationError'));
      }

      // Optional humidity
      let humidity;
      if (formData.humidity) {
        humidity = parseFloat(formData.humidity);
        if (isNaN(humidity) || humidity < 0 || humidity > 100) {
          throw new Error(t('temperature.humidityRangeError'));
        }
      }

      // Submit data
      await temperatureService.addLog({
        orderId,
        temperature: temp,
        humidity,
        notes: formData.notes
      });

      setSuccess(true);
      setFormData({
        temperature: '',
        humidity: '',
        notes: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t('temperature.addManualLog')}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-md">
          {t('temperature.logAddedSuccess')}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('temperature.temperature')} (°C) *
          </label>
          <input
            type="number"
            name="temperature"
            step="0.1"
            required
            value={formData.temperature}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="-18.5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('temperature.humidity')} (%)
          </label>
          <input
            type="number"
            name="humidity"
            step="0.1"
            min="0"
            max="100"
            value={formData.humidity}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="65.0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('temperature.notes')}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('temperature.notesPlaceholder')}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? t('common.submitting') : t('temperature.addLog')}
          </button>
        </div>
      </form>
    </div>
  );
};