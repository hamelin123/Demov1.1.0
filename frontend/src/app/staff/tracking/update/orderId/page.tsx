// frontend/src/app/staff/tracking/update/[orderId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useI18n } from '@/i18n';
import { orderService, trackingService } from '@/services/api';
import { ArrowLeft, MapPin, TruckIcon, AlertCircle, Check } from 'lucide-react';

// สถานะที่เป็นไปได้ของการจัดส่ง
const SHIPMENT_STATUSES = [
  'pending',
  'processing',
  'in-transit',
  'out-for-delivery',
  'delivered',
  'cancelled',
  'delayed',
  'returned'
];

export default function UpdateTrackingPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    notes: ''
  });

  // Fetch order and tracking data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch order details
        const orderResponse = await orderService.getById(orderId as string);
        setOrder(orderResponse.order);
        
        // Fetch tracking events
        const trackingResponse = await trackingService.getByOrderId(orderId as string);
        setTrackingEvents(trackingResponse.trackingEvents || []);
        
        // Set initial status from the latest tracking event
        if (trackingResponse.trackingEvents && trackingResponse.trackingEvents.length > 0) {
          const latestEvent = trackingResponse.trackingEvents[0];
          setFormData(prev => ({
            ...prev,
            status: latestEvent.status || ''
          }));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(t('errors.failedToLoadData'));
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchData();
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
      if (!formData.status) {
        throw new Error(t('tracking.statusRequired'));
      }

      await trackingService.addEvent({
        orderId: orderId as string,
        status: formData.status,
        location: formData.location,
        notes: formData.notes
      });

      setSuccess(true);
      
      // Clear form after success
      setFormData({
        status: formData.status, // Keep the selected status
        location: '',
        notes: ''
      });

      // Refresh tracking events
      const trackingResponse = await trackingService.getByOrderId(orderId as string);
      setTrackingEvents(trackingResponse.trackingEvents || []);

      // Auto-redirect after success
      setTimeout(() => {
        router.push(`/staff/orders/${orderId}`);
      }, 2000);
    } catch (err) {
      console.error('Error updating tracking:', err);
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
          <TruckIcon size={24} className="mr-2 text-blue-600 dark:text-blue-400" />
          {t('tracking.updateLocationFor')} {order.order_number}
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{t('order.details')}</h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="mb-1">
                <span className="font-medium">{t('order.orderNumber')}:</span> {order.order_number}
              </p>
              <p className="mb-1">
                <span className="font-medium">{t('order.currentStatus')}:</span> {t(`order.statusTypes.${order.status}`)}
              </p>
              <p className="mb-1">
                <span className="font-medium">{t('order.createdAt')}:</span> {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="mb-1">
                <span className="font-medium">{t('order.sender')}:</span> {order.sender_name}
              </p>
              <p className="mb-1">
                <span className="font-medium">{t('order.recipient')}:</span> {order.recipient_name}
              </p>
              <p>
                <span className="font-medium">{t('order.estimatedDelivery')}:</span> {
                  order.estimated_delivery_date
                    ? new Date(order.estimated_delivery_date).toLocaleDateString()
                    : t('order.notSpecified')
                }
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
            <p>{t('tracking.locationUpdatedSuccessfully')}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block mb-2 font-medium">
                {t('tracking.status')} *
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">{t('tracking.selectStatus')}</option>
                {SHIPMENT_STATUSES.map(status => (
                  <option key={status} value={status}>
                    {t(`order.statusTypes.${status}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block mb-2 font-medium">
                {t('tracking.location')} *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t('tracking.locationPlaceholder')}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="notes" className="block mb-2 font-medium">
              {t('tracking.notes')}
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder={t('tracking.notesPlaceholder')}
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
              {submitting ? t('common.submitting') : t('tracking.updateLocation')}
            </button>
          </div>
        </form>

        {/* Tracking History */}
        <div>
          <h2 className="text-lg font-semibold mb-4">{t('tracking.trackingHistory')}</h2>
          
          {trackingEvents.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-0 h-full border-l-2 border-gray-300 dark:border-gray-600"></div>
              
              {/* Timeline events */}
              <div className="space-y-8 mb-8">
                {trackingEvents.map((event, index) => (
                  <div key={event.id || index} className="ml-12 relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-10 mt-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600">
                      <div className={`w-3 h-3 rounded-full ${
                        event.status === 'delivered'
                          ? 'bg-green-500'
                          : event.status === 'cancelled' || event.status === 'delayed'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                      }`}></div>
                    </div>
                    
                    {/* Event content */}
                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h3 className="text-lg font-medium">{t(`order.statusTypes.${event.status}`)}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      {event.location && (
                        <div className="mt-2 flex items-center text-gray-700 dark:text-gray-300">
                          <MapPin size={16} className="mr-1 text-gray-500 dark:text-gray-400" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      {event.notes && (
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
              {t('tracking.noTrackingHistory')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}