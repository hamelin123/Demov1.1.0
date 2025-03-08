'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { 
  Search, Filter, RefreshCw, Download, FileText, Calendar, 
  ChevronDown, DollarSign, TrendingUp, TrendingDown, BarChart2
} from 'lucide-react';
import Link from 'next/link';

// Import chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// สร้าง interface สำหรับข้อมูลรายงาน
interface ReportDataStats {
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
  growthRate: number;
  profit?: number; // Add profit
  cost?: number; // Add cost
}

interface ReportDataset {
  label: string;
  data: (number | null)[];
  borderColor: string | string[];
  backgroundColor: string | string[];
  tension?: number;
  yAxisID?: string;
  borderWidth?: number;
  fill?: boolean; // Add fill
}

interface ProductData {
  product: string;
  revenue: number;
  orders: number;
  averageValue: number;
  profit?:number; // Add profit
  cost?: number; // Add cost
}

interface CustomerData {
  customer: string;
  revenue: number;
  orders: number;
  averageValue: number;
  profit?: number; // Add profit
  cost?: number; // Add cost
}

interface MonthlyData {
  month: string;
  current: number;
  previous: number;
  growth: number;
  profitCurrent?: number; // Add profitCurrent
  profitPrevious?: number; // Add profitPrevious
  costCurrent?: number; // Add costCurrent
  costPrevious?: number; // Add costPrevious
}

interface QuarterlyData {
  quarter: string;
  revenue: number;
  orders: number;
  averageValue: number;
  growth: number | null;
  profit?: number; // Add profit
  cost?: number; // Add cost
}

interface ReportDataItem {
  labels: string[];
  datasets: ReportDataset[];
  stats?: ReportDataStats;
  productData?: ProductData[];
  customerData?: CustomerData[];
  monthlyData?: MonthlyData[];
  quarterlyData?: QuarterlyData[];
}

// Define possible report types
type ReportType =
  | 'revenue-trends'
  | 'sales-by-product'
  | 'sales-by-customer'
  | 'monthly-sales'
  | 'quarterly-comparison';
interface DateRange {
    start: string;
    end: string;
}
const DEFAULT_DATE_RANGE: DateRange = {
    start: '',
    end: ''
};

