'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Plus, Eye, Truck, RefreshCw, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function AdminOrdersPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const translations = {
    th: {
      orders: 'คำสั่งซื้อทั้งหมด',
      newOrder: 'สร้างคำสั่งซื้อใหม่',
      refresh: 'รีเฟรช',
      filter: 'กรอง',
      all: 'ทั้งหมด',
      pending: 'รอดำเนินการ',
      inTransit: 'กำลังขนส่ง',
      delivered: 'จัดส่งแล้ว',
      cancelled: 'ยกเลิกแล้ว',
      search: 'ค้นหาคำสั่งซื้อ',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      customer: 'ลูกค้า',
      date: 'วันที่',
      status: 'สถานะ',
      destination: 'ปลายทาง',
      temperature: 'อุณหภูมิ',
      actions: 'การดำเนินการ',
      view: 'ดู',
      track: 'ติดตาม',
      noOrders: 'ไม่พบคำสั่งซื้อ',
      loading: 'กำลังโหลด...',
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
      showingResults: 'แสดง {start}-{end} จาก {total} รายการ'
    },
    en: {
      orders: 'All Orders',
      newOrder: 'New Order',
      refresh: 'Refresh',
      filter: 'Filter',
      all: 'All',
      pending: 'Pending',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      search: 'Search orders',
      orderNumber: 'Order Number',
      customer: 'Customer',
      date: 'Date',
      status: 'Status',
      destination: 'Destination',
      temperature: 'Temperature',
      actions: 'Actions',
      view: 'View',
      track: 'Track',
      noOrders: 'No orders found',
      loading: 'Loading...',
      previous: 'Previous',
      next: 'Next',
      showingResults: 'Showing {start}-{end} of {total} results'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data
        const mockOrders = [
          {
            id: '1',
            order_number: 'ORD-20250301-1234',
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            date: '2025-03-01',
            status: 'pending',
            destination: 'Bangkok, Thailand',
            temperature_range: '-18°C to -20°C',
            items: 5,
            total: 12500
          },
          {
            id: '2',
            order_number: 'ORD-20250301-1235',
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            date: '2025-03-01',
            status: 'in-transit',
            destination: 'Chiang Mai, Thailand',
            temperature_range: '2°C to 6°C',
            items: 3,
            total: 8750
          },
          {
            id: '3',
            order_number: 'ORD-20250228-1233',
            customer_name: 'David Johnson',
            customer_email: 'david@example.com',
            date: '2025-02-28',
            status: 'delivered',
            destination: 'Phuket, Thailand',
            temperature_range: '-18°C to -20°C',
            items: 2,
            total: 5600
          },
          {
            id: '4',
            order_number: 'ORD-20250227-1232',
            customer_name: 'Sarah Williams',
            customer_email: 'sarah@example.com',
            date: '2025-02-27',
            status: 'cancelled',
            destination: 'Pattaya, Thailand',
            temperature_range: '2°C to 6°C',
            items: 4,
            total: 10200
          },
          {
            id: '5',
            order_number: 'ORD-20250226-1231',
            customer_name: 'Michael Brown',
            customer_email: 'michael@example.com',
            date: '2025-02-26',
            status: 'delivered',
            destination: 'Khon Kaen, Thailand',
            temperature_range: '-18°C to -20°C',
            items: 1,
            total: 3500
          }
        ];

        // Filter by status if needed
        let filteredOrders = [...mockOrders];
        if (statusFilter !== 'all') {
          filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredOrders = filteredOrders.filter(order => 
            order.order_number.toLowerCase().includes(query) ||
            order.customer_name.toLowerCase().includes(query) ||
            order.customer_email.toLowerCase().includes(query) ||
            order.destination.toLowerCase().includes(query)
          );
        }

        // Calculate pagination
        const totalFilteredOrders = filteredOrders.length;
        setTotalPages(Math.ceil(totalFilteredOrders / pageSize));
        
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalFilteredOrders);
        
        setOrders(filteredOrders.slice(startIndex, endIndex));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchQuery, statusFilter, currentPage, pageSize]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page on new filter
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending':
        return t.pending;
      case 'in-transit':
        return t.inTransit;
      case 'delivered':
        return t.delivered;
      case 'cancelled':
        return t.cancelled;
      default:
        return status;
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`rounded-md px-3 py-1 text-sm ${
              currentPage === page
                ? 'bg-blue-600 text-white dark:bg-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderResultsInfo = () => {
    if (orders.length === 0) return null;
    
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + orders.length - 1, startIndex + pageSize - 1);
    const totalOrders = (totalPages - 1) * pageSize + (currentPage === totalPages ? orders.length : pageSize);
    
    return t.showingResults
      .replace('{start}', startIndex)
      .replace('{end}', endIndex)
      .replace('{total}', totalOrders);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.orders}</h1>
        
        <div className="flex space-x-3">
          <Link
            href="/admin/orders/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t.newOrder}
          </Link>
          
          <button
            onClick={handleRefresh}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t.refresh}
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder={t.search}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        
        <div className="flex space-x-3">
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <Filter className="mr-2 h-4 w-4" />
              {t.filter}: {statusFilter === 'all' ? t.all : getStatusLabel(statusFilter)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 z-10">
              <div className="py-1">
                <button
                  onClick={() => handleStatusFilter('all')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    statusFilter === 'all'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.all}
                </button>
                <button
                  onClick={() => handleStatusFilter('pending')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    statusFilter === 'pending'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.pending}
                </button>
                <button
                  onClick={() => handleStatusFilter('in-transit')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    statusFilter === 'in-transit'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.inTransit}
                </button>
                <button
                  onClick={() => handleStatusFilter('delivered')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    statusFilter === 'delivered'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.delivered}
                </button>
                <button
                  onClick={() => handleStatusFilter('cancelled')}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    statusFilter === 'cancelled'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {t.cancelled}
                </button>
              </div>
            </div>
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t.orderNumber}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t.customer}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t.date}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t.status}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t.destination}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t.temperature}
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {t.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t.loading}</p>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  {t.noOrders}
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      <Link href={`/admin/orders/${order.id}`}>
                        {order.order_number}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{order.customer_name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.destination}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.temperature_range}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      <Eye className="h-4 w-4 inline" />
                    </Link>
                    <Link
                      href={`/admin/tracking/${order.order_number}`}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                    >
                      <Truck className="h-4 w-4 inline" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {renderResultsInfo()}
          </div>
          {renderPagination()}
        </div>
      )}
    </div>
  );
}