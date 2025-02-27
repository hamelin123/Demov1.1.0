// src/app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Edit, Trash, ChevronLeft, ChevronRight,
  UserPlus, RefreshCw 
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function AdminUsersPage() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Translations
  const translations = {
    th: {
      users: 'ผู้ใช้ทั้งหมด',
      searchPlaceholder: 'ค้นหาตามชื่อ อีเมล หรือหมายเลขโทรศัพท์',
      addUser: 'เพิ่มผู้ใช้',
      refresh: 'รีเฟรช',
      username: 'ชื่อผู้ใช้',
      name: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      phone: 'หมายเลขโทรศัพท์',
      role: 'บทบาท',
      status: 'สถานะ',
      createdAt: 'สร้างเมื่อ',
      actions: 'การกระทำ',
      edit: 'แก้ไข',
      delete: 'ลบ',
      active: 'ใช้งาน',
      inactive: 'ไม่ได้ใช้งาน',
      admin: 'ผู้ดูแลระบบ',
      user: 'ผู้ใช้',
      staff: 'เจ้าหน้าที่',
      previous: 'ก่อนหน้า',
      next: 'ถัดไป',
      showingResults: 'แสดง {start}-{end} จาก {total} รายการ',
      selectAll: 'เลือกทั้งหมด',
      confirmDelete: 'ยืนยันการลบ',
      confirmDeleteMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถเรียกคืนได้',
      cancel: 'ยกเลิก',
      noUsers: 'ไม่พบผู้ใช้',
      loading: 'กำลังโหลด...'
    },
    en: {
      users: 'All Users',
      searchPlaceholder: 'Search by name, email or phone',
      addUser: 'Add User',
      refresh: 'Refresh',
      username: 'Username',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      role: 'Role',
      status: 'Status',
      createdAt: 'Created At',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      active: 'Active',
      inactive: 'Inactive',
      admin: 'Admin',
      user: 'User',
      staff: 'Staff',
      previous: 'Previous',
      next: 'Next',
      showingResults: 'Showing {start}-{end} of {total} results',
      selectAll: 'Select All',
      confirmDelete: 'Confirm Delete',
      confirmDeleteMessage: 'Are you sure you want to delete this user? This action cannot be undone.',
      cancel: 'Cancel',
      noUsers: 'No users found',
      loading: 'Loading...'
    }
  };

  const t = translations[language] || translations.en;

  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // จำลองการโหลดข้อมูลผู้ใช้
        // สำหรับการทดสอบใช้ข้อมูลจำลอง
        const mockUsers = [
          {
            id: '1',
            username: 'johndoe',
            full_name: 'John Doe',
            email: 'john@example.com',
            phone_number: '081-234-5678',
            role: 'admin',
            status: 'active',
            created_at: '2025-01-15T10:30:00Z'
          },
          {
            id: '2',
            username: 'janedoe',
            full_name: 'Jane Doe',
            email: 'jane@example.com',
            phone_number: '089-876-5432',
            role: 'user',
            status: 'active',
            created_at: '2025-01-20T14:45:00Z'
          },
          {
            id: '3',
            username: 'bobsmith',
            full_name: 'Bob Smith',
            email: 'bob@example.com',
            phone_number: '062-345-6789',
            role: 'staff',
            status: 'active',
            created_at: '2025-02-01T09:15:00Z'
          },
          {
            id: '4',
            username: 'alicejones',
            full_name: 'Alice Jones',
            email: 'alice@example.com',
            phone_number: '091-234-5678',
            role: 'user',
            status: 'inactive',
            created_at: '2025-02-10T11:20:00Z'
          },
          {
            id: '5',
            username: 'davidlee',
            full_name: 'David Lee',
            email: 'david@example.com',
            phone_number: '083-456-7890',
            role: 'user',
            status: 'active',
            created_at: '2025-02-18T16:30:00Z'
          }
        ];
        
        // จำลองการค้นหาและเรียงลำดับ
        let filteredUsers = [...mockUsers];
        
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.full_name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.phone_number.toLowerCase().includes(query)
          );
        }
        
        // เรียงลำดับ
        filteredUsers.sort((a, b) => {
          if (sortDirection === 'asc') {
            return a[sortBy] > b[sortBy] ? 1 : -1;
          } else {
            return a[sortBy] < b[sortBy] ? 1 : -1;
          }
        });
        
        // จำลองการแบ่งหน้า
        const totalResults = filteredUsers.length;
        setTotalPages(Math.ceil(totalResults / pageSize));
        
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalResults);
        
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        
        setUsers(paginatedUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchQuery, currentPage, pageSize, sortBy, sortDirection]);

  // ฟังก์ชันจัดการเลือกผู้ใช้
  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };
  
  // ฟังก์ชันเลือกผู้ใช้ทั้งหมด
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
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
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  // ฟังก์ชันดำเนินการลบ
  const handleDelete = () => {
    // จำลองการลบผู้ใช้
    console.log('Deleting user:', userToDelete);
    
    // อัปเดตรายการผู้ใช้ (ลบผู้ใช้ออก)
    setUsers(users.filter(user => user.id !== userToDelete.id));
    
    // อัปเดตผู้ใช้ที่เลือก (ลบผู้ใช้ออกจากรายการที่เลือก)
    setSelectedUsers(selectedUsers.filter(id => id !== userToDelete.id));
    
    // ปิด modal
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // แสดงข้อมูลหน้าเลข
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

  // แสดงข้อมูลผลลัพธ์
  const renderResultsInfo = () => {
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(startIndex + users.length - 1, startIndex + pageSize - 1);
    const totalResults = (totalPages - 1) * pageSize + (currentPage === totalPages ? users.length : pageSize);
    
    return t.showingResults
      .replace('{start}', startIndex)
      .replace('{end}', endIndex)
      .replace('{total}', totalResults);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.users}</h1>
        
        <div className="flex space-x-3">
          <Link
            href="/admin/users/create"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-blue-600"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {t.addUser}
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
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
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
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th
                onClick={() => handleSort('username')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              >
                {t.username}
              </th>
              <th
                onClick={() => handleSort('full_name')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              >
                {t.name}
              </th>
              <th
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              >
                {t.email}
              </th>
              <th
                onClick={() => handleSort('phone_number')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              >
                {t.phone}
              </th>
              <th
                onClick={() => handleSort('role')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              >
                {t.role}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              >
                {t.status}
              </th>
              <th
                onClick={() => handleSort('created_at')}
                className="px-6 py-
// src/components/auth/LoginForm.tsx
'use client';