export default function SalesReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [selectedReport, setSelectedReport] = useState<ReportType>('revenue-trends');
  const [reportData, setReportData] = useState<ReportDataItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const reportContainerRef = useRef(null);

  const translations = {
    th: {
      title: 'รายงานยอดขาย',
      description: 'ดูรายงานและแนวโน้มยอดขาย ข้อมูลรายได้ และการวิเคราะห์ทางธุรกิจ',
      dateRange: 'ช่วงวันที่',
      startDate: 'วันที่เริ่มต้น',
      endDate: 'วันที่สิ้นสุด',
      search: 'ค้นหาตามชื่อลูกค้าหรือรหัสสินค้า',
      product: 'ประเภทสินค้า',
      allProducts: 'ทุกประเภทสินค้า',
      refresh: 'รีเฟรช',
      export: 'ส่งออก',
      generateReport: 'สร้างรายงาน',
      reportType: 'ประเภทรายงาน',
      revenueTrends: 'แนวโน้มรายได้',
      salesByProduct: 'ยอดขายตามประเภทสินค้า',
      salesByCustomer: 'ยอดขายตามลูกค้า',
      monthlySales: 'ยอดขายรายเดือน',
      quarterlyComparison: 'เปรียบเทียบรายไตรมาส',
      filters: 'ตัวกรอง',
      loading: 'กำลังโหลด...',
      noData: 'ไม่พบข้อมูลสำหรับช่วงเวลาที่เลือก',
      selectDateRange: 'กรุณาเลือกช่วงวันที่และสร้างรายงาน',
      totalRevenue: 'รายได้รวม',
      orderCount: 'จำนวนคำสั่งซื้อ',
      averageOrderValue: 'มูลค่าคำสั่งซื้อเฉลี่ย',
      growthRate: 'อัตราการเติบโต',
      period: 'ช่วงเวลา',
      revenue: 'รายได้',
      orders: 'คำสั่งซื้อ',
      customer: 'ลูกค้า',
      quantity: 'จำนวน',
      exportPDF: 'ส่งออกเป็น PDF',
      exportCSV: 'ส่งออกเป็น CSV',
      exportExcel: 'ส่งออกเป็น Excel',
      printReport: 'พิมพ์รายงาน',
      frozenFood: 'อาหารแช่แข็ง',
      pharmaceuticals: 'ยาและเวชภัณฑ์',
      dairyProducts: 'ผลิตภัณฑ์นม',
      medicalSupplies: 'เวชภัณฑ์',
      flowers: 'ดอกไม้และพืช',
      profit: 'กำไร', // Add profit
      cost: 'ต้นทุน', // Add cost
    },
    en: {
      title: 'Sales Reports',
      description: 'View sales reports, revenue data, and business analytics',
      dateRange: 'Date Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      search: 'Search by customer or product code',
      product: 'Product Type',
      allProducts: 'All Products',
      refresh: 'Refresh',
      export: 'Export',
      generateReport: 'Generate Report',
      reportType: 'Report Type',
      revenueTrends: 'Revenue Trends',
      salesByProduct: 'Sales by Product Type',
      salesByCustomer: 'Sales by Customer',
      monthlySales: 'Monthly Sales',
      quarterlyComparison: 'Quarterly Comparison',
      filters: 'Filters',
      loading: 'Loading...',
      noData: 'No data found for the selected period',
      selectDateRange: 'Please select a date range and generate a report',
      totalRevenue: 'Total Revenue',
      orderCount: 'Order Count',
      averageOrderValue: 'Average Order Value',
      growthRate: 'Growth Rate',
      period: 'Period',
      revenue: 'Revenue',
      orders: 'Orders',
      customer: 'Customer',
      quantity: 'Quantity',
      exportPDF: 'Export as PDF',
      exportCSV: 'Export as CSV',
      exportExcel: 'Export as Excel',
      printReport: 'Print Report',
      frozenFood: 'Frozen Food',
      pharmaceuticals: 'Pharmaceuticals',
      dairyProducts: 'Dairy Products',
      medicalSupplies: 'Medical Supplies',
      flowers: 'Flowers & Plants',
      profit: 'Profit', // Add profit
      cost: 'Cost', // Add cost
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    setMounted(true);
    
    // Check authentication and permissions
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    
    // Set default date range (last 30 days)
    const setDefaultDates = () => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      setDateRange({
        start: thirtyDaysAgo.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      });
    };
    
    setDefaultDates();
    setLoading(false);
  }, [isAuthenticated, isLoading, user]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportTypeChange = (reportType: ReportType) => {
    setSelectedReport(reportType);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductFilter(e.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const refreshData = () => {
    generateReport();
  };

  // Generate mock data for reports
  const generateMockReportData = async (reportType: ReportType): Promise<ReportDataItem> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for revenue trends
      if (reportType === 'revenue-trends') {
        return {
          labels: ['Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Mar 10'],
          datasets: [
            {
              label: 'Revenue (THB)',
              data: [125000, 135000, 115000, 142000, 156000, 148000, 162000, 158000, 175000, 185000],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Orders',
              data: [25, 28, 22, 30, 32, 29, 35, 33, 38, 40],
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3,
              yAxisID: 'y1'
            }
          ],
          stats: {
            totalRevenue: 1501000,
            orderCount: 312,
            averageOrderValue: 4812.18,
            growthRate: 12.5,
            profit: 300200,
            cost: 1200800
          }
        };
      }
      
      // Mock data for sales by product type
      else if (reportType === 'sales-by-product') {
        return {
          labels: ['Frozen Food', 'Pharmaceuticals', 'Dairy Products', 'Medical Supplies', 'Flowers & Plants'],
          datasets: [
            {
              label: 'Revenue (THB)',
              data: [580000, 425000, 320000, 150000, 95000],
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
              ],
              borderColor: [
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 206, 86)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)'
              ],
              borderWidth: 1
            }
          ],
          productData: [
            { product: 'Frozen Food', revenue: 580000, orders: 120, averageValue: 4833.33, profit: 116000, cost: 464000 },
            { product: 'Pharmaceuticals', revenue: 425000, orders: 85, averageValue: 5000.00, profit: 85000, cost: 340000 },
            { product: 'Dairy Products', revenue: 320000, orders: 64, averageValue: 5000.00, profit: 64000, cost: 256000 },
            { product: 'Medical Supplies', revenue: 150000, orders: 28, averageValue: 5357.14, profit: 30000, cost: 120000 },
            { product: 'Flowers & Plants', revenue: 95000, orders: 19, averageValue: 5000.00, profit: 19000, cost: 76000 }
          ]
        };
      }
      
      // Mock data for sales by customer
      else if (reportType === 'sales-by-customer') {
        return {
          labels: ['ABC Hospital', 'XYZ Supermarket', 'DEF Distributor', 'GHI Pharmacy', 'JKL Restaurant'],
          datasets: [
            {
              label: 'Revenue (THB)',
              data: [450000, 320000, 280000, 240000, 180000],
              backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)'
              ],
              borderColor: [
                'rgb(54, 162, 235)',
                'rgb(75, 192, 192)',
                'rgb(255, 206, 86)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)'
              ],
              borderWidth: 1
            }
          ],
          customerData: [
            { customer: 'ABC Hospital', revenue: 450000, orders: 32, averageValue: 14062.50 },
            { customer: 'XYZ Supermarket', revenue: 320000, orders: 40, averageValue: 8000.00 },
            { customer: 'DEF Distributor', revenue: 280000, orders: 35, averageValue: 8000.00 },
            { customer: 'GHI Pharmacy', revenue: 240000, orders: 28, averageValue: 8571.43 },
            { customer: 'JKL Restaurant', revenue: 180000, orders: 25, averageValue: 7200.00 }
          ]
        };
      }
      
      // Mock data for monthly sales
      else if (reportType === 'monthly-sales') {
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Revenue 2025',
              data: [1350000, 1420000, 1560000, 1480000, 1620000, 1580000, null, null, null, null, null, null],
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1
            },
            {
              label: 'Revenue 2024',
              data: [1250000, 1320000, 1420000, 1380000, 1450000, 1420000, 1480000, 1520000, 1560000, 1620000, 1580000, 1650000],
              backgroundColor: 'rgba(54, 162, 235, 0.7)',
              borderColor: 'rgb(54, 162, 235)',
              borderWidth: 1
            }
          ],
          monthlyData: [
            { month: 'Jan', current: 1350000, previous: 1250000, growth: 8.0 },
            { month: 'Feb', current: 1420000, previous: 1320000, growth: 7.6 },
            { month: 'Mar', current: 1560000, previous: 1420000, growth: 9.9 },
            { month: 'Apr', current: 1480000, previous: 1380000, growth: 7.2 },
            { month: 'May', current: 1620000, previous: 1450000, growth: 11.7 },
            { month: 'Jun', current: 1580000, previous: 1420000, growth: 11.3 }
          ]
        };
      }
      
      // Mock data for quarterly comparison
      else if (reportType === 'quarterly-comparison') {
        return {
          labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'],
          datasets: [
            {
              label: 'Revenue (THB)',
              data: [3990000, 4250000, 4560000, 4850000, 4330000, 4680000],
              backgroundColor: 'rgba(75, 192, 192, 0.7)',
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 1
            }
          ],
          quarterlyData: [
            { quarter: 'Q1 2024', revenue: 3990000, orders: 720, averageValue: 5541.67, growth: null },
            { quarter: 'Q2 2024', revenue: 4250000, orders: 760, averageValue: 5592.11, growth: 6.5 },
            { quarter: 'Q3 2024', revenue: 4560000, orders: 815, averageValue: 5595.09, growth: 7.3 },
            { quarter: 'Q4 2024', revenue: 4850000, orders: 860, averageValue: 5639.53, growth: 6.4 },
            { quarter: 'Q1 2025', revenue: 4330000, orders: 780, averageValue: 5551.28, growth: 8.5 },
            { quarter: 'Q2 2025', revenue: 4680000, orders: 825, averageValue: 5672.73, growth: 8.1 }
          ]
        };
      }
      
      // Default empty report for unknown types
      return {
        labels: [],
        datasets: []
      };
    } catch (error) {
      console.error('Error generating report:', error);
      // Return empty data in case of error
      return {
        labels: [],
        datasets: []
      };
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    const reportData = await generateMockReportData(selectedReport);
    setReportData(reportData);
  };

  const exportReport = (format: string) => {
    // Simulate export
    console.log(`Exporting report in ${format} format...`);
    alert(`Report would be exported as ${format} in a real implementation.`);
  };

  const printReport = () => {
    // Simulate print
    window.print();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const renderRevenueTrendsReport = () => {
    if (!reportData) return null;
    
    const { labels, datasets, stats } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const, // Use as const here
        },
        title: {
          display: true,
          text: t.salesByProduct,
        },
      },
      scales: {
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          title: {
            display: true,
            text: 'Revenue (THB)'
          }
        },
        y1: {
          type: 'linear' as const,
          display: true,
          position: 'right' as const,
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Orders'
          }
        }
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.revenueTrends}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.totalRevenue}</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats && formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.orderCount}</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats && stats.orderCount}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.averageOrderValue}</h4>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats && formatCurrency(stats.averageOrderValue)}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.growthRate}</h4>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats && `+${stats.growthRate}%`}</p>
            </div>
          </div>
          
          <div className="h-96">
            <Line options={options} data={{ labels, datasets }} />
          </div>
        </div>
      </div>
    );
  };

  const renderSalesByProductReport = () => {
    if (!reportData) return null;
    
    const { labels, datasets, productData } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const, // Add as const here
        },
        title: {
          display: true,
          text: t.salesByProduct,
        },
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.salesByProduct}</h3>
          </div>
          
          <div className="h-80 mb-6">
            <Bar options={options} data={{ labels, datasets }} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.product}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.revenue}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.orders}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.averageOrderValue}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {productData && productData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {data.product === 'Frozen Food' ? t.frozenFood : 
                       data.product === 'Pharmaceuticals' ? t.pharmaceuticals : 
                       data.product === 'Dairy Products' ? t.dairyProducts : 
                       data.product === 'Medical Supplies' ? t.medicalSupplies : 
                       data.product === 'Flowers & Plants' ? t.flowers : data.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign 
                          size={16} 
                          className="mr-1 text-blue-500" 
                        />
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(data.averageValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSalesByCustomerReport = () => {
    if (!reportData) return null;
    
    const { labels, datasets, customerData } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const, // Add as const here
        },
        title: {
          display: true,
          text: t.salesByCustomer,
        },
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.salesByCustomer}</h3>
          </div>
          
          <div className="h-80 mb-6">
            <Bar options={options} data={{ labels, datasets }} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.customer}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.revenue}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.orders}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.averageOrderValue}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customerData && customerData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      <Link href={`/admin/customers/${data.customer.toLowerCase().replace(/\s+/g, '-')}`}>
                        {data.customer}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign 
                          size={16} 
                          className="mr-1 text-blue-500" 
                        />
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(data.averageValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlySalesReport = () => {
    if (!reportData) return null;
    
    const { labels, datasets, monthlyData } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const, // Add as const here
        },
        title: {
          display: true,
          text: t.monthlySales,
        },
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.monthlySales}</h3>
          </div>
          
          <div className="h-80 mb-6">
            <Bar options={options} data={{ labels, datasets }} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.period}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    2025 {t.revenue}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    2024 {t.revenue}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.growthRate}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {monthlyData && monthlyData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {data.month} {data.current ? '2025' : '2024'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign 
                          size={16} 
                          className="mr-1 text-blue-500" 
                        />
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency(data.current)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign 
                          size={16} 
                          className="mr-1 text-gray-500" 
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(data.previous)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {data.growth > 0 ? (
                          <TrendingUp size={16} className="text-green-500 mr-1" />
                        ) : (
                          <TrendingDown size={16} className="text-red-500 mr-1" />
                        )}
                        <span className={`font-medium ${
                          data.growth > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {data.growth > 0 ? '+' : ''}{data.growth}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderQuarterlyComparisonReport = () => {
    if (!reportData) return null;
    
    const { labels, datasets, quarterlyData } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const, // Add as const here
        },
        title: {
          display: true,
          text: t.quarterlyComparison,
        },
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.quarterlyComparison}</h3>
          </div>
          
          <div className="h-80 mb-6">
            <Bar options={options} data={{ labels, datasets }} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.period}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.revenue}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.orders}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.averageOrderValue}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.growthRate}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {quarterlyData && quarterlyData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {data.quarter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign 
                          size={16} 
                          className="mr-1 text-blue-500" 
                        />
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(data.averageValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {data.growth === null ? (
                          <span className="text-gray-400">-</span>
                        ) : data.growth > 0 ? (
                          <>
                            <TrendingUp size={16} className="text-green-500 mr-1" />
                            <span className="font-medium text-green-600 dark:text-green-400">
                              +{data.growth}%
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown size={16} className="text-red-500 mr-1" />
                            <span className="font-medium text-red-600 dark:text-red-400">
                              {data.growth}%
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderReport = () => {
    if (!reportData) {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            {t.selectDateRange}
          </div>
        </div>
      );
    }
    
    switch(selectedReport) {
      case 'revenue-trends':
        return renderRevenueTrendsReport();
      case 'sales-by-product':
        return renderSalesByProductReport();
      case 'sales-by-customer':
        return renderSalesByCustomerReport();
      case 'monthly-sales':
        return renderMonthlySalesReport();
      case 'quarterly-comparison':
        return renderQuarterlyComparisonReport();
      default:
        return null;
    }
  };

  // ถ้ายังโหลดไม่เสร็จ
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.description}
          </p>
        </div>
      </div>
      
      {/* Filters & Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.dateRange}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t.startDate}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t.endDate}
                />
              </div>
            </div>
          </div>
          
          {/* Report Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.reportType}
            </label>
            <select
              value={selectedReport}
              onChange={(e) => handleReportTypeChange(e.target.value as ReportType)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
            >
              <option value="revenue-trends">{t.revenueTrends}</option>
              <option value="sales-by-product">{t.salesByProduct}</option>
              <option value="sales-by-customer">{t.salesByCustomer}</option>
              <option value="monthly-sales">{t.monthlySales}</option>
              <option value="quarterly-comparison">{t.quarterlyComparison}</option>
            </select>
          </div>
          
          {/* Generate Report Button */}
          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full px-4 py-2 flex justify-center items-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <BarChart2 size={16} className="mr-2" />
              {t.generateReport}
            </button>
          </div>
        </div>
        
        {/* Additional Filters Toggle */}
        <div className="mt-4">
          <button
            onClick={toggleFilters}
            className="flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Filter size={16} className="mr-1" />
            {t.filters}
            <ChevronDown size={16} className={`ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
                <select
                  value={productFilter}
                  onChange={handleProductFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                >
                  <option value="all">{t.allProducts}</option>
                  <option value="frozen-food">{t.frozenFood}</option>
                  <option value="pharmaceuticals">{t.pharmaceuticals}</option>
                  <option value="dairy-products">{t.dairyProducts}</option>
                  <option value="medical-supplies">{t.medicalSupplies}</option>
                  <option value="flowers-plants">{t.flowers}</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Report Container */}
      <div ref={reportContainerRef}>
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">{t.loading}</p>
            </div>
          </div>
        ) : (
          <>
            {renderReport()}
            
            {reportData && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => exportReport('pdf')}
                  className="px-4 py-2 flex items-center text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Download size={16} className="mr-2" />
                  {t.exportPDF}
                </button>
                <button
                  onClick={() => exportReport('csv')}
                  className="px-4 py-2 flex items-center text-green-600 dark:text-green-400 border border-green-600 dark:border-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Download size={16} className="mr-2" />
                  {t.exportCSV}
                </button>
                <button
                  onClick={() => exportReport('excel')}
                  className="px-4 py-2 flex items-center text-purple-600 dark:text-purple-400 border border-purple-600 dark:border-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  <Download size={16} className="mr-2" />
                  {t.exportExcel}
                </button>
                <button
                  onClick={printReport}
                  className="px-4 py-2 flex items-center text-gray-600 dark:text-gray-400 border border-gray-600 dark:border-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FileText size={16} className="mr-2" />
                  {t.printReport}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}