'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Edit, Trash, ChevronLeft, ChevronRight,
  Package, RefreshCw, Filter, FileText, X, Check, AlertTriangle, Calendar
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { getOrders, updateOrderStatus, deleteOrder } from '@/lib/api';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal';

export default function AdminOrdersPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState({ startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Translations
  const translations = {
    th: {
      orders: 'จัดการคำสั่งซื้อ',
      searchPlaceholder: 'ค้นหาตามหมายเลขคำสั่งซื้อ หรือชื่อลูกค้า',
      addOrder: 'เพิ่มคำสั่งซื้อ',
      refresh: 'รีเฟรช',
      filter: 'ตัวกรอง',
      orderNumber: 'หมายเลขคำสั่งซื้อ',
      customer: 'ลูกค้า',
      status: 'สถานะ',
      total: 'ยอดรวม',
      weight: 'น้ำหนัก',
      createdAt: 'สร้างเมื่อ',
      estimatedDelivery: 'กำหนดส่ง',
      actions: 'การกระทำ',
      edit: 'แก้ไข',
      delete: 'ลบ',
      view: 'ดู',
      changeStatus: 'เปลี่ยนสถานะ',
      pending: 'รอดำเนินการ',
      processing: 'กำลังดำเนินการ',
      inTransit: 'กำลังจัดส่ง',
      delivered: 'จัดส่งแล้ว',
      cancelled: 'ยกเลิก',
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
      showingResults: 'แสดง {start}-{end} จาก {total} รายการ',
      selectAll: 'เลือกทั้งหมด',
      confirmDelete: 'ยืนยันการลบ',
      confirmDeleteMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบคำสั่งซื้อนี้? การกระทำนี้ไม่สามารถเรียกคืนได้',
      cancel: 'ยกเลิก',
      noOrders: 'ไม่พบคำสั่งซื้อ',
      loading: 'กำลังโหลด...',
      statusFilter: 'กรองตามสถานะ',
      dateFilter: 'กรองตามวันที่',
      startDate: 'วันที่เริ่มต้น',
      endDate: 'วันที่สิ้นสุด',
      applyFilter: 'ใช้ตัวกรอง',
      clearFilter: 'ล้างตัวกรอง',
      allStatus: 'ทุกสถานะ',
      temperature: 'อุณหภูมิที่กำหนด',
      warning: 'การแจ้งเตือน',
      sender: 'ผู้ส่ง',
      recipient: 'ผู้รับ'
    },
    en: {
      orders: 'Manage Orders',
      searchPlaceholder: 'Search by order number or customer name',
      addOrder: 'Add Order',
      refresh: 'Refresh',
      filter: 'Filter',
      orderNumber: 'Order Number',
      customer: 'Customer',
      status: 'Status',
      total: 'Total',
      weight: 'Weight',
      createdAt: 'Created At',
      estimatedDelivery: 'Est. Delivery',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      changeStatus: 'Change Status',
      pending: 'Pending',
      processing: 'Processing',
      inTransit: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      previous: 'Previous',
      next: 'Next',
      showingResults: 'Showing {start}-{end} of {total} results',
      selectAll: 'Select All',
      confirmDelete: 'Confirm Delete',
      confirmDeleteMessage: 'Are you sure you want to delete this order? This action cannot be undone.',
      cancel: 'Cancel',
      noOrders: 'No orders found',
      loading: 'Loading...',
      statusFilter: 'Filter by Status',
      dateFilter: 'Filter by Date',
      startDate: 'Start Date',
      endDate: 'End Date',
      applyFilter: 'Apply Filter',
      clearFilter: 'Clear Filter',
      allStatus: 'All Status',
      temperature: 'Required Temp',
      warning: 'Warning',
      sender: 'Sender',
      recipient: 'Recipient'
    }
  };

  const t = translations[language] || translations.en;

  // โหลดข้อมูลคำสั่งซื้อ
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // ในสถานการณ์จริง จะใช้ API เพื่อดึงข้อมูล
        // const response = await getOrders(currentPage, pageSize, searchQuery, statusFilter, dateRangeFilter, sortBy, sortDirection);
        // setOrders(response.orders);
        // setTotalPages(response.totalPages);
        
        // Mock data สำหรับการพัฒนา
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockOrders = [
          {
            id: '1',
            order_number: 'CC-20250227-1001',
            customer_name: 'บริษัท ฟาร์มาซี จำกัด',
            sender_name: 'บริษัท ฟาร์มาซี จำกัด',
            recipient_name: 'โรงพยาบาลศิริราช',
            status: 'pending',
            total_amount: '฿32,500',
            package_weight: '15.5 kg',
            required_temperature: '-18°C',
            has_warning: false,
            created_at: '27 ก.พ. 2025',
            estimated_delivery_date: '1 มี.ค. 2025'
          },
          {
            id: '2',
            order_number: 'CC-20250226-1002',
            customer_name: 'บริษัท อาหารเย็น จำกัด',
            sender_name: 'บริษัท อาหารเย็น จำกัด',
            recipient_name: 'ร้านอาหาร เดอะริเวอร์ไซด์',
            status: 'in-transit',
            total_amount: '฿18,750',
            package_weight: '25.0 kg',
            required_temperature: '2-4°C',
            has_warning: true,
            created_at: '26 ก.พ. 2025',
            estimated_delivery_date: '28 ก.พ. 2025'
          },
          {
            id: '3',
            order_number: 'CC-20250226-1003',
            customer_name: 'คลินิกวัคซีน',
            sender_name: 'คลินิกวัคซีน',
            recipient_name: 'โรงพยาบาลกรุงเทพ',
            status: 'processing',
            total_amount: '฿8,900',
            package_weight: '5.2 kg',
            required_temperature: '2-6°C',
            has_warning: false,
            created_at: '26 ก.พ. 2025',
            estimated_delivery_date: '27 ก.พ. 2025'
          },
          {
            id: '4',
            order_number: 'CC-20250225-1004',
            customer_name: 'โรงพยาบาลสมิติเวช',
            sender_name: 'บริษัท ยาและเวชภัณฑ์ จำกัด',
            recipient_name: 'โรงพยาบาลสมิติเวช',
            status: 'delivered',
            total_amount: '฿42,000',
            package_weight: '12.0 kg',
            required_temperature: '0-4°C',
            has_warning: false,
            created_at: '25 ก.พ. 2025',
            estimated_delivery_date: '27 ก.พ. 2025'
          },
          {
            id: '5',
            order_number: 'CC-20250225-1005',
            customer_name: 'บริษัท วัคซีนไทย จำกัด',
            sender_name: 'บริษัท วัคซีนไทย จำกัด',
            recipient_name: 'โรงพยาบาลรามาธิบดี',
            status: 'cancelled',
            total_amount: '฿15,300',
            package_weight: '8.5 kg',
            required_temperature: '-70°C',
            has_warning: false,
            created_at: '25 ก.พ. 2025',
            estimated_delivery_date: '28 ก.พ. 2025'
          }
        ];
        
        // กรองข้อมูลตามเงื่อนไขการค้นหา
        let filteredOrders = [...mockOrders];
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredOrders = filteredOrders.filter(order => 
            order.order_number.toLowerCase().includes(query) || 
            order.customer_name.toLowerCase().includes(query)
          );
        }
        
        // กรองตามสถานะ
        if (statusFilter && statusFilter !== 'all') {
          filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }
        
        // กรองตามวันที่ (จำลอง)
        if (dateRangeFilter.startDate || dateRangeFilter.endDate) {
          // ในกรณีจริงจะต้องเปรียบเทียบวันที่อย่างถูกต้อง
          // โค้ดจำลองเท่านั้น
        }
        
        // เรียงลำดับ
        filteredOrders.sort((a, b) => {
          if (sortDirection === 'asc') {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] < b[sortBy] ? 1 : -1;
          }
        });
        
        // จำลองการแบ่งหน้า
        const totalResults = filteredOrders.length;
        setTotalPages(Math.ceil(totalResults / pageSize));
        
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalResults);
        
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
        
        setOrders(paginatedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [searchQuery, statusFilter, dateRangeFilter, currentPage, pageSize, sortBy, sortDirection]);

  // ฟังก์ชันการเลือกคำสั่งซื้อ
  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  
  // ฟังก์ชันเลือกทุกคำสั่งซื้อในหน้าปัจจุบัน
  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };
  
  // ฟังก์ชันเปลี่ยนหน้า
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // ฟังก์ชันเปลี่ยนการเรียงลำดับ
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  // ฟังก์ชันแสดง modal ยืนยันการลบ
  const confirmDelete = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };
  
  // ฟังก์ชันดำเนินการลบ
  const handleDelete = async () => {
    try {
      setLoading(true);
      // ในสถานการณ์จริง
      // await deleteOrder(orderToDelete.id);
      
      // จำลองการลบ
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      setSelectedOrders(selectedOrders.filter(id => id !== orderToDelete.id));
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ฟังก์ชันเปลี่ยนสถานะคำสั่งซื้อ
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      // ในสถานการณ์จริง
      // await updateOrderStatus(orderId, newStatus);
      
      // จำลองการอัปเดตสถานะ
      setOrders(orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // ฟังก์ชันล้างตัวกรอง
  const clearFilters = () => {
    setStatusFilter('all');
    setDateRangeFilter({ startDate: '', endDate: '' });
    setSearchQuery('');
  };
  
  // ฟังก์ชันแสดงสถานะเป็นข้อความ
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return t.pending;
      case 'processing': return t.processing;
      case 'in-transit': return t.inTransit;
      case 'delivered': return t.delivered;
      case 'cancelled': return t.cancelled;
      default: return status;
    }
  };
  
  // ฟังก์ชันกำหนดสีตามสถานะ
  const getStatusColors = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // แสดงผลการแบ่งหน้า
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

  // แสดงข้อความจำนวนผลลัพธ์
  const renderResultsInfo = () => {
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + orders.length - 1, startIndex + pageSize - 1);
    const totalResults = (totalPages - 1) * pageSize + (currentPage === totalPages ? orders.length : pageSize);
    
    return t.showingResults
      .replace('{start}', startIndex)
      .replace('{end}', endIndex)
      .replace('{total}', totalResults);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.orders}</h1>
        
        <div className="flex space-x-3">
          <Link
            href="/admin/orders/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t.addOrder}
          </Link>
          
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
            }}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {t.refresh}
          </button>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <Filter className="mr-2 h-4 w-4" />
            {t.filter}
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          
          <div className="flex space-x-3">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        
        {showFilters && (
          <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t.filter}</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t.clearFilter}
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.statusFilter}</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">{t.allStatus}</option>
                  <option value="pending">{t.pending}</option>
                  <option value="processing">{t.processing}</option>
                  <option value="in-transit">{t.inTransit}</option>
                  <option value="delivered">{t.delivered}</option>
                  <option value="cancelled">{t.cancelled}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.dateFilter}</label>
                <div className="mt-1 flex space-x-2">
                  <div className="flex-1">
                    <label className="sr-only">{t.startDate}</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={dateRangeFilter.startDate}
                        onChange={(e) => setDateRangeFilter({...dateRangeFilter, startDate: e.target.value})}
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="sr-only">{t.endDate}</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={dateRangeFilter.endDate}
                        onChange={(e) => setDateRangeFilter({...dateRangeFilter, endDate: e.target.value})}
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Orders Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">{t.loading}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">{t.noOrders}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="w-12 px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === orders.length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                    />
                  </th>
                  <th
                    onClick={() => handleSort('order_number')}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer"
                  >
                    {t.orderNumber}
                  </th>
                  <th
                    onClick={() => handleSort('customer_name')}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer"
                  >
                    {t.customer}
                  </th>
                  <th
                    onClick={() => handleSort('status')}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer"
                  >
                    {t.status}
                  </th>
                  <th
                    onClick={() => handleSort('total_amount')}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer"
                  >
                    {t.total}
                  </th>
                  <th
                    onClick={() => handleSort('required_temperature')}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer"
                  >
                    {t.temperature}
                  </th>
                  <th
                    onClick={() => handleSort('created_at')}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 cursor-pointer"
                  >
                    {t.createdAt}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleSelectOrder(order.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {order.order_number}
                      </Link>
                      {order.has_warning && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          {t.warning}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{order.customer_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-block mr-2">{t.sender}: {order.sender_name}</span>
                        <span className="inline-block">{t.recipient}: {order.recipient_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColors(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <div className="mt-1">
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(order.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="mt-1 text-xs rounded-md border border-gray-300 bg-white py-1 pl-2 pr-6 text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        >
                          <option value="">{t.changeStatus}</option>
                          <option value="pending">{t.pending}</option>
                          <option value="processing">{t.processing}</option>
                          <option value="in-transit">{t.inTransit}</option>
                          <option value="delivered">{t.delivered}</option>
                          <option value="cancelled">{t.cancelled}</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.total_amount}
                      <div className="text-xs text-gray-500 dark:text-gray-400">{order.package_weight}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {order.required_temperature}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>{order.created_at}</div>
                      <div className="text-xs">{t.estimatedDelivery}: {order.estimated_delivery_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title={t.view}
                        >
                          <FileText className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/orders/${order.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title={t.edit}
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(order)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title={t.delete}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {orders.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {renderResultsInfo()}
          </div>
          <div>
            {renderPagination()}
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <ConfirmDeleteModal
          title={t.confirmDelete}
          message={`${t.confirmDeleteMessage} (${orderToDelete.order_number})`}
          confirmButtonText={t.delete}
          cancelButtonText={t.cancel}
          onConfirm={handleDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setOrderToDelete(null);
          }}
        />
      )}
    </div>