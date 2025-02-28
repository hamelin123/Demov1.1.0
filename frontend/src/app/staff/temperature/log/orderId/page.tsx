// frontend/src/app/staff/temperature/log/[orderId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/i18n';
import { orderService, temperatureService } from '@/services/api';
import { ArrowLeft, ThermometerSnowflake, AlertCircle, Check } from 'lucide-react';

export default function AddTemperatureLogPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    temperature: '',
    humidity: '',
    notes: ''
  });

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await orderService.getById(orderId as string);
        setOrder(response.order);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(t('errors.failedToLoadOrder'));
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const temperature = parseFloat(formData.temperature);
      if (isNaN(temperature)) {
        throw new Error(t('temperature.invalidTemperature'));
      }

      let humidity = null;
      if (formData.humidity) {
        humidity = parseFloat(formData.humidity);
        if (isNaN(humidity) || humidity < 0 || humidity > 100) {
          throw new Error(t('temperature.invalidHumidity'));
        }
      }

      await temperatureService.addLog({
        orderId: orderId as string,
        temperature,
        humidity,
        notes: formData.notes
      });

      setSuccess(true);
      setFormData({
        temperature: '',
        humidity: '',
        notes: ''
      });

      // Auto-redirect after success
      setTimeout(() => {
        router.push(`/staff/orders/${orderId}`);
      }, 2000);
    } catch (err) {
      console.error('Error submitting temperature log:', err);
      setError(err.message || t('errors.failedToSubmit'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
          <p>{error || t('errors.orderNotFound')}</p>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft size={16} className="mr-1" />
          {t('common.goBack')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ArrowLeft size={16} className="mr-1" />
        {t('common.goBack')}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ThermometerSnowflake size={24} className="mr-2 text-blue-600 dark:text-blue-400" />
          {t('temperature.addLogFor')} {order.order_number}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">{t('order.details')}</h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <p className="mb-1">
                <span className="font-medium">{t('order.orderNumber')}:</span> {order.order_number}
              </p>
              <p className="mb-1">
                <span className="font-medium">{t('order.status')}:</span> {t(`order.statusTypes.${order.status}`)}
              </p>
              <p className="mb-1">
                <span className="font-medium">{t('order.sender')}:</span> {order.sender_name}
              </p>
              <p className="mb-1">
                <span className="font-medium">{t('order.recipient')}:</span> {order.recipient_name}
              </p>
              <p>
                <span className="font-medium">{t('order.productType')}:</span> {order.product_type || t('order.notSpecified')}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">{t('temperature.temperatureRequirements')}</h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              {/* This would be product-specific in a real application */}
              <p className="mb-1">
                <span className="font-medium">{t('temperature.acceptableRange')}:</span> -20°C to -15°C
              </p>
              <p className="mb-1">
                <span className="font-medium">{t('temperature.criticalThreshold')}:</span> Below -22°C or above -13°C
              </p>
              <p>
                <span className="font-medium">{t('temperature.recordFrequency')}:</span> {t('temperature.everyFourHours')}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-start">
            <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg flex items-start">
            <Check size={20} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{t('temperature.logAddedSuccessfully')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="temperature" className="block mb-2 font-medium">
                {t('temperature.temperature')} (°C) *
              </label>
              <input
                type="text"
                id="temperature"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="-18.5"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('temperature.enterCurrentTemperature')}
              </p>
            </div>

            <div>
              <label htmlFor="humidity" className="block mb-2 font-medium">
                {t('temperature.humidity')} (%)
              </label>
              <input
                type="text"
                id="humidity"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                placeholder="65.0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('temperature.optionalHumidity')}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="notes" className="block mb-2 font-medium">
              {t('temperature.notes')}
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t('temperature.enterAnyObservations')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            ></textarea>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 mr-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={submitting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={submitting}
            >
              {submitting ? t('common.submitting') : t('temperature.submitReading')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}