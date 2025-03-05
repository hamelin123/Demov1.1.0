'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import Link from 'next/link';
import { MapPin, Truck, Thermometer, Calendar, Clock, ArrowLeft, User, Phone, Package, Info, AlertTriangle } from 'lucide-react';

export default function TrackingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const trackingId = params.id;
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // ดึงข้อมูลการขนส่ง
    const fetchShipment = async () => {
      try {
        // จำลองการโหลดข้อมูล
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // ข้อมูลจำลองสำหรับการทดสอบ
        const mockShipment = {
          id: trackingId,
          status: 'in-transit',
          customer: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '081-234-5678'
          },
          origin: 'Bangkok Warehouse, 123 Logistics Way, Bangkok 10110',
          destination: 'ABC Hospital, 456 Healthcare St, Chiang Mai 50000',
          currentLocation: {
            address: 'Highway 11, Lampang',
            coordinates: { lat: 18.2, lng: 99.5 },
            updatedAt: '2025-03-02T08:30:00Z'
          },
          vehicle: {
            id: 'TRK-001',
            registrationNumber: 'บท-1234',
            name: 'Truck XL-01',
            driverName: 'สมชาย มั่นคง',
            driverPhone: '081-234-5678'
          },
          temperature: {
            current: -19.2,
            min: -20.1,
            max: -18.5,
            expectedRange: '-20°C to -18°C',
            lastUpdated: '2025-03-02T08:30:00Z'
          },
          timeline: [
            {
              status: 'created',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-01T10:00:00Z',
              temperature: null,
              notes: 'Order created and confirmed'
            },
            {
              status: 'processing',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-01T14:30:00Z',
              temperature: -18.5,
              notes: 'Preparing for shipment'
            },
            {
              status: 'picked-up',
              location: 'Bangkok Warehouse',
              timestamp: '2025-03-01T16:00:00Z',
              temperature: -18.8,
              notes: 'Picked up by driver'
            },
            {
              status: 'in-transit',
              location: 'Ayutthaya Checkpoint',
              timestamp: '2025-03-01T18:30:00Z',
              temperature: -19.2,
              notes: 'Passed through checkpoint'
            },
            {
              status: 'in-transit',
              location: 'Nakhon Sawan',
              timestamp: '2025-03-01T22:15:00Z',
              temperature: -19.0,
              notes: 'Driver rest stop'
            },
            {
              status: 'in-transit',
              location: 'Lampang',
              timestamp: '2025-03-02T08:30:00Z',
              temperature: -19.2,
              notes: 'Currently on Highway 11'
            }
          ],
          estimatedDelivery: '2025-03-02T14:00:00Z',
          items: [
            {
              name: 'Frozen Medical Samples',
              quantity: 3,
              temperature: '-20°C to -18°C'
            }
          ],
          alerts: [
            {
              type: 'temperature',
              timestamp: '2025-03-01T19:45:00Z',
              message: 'Temperature briefly rose to -17.9°C',
              severity: 'low',
              resolved: true
            }
          ]
        };
        
        setShipment(mockShipment);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shipment:', error);
        setLoading(false);
      }
    };
    
    if (mounted && !isLoading) {
      fetchShipment();
    }
  }, [mounted, trackingId, router, isAuthenticated, isLoading, currentUser]);

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading || loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // ถ้าไม่พบข้อมูลการขนส่ง
  if (!shipment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">
              {language === 'en' ? 'Shipment not found' : 'ไม่พบข้อมูลการขนส่ง'}
            </h2>
          </div>
          <Link 
            href="/admin/tracking"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'en' ? 'Back to Tracking' : 'กลับไปหน้าการติดตาม'}
          </Link>
        </div>
      </div>
    );
  }

  // Translations
  const translations = {
    en: {
      trackingDetails: 'Tracking Details',
      status: 'Status',
      created: 'Created',
      processing: 'Processing',
      pickedUp: 'Picked Up',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      customerInfo: 'Customer Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      shipmentInfo: 'Shipment Information',
      origin: 'Origin',
      destination: 'Destination',
      currentLocation: 'Current Location',
      estimatedDelivery: 'Estimated Delivery',
      vehicleInfo: 'Vehicle Information',
      vehicle: 'Vehicle',
      driver: 'Driver',
      temperature: 'Temperature',
      currentTemp: 'Current',
      expectedRange: 'Expected Range',
      lastUpdated: 'Last Updated',
      shipmentItems: 'Shipment Items',
      item: 'Item',
      quantity: 'Quantity',
      tempRequirement: 'Temperature Requirement',
      timeline: 'Shipment Timeline',
      time: 'Time',
      location: 'Location',
      notes: 'Notes',
      temp: 'Temp',
      alerts: 'Alerts',
      alertType: 'Type',
      message: 'Message',
      severity: 'Severity',
      resolved: 'Resolved',
      yes: 'Yes',
      no: 'No',
      backToTracking: 'Back to Tracking',
      temperatureAlert: 'Temperature Alert',
      systemAlert: 'System