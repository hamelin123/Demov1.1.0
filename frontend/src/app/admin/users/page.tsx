'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash, ChevronLeft, ChevronRight, UserPlus, RefreshCw } from 'lucide-react';
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
  const t = {
    th: {
      users: 'ผู้ใช้ทั้งหมด', searchPlaceholder: 'ค้นหาตามชื่อ อีเมล หรือหมายเลขโทรศัพท์',
      addUser: 'เพิ่มผู้ใช้', refresh: 'รีเฟรช', loading: 'กำลังโหลด...',
      noUsers: 'ไม่พบผู้ใช้', confirmDelete: 'ยืนยันการลบ',
      confirmDeleteMessage: 'คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้? การกระทำนี้ไม่สามารถเรียกคืนได้',
      cancel: 'ยกเลิก', delete: 'ลบ', edit: 'แก้ไข'
    },
    en: {
      users: 'All Users', searchPlaceholder: 'Search by name, email or phone',
      addUser: 'Add User', refresh: 'Refresh', loading: 'Loading...',
      noUsers: 'No users found', confirmDelete: 'Confirm Delete',
      confirmDeleteMessage: 'Are you sure you want to delete this user? This action cannot be undone.',
      cancel: 'Cancel', delete: 'Delete', edit: 'Edit'
    }
  }[language];

  // Load users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Mock data for development
        const mockUsers = [
          {
            id: '1', username: 'johndoe', full_name: 'John Doe', email: 'john@example.com',
            phone_number: '081-234-5678', role: 'admin', status: 'active', created_at: '2025-01-15T10:30:00Z'
          },
          {
            id: '2', username: 'janedoe', full_name: 'Jane Doe', email: 'jane@example.com',
            phone_number: '089-876-5432', role: 'user', status: 'active', created_at: '2025-01-20T14:45:00Z'
          },
          {
            id: '3', username: 'bobsmith', full_name: 'Bob Smith', email: 'bob@example.com',
            phone_number: '062-345-6789', role: 'staff', status: 'active', created_at: '2025-02-01T09:15:00Z'
          },
          {
            id: '4', username: 'alicejones', full_name: 'Alice Jones', email: 'alice@example.com',
            phone_number: '091-234-5678', role: 'user', status: 'inactive', created_at: '2025-02-10T11:20:00Z'
          },
          {
            id: '5', username: 'davidlee', full_name: 'David Lee', email: 'david@example.com',
            phone_number: '083-456-7890', role: 'user', status: 'active', created_at: '2025-02-18T16:30:00Z'
          }
        ];
        
        // Filter by search query
        let filteredUsers = [...mockUsers];
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredUsers = filteredUsers.filter(user => 
            user.full_name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.phone_number.toLowerCase().includes(query)
          );
        }
        
        // Sort users
        filteredUsers.sort((a, b) => {
          return sortDirection === 'asc' ? 
            (a[sortBy] > b[sortBy] ? 1 : -1) : 
            (a[sortBy] < b[sortBy] ? 1 : -1);
        });
        
        // Paginate results
        const totalResults = filteredUsers.length;
        setTotalPages(Math.ceil(totalResults / pageSize));
        
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalResults);
        
        setUsers(filteredUsers.slice(startIndex, endIndex));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchQuery, currentPage, pageSize, sortBy, sortDirection]);

  // Toggle user selection
  const toggleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  // Toggle select all
  const toggleSelectAll = () => {
    setSelectedUsers(prev => 
      prev.length === users.length ? [] : users.map(user => user.id)
    );
  };
  
  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);
  
  // Handle sorting
  const handleSort = (column) => {
    setSortDirection(prev => sortBy === column ? (prev === 'asc' ? 'desc' : 'asc') : 'asc');
    setSortBy(column);
  };
  
  // Show delete confirmation
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  // Handle user deletion
  const handleDelete = () => {
    // Mock deletion process
    setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
    setSelectedUsers(prev => prev.filter(id => id !== userToDelete.id));
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Render pagination controls
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
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
      
      {/* Search */}
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
            {[10, 25, 50, 100].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <span className="ml-2 text-gray-500 dark:text-gray-400">{t.loading}</span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400">{t.noUsers}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <input
                      type="checkbox"
                      checked={selectedUsers.length === users.length}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  {/* Column headers with sort functionality */}
                  {['username', 'full_name', 'email', 'phone_number', 'role', 'status', 'created_at'].map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    >
                      {t[col] || col.replace('_', ' ')}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {user.phone_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                        user.role === 'staff' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {/* View icon */}
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(user)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
      {users.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {`Showing ${(currentPage - 1) * pageSize + 1}-${Math.min((currentPage - 1) * pageSize + users.length, (totalPages - 1) * pageSize + users.length)} of ${(totalPages - 1) * pageSize + users.length}`}
          </div>
          {renderPagination()}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 text-lg font-medium text-gray-900 dark:text-white">{t.confirmDelete}</div>
            <p className="mb-6 text-gray-500 dark:text-gray-400">{t.confirmDeleteMessage}</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}