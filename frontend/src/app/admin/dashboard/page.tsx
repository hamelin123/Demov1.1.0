// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, ShoppingBag, Truck, Thermometer, AlertTriangle,
  TrendingUp, Calendar, ArrowRight, User, Package, 
  Clipboard, DollarSign
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Translations
  const translations = {
    th: {
      dashboard: 'แดชบอร์ด',
      welcome: 'ยินดีต้อนรับ',
      summary: 'สรุป',
      totalUsers: 'ผู้ใช้ทั้งหมด',
      totalOrders: 'คำสั่งซื้อทั้งหมด',
      activeShipments: 'การขนส่งที่กำลังดำเนินการ',
      temperatureAlerts: 'การแจ้งเตือนอุณหภูมิ',
      recentOrders: 'คำสั่งซื้อล่าสุด',
      viewAll: 'ดูทั้งหมด',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      customer: 'ลูกค้า',
      status: 'สถานะ',
      amount: 'จำนวนเงิน',
      date: 'วันที่',
      recentAlerts: 'การแจ้งเตือนล่าสุด',
      shipment: 'การขนส่ง',
      temperature: 'อุณหภูมิ',
      limit: 'ขีดจำกัด',
      time: 'เวลา',
      statusPending: 'รอดำเนินการ',
      statusInTransit: 'กำลังจัดส่ง',
      statusDelivered: 'จัดส่งแล้ว',
      statusCancelled: 'ยกเลิก',
      newUsers: 'ผู้ใช้ใหม่',
      newUsersThisWeek: 'ผู้ใช้ใหม่ในสัปดาห์นี้',
      noOrders: 'ไม่มีคำสั่งซื้อล่าสุด',
      noAlerts: 'ไม่มีการแจ้งเตือนอุณหภูมิล่าสุด',
      todaysRevenue: 'รายได้วันนี้',
      monthlyRevenue: 'รายได้รายเดือน',
      activeVehicles: 'ยานพาหนะที่ใช้งาน',
      pendingDeliveries: 'การจัดส่งที่รอดำเนินการ',
      recentUsers: 'ผู้ใช้ล่าสุด',
      recentlyJoined: 'เข้าร่วมเมื่อเร็วๆ นี้',
      noRecentUsers: 'ไม่มีผู้ใช้ล่าสุด'
    },
    en: {
      dashboard: 'Dashboard',
      welcome: 'Welcome',
      summary: 'Summary',
      totalUsers: 'Total Users',
      totalOrders: 'Total Orders',
      activeShipments: 'Active Shipments',
      temperatureAlerts: 'Temperature Alerts',
      recentOrders: 'Recent Orders',
      viewAll: 'View All',
      orderNumber: 'Order Number',
      customer: 'Customer',
      status: 'Status',
      amount: 'Amount',
      date: 'Date',
      recentAlerts: 'Recent Alerts',
      shipment: 'Shipment',
      temperature: 'Temperature',
      limit: 'Limit',
      time: 'Time',
      statusPending: 'Pending',
      statusInTransit: 'In Transit',
      statusDelivered: 'Delivered',
      statusCancelled: 'Cancelled',
      newUsers: 'New Users',
      newUsersThisWeek: 'New users this week',
      noOrders: 'No recent orders',
      noAlerts: 'No recent temperature alerts',
      todaysRevenue: 'Today\'s Revenue',
      monthlyRevenue: 'Monthly Revenue',
      activeVehicles: 'Active Vehicles',
      pendingDeliveries: 'Pending Deliveries',
      recentUsers: 'Recent Users',
      recentlyJoined: 'Recently joined',
      noRecentUsers: 'No recent users'
    }
  };

  const t = translations[language] || translations.en;

  // โหลดข้อมูลสำหรับแดชบอร์ด
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ในสถานการณ์จริง ควรดึงข้อมูลจาก API
        // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        // const response = await fetch(`${apiUrl}/admin/dashboard`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // ใช้ข้อมูลจำลองสำหรับการพัฒนา
        await new Promise(resolve => setTimeout(resolve, 1000)); // จำลองความล่าช้าของเครือข่าย
        
        const mockData = {
          stats: {
            totalUsers: 128,
            totalOrders: 1854,
            activeShipments: 43,
            temperatureAlerts: 5,
            newUsers: 12,
            todaysRevenue: 187500,
            monthlyRevenue: 3850000,
            activeVehicles: 15,
            pendingDeliveries: 27
          },
          recentOrders: [
            {
              id: '1',
              orderNumber: 'CC-20250227-1423',
              customer: 'บริษัท ฟาร์มาซี จำกัด',
              status: 'in-transit',
              amount: '฿32,500',
              date: '27 ก.พ. 2025'
            },
            {
              id: '2',
              orderNumber: 'CC-20250227-1422',
              customer: 'บริษัท อาหารเย็น จำกัด',
              status: 'delivered',
              amount: '฿18,750',
              date: '26 ก.พ. 2025'
            },
            {
              id: '3',
              orderNumber: 'CC-20250227-1421',
              customer: 'คลินิกวัคซีน',
              status: 'pending',
              amount: '฿8,900',
              date: '26 ก.พ. 2025'
            },
            {
              id: '4',
              orderNumber: 'CC-20250227-1420',
              customer: 'โรงพยาบาลสมิติเวช',
              status: 'delivered',
              amount: '฿42,000',
              date: '25 ก.พ. 2025'
            },
            {
              id: '5',
              orderNumber: 'CC-20250227-1419',
              customer: 'บริษัท วัคซีนไทย จำกัด',
              status: 'cancelled',
              amount: '฿15,300',
              date: '25 ก.พ. 2025'
            }
          ],
          recentAlerts: [
            {
              id: '1',
              shipment: 'CC-20250227-1423',
              temperature: '-16.8°C',
              limit: '-18.0°C to -20.0°C',
              time: '27 ก.พ. 2025 14:28'
            },
            {
              id: '2',
              shipment: 'CC-20250227-1420',
              temperature: '6.3°C',
              limit: '2.0°C to 6.0°C',
              time: '26 ก.พ. 2025 09:42'
            },
            {
              id: '3',
              shipment: 'CC-20250227-1418',
              temperature: '-14.5°C',
              limit: '-18.0°C to -22.0°C',
              time: '25 ก.พ. 2025 18:15'
            }
          ],
          recentUsers: [
            {
              id: '1',
              username: 'newuser1',
              fullName: 'สมชาย ใจดี',
              email: 'somchai@example.com',
              joinDate: '27 ก.พ. 2025'
            },
            {
              id: '2',
              username: 'newuser2',
              fullName: 'แก้วตา มีสุข',
              email: 'kaewta@example.com',
              joinDate: '26 ก.พ. 2025'
            },
            {
              id: '3',
              username: 'newuser3',
              fullName: 'วิชัย เก่งกาจ',
              email: 'wichai@example.com',
              joinDate: '25 ก.พ. 2025'
            }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // แสดง loading state
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.dashboard}</h1>
      
      {/* Summary Cards - First Row */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">{t.summary}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Users */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.totalUsers}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.stats.totalUsers}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>{dashboardData?.stats.newUsers}</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">{t.newUsersThisWeek}</span>
            </div>
          </div>
          
          {/* Total Orders */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.totalOrders}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.stats.totalOrders}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>3.2%</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">vs. last month</span>
            </div>
          </div>
          
          {/* Active Shipments */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.activeShipments}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.stats.activeShipments}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>8.1%</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">vs. last month</span>
            </div>
          </div>
          
          {/* Temperature Alerts */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.temperatureAlerts}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.stats.temperatureAlerts}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>2.3%</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">vs. last month</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Summary Cards - Second Row */}
      <section>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Today's Revenue */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.todaysRevenue}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ฿{dashboardData?.stats.todaysRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>5.2%</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">vs. yesterday</span>
            </div>
          </div>
          
          {/* Monthly Revenue */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.monthlyRevenue}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  ฿{dashboardData?.stats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>12.5%</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">vs. last month</span>
            </div>
          </div>
          
          {/* Active Vehicles */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.activeVehicles}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.stats.activeVehicles}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>3</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">more than last week</span>
            </div>
          </div>
          
          {/* Pending Deliveries */}
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
            <div className="flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t.pendingDeliveries}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{dashboardData?.stats.pendingDeliveries}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2 text-sm">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>4</span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">more than yesterday</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Recent Orders */}
      <section className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t.recentOrders}</h2>
          <Link 
            href="/admin/orders" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t.viewAll}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-400">
                  <th className="whitespace-nowrap px-6 py-3">{t.orderNumber}</th>
                  <th className="whitespace-nowrap px-6 py-3">{t.customer}</th>
                  <th className="whitespace-nowrap px-6 py-3">{t.status}</th>
                  <th className="whitespace-nowrap px-6 py-3">{t.amount}</th>
                  <th className="whitespace-nowrap px-6 py-3">{t.date}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                      <Link href={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {order.customer}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : order.status === 'in-transit' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                          : order.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {order.status === 'delivered' 
                          ? t.statusDelivered 
                          : order.status === 'in-transit' 
                          ? t.statusInTransit 
                          : order.status === 'pending' 
                          ? t.statusPending 
                          : t.statusCancelled}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {order.amount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
              {t.noOrders}
            </div>
          )}
        </div>
      </section>
      
      {/* Bottom Grid: Recent Temperature Alerts and Recent Users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Temperature Alerts */}
        <section className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t.recentAlerts}</h2>
            <Link 
              href="/admin/temperature/alerts" 
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t.viewAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {dashboardData?.recentAlerts && dashboardData.recentAlerts.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-400">
                    <th className="whitespace-nowrap px-6 py-3">{t.shipment}</th>
                    <th className="whitespace-nowrap px-6 py-3">{t.temperature}</th>
                    <th className="whitespace-nowrap px-6 py-3">{t.limit}</th>
                    <th className="whitespace-nowrap px-6 py-3">{t.time}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.recentAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                        <Link href={`/admin/shipments/${alert.shipment}`}>{alert.shipment}</Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-red-600 dark:text-red-400 font-medium">
                        {alert.temperature}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {alert.limit}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {alert.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
                {t.noAlerts}
              </div>
            )}
          </div>
        </section>
        
        {/* Recent Users */}
        <section className="rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t.recentUsers}</h2>
            <Link 
              href="/admin/users" 
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t.viewAll}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            {dashboardData?.recentUsers && dashboardData.recentUsers.length > 0 ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-400">
                    <th className="whitespace-nowrap px-6 py-3">{t.username}</th>
                    <th className="whitespace-nowrap px-6 py-3">{t.fullName}</th>
                    <th className="whitespace-nowrap px-6 py-3">{t.email}</th>
                    <th className="whitespace-nowrap px-6 py-3">{t.recentlyJoined}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.recentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                        <Link href={`/admin/users/${user.id}`}>{user.username}</Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {user.fullName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {user.joinDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
                {t.noRecentUsers}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}