'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/providers/LanguageProvider';
import { 
  Search, Filter, RefreshCw, Download, FileText, Calendar, 
  ChevronDown, Thermometer, TrendingDown, TrendingUp, AlertCircle, CheckCircle, Truck
} from 'lucide-react';
import Link from 'next/link';

// สำหรับแสดงกราฟ
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// ลงทะเบียนส่วนประกอบของ Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DateRange {
  start: string;
  end: string;
}

interface DeviationData {
  vehicle: string;
  avgDeviation: number;
  maxDeviation: number;
  minTemp: number;
  maxTemp: number;
  expectedRange: string;
}

interface AlertData {
  id: string;
  date: string;
  orderNumber: string;
  temperature: number;
  expectedRange: string;
  vehicle: string;
  customer: string;
  product: string;
}

interface AlertSummary {
  totalAlerts: number;
  highPriorityAlerts: number;
  mediumPriorityAlerts: number;
  lowPriorityAlerts: number;
  alertsByVehicle: Record<string, number>;
  alertsByProductType: Record<string, number>;
}

interface VehicleData {
  vehicle: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  expectedRange: string;
  complianceRate: number;
  tripCount: number;
}

interface ProductData {
  product: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  expectedRange: string;
  complianceRate: number;
  shipmentCount: number;
}

interface TemperatureStats {
  averageTemperatureChilled: number;
  averageTemperatureFrozen: number;
  highestTemperatureChilled: number;
  lowestTemperatureChilled: number;
  highestTemperatureFrozen: number;
  lowestTemperatureFrozen: number;
  temperatureViolations: number;
  complianceRate: number;
}

interface TemperatureReportData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string | string[];
    backgroundColor: string | string[];
    tension?: number;
    borderWidth?: number;
    fill?: boolean;
  }>;
  stats?: TemperatureStats;
  deviations?: DeviationData[];
  alerts?: AlertData[];
  summary?: AlertSummary;
  vehicleData?: VehicleData[];
  productData?: ProductData[];
}

type ReportType = 'temperature-trends' | 'temperature-deviations' | 
  'temperature-alerts' | 'temperature-by-vehicle' | 'temperature-by-product';

export default function TemperatureReportsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: '',
    end: ''
  });
  const [selectedReport, setSelectedReport] = useState<ReportType>('temperature-trends');
  const [reportData, setReportData] = useState<TemperatureReportData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);

  const translations = {
    th: {
      title: 'รายงานอุณหภูมิ',
      description: 'ดูรายงานและแนวโน้มอุณหภูมิของการขนส่งสินค้าควบคุมอุณหภูมิ',
      dateRange: 'ช่วงวันที่',
      startDate: 'วันที่เริ่มต้น',
      endDate: 'วันที่สิ้นสุด',
      search: 'ค้นหาตามหมายเลขพัสดุหรือลูกค้า',
      vehicle: 'ยานพาหนะ',
      allVehicles: 'ทุกยานพาหนะ',
      refresh: 'รีเฟรช',
      export: 'ส่งออก',
      generateReport: 'สร้างรายงาน',
      reportType: 'ประเภทรายงาน',
      temperatureTrends: 'แนวโน้มอุณหภูมิ',
      temperatureDeviations: 'การเบี่ยงเบนอุณหภูมิ',
      temperatureAlerts: 'การแจ้งเตือนอุณหภูมิ',
      temperatureByVehicle: 'อุณหภูมิตามยานพาหนะ',
      temperatureByProduct: 'อุณหภูมิตามประเภทสินค้า',
      filters: 'ตัวกรอง',
      loading: 'กำลังโหลด...',
      noData: 'ไม่พบข้อมูลสำหรับช่วงเวลาที่เลือก',
      selectDateRange: 'กรุณาเลือกช่วงวันที่และสร้างรายงาน',
      averageTemperature: 'อุณหภูมิเฉลี่ย',
      temperatureViolations: 'จำนวนการละเมิดอุณหภูมิ',
      maxDeviation: 'การเบี่ยงเบนสูงสุด',
      complianceRate: 'อัตราการปฏิบัติตามข้อกำหนด',
      date: 'วันที่',
      temperature: 'อุณหภูมิ',
      product: 'ประเภทสินค้า',
      expectedRange: 'ช่วงอุณหภูมิที่กำหนด',
      exportPDF: 'ส่งออกเป็น PDF',
      exportCSV: 'ส่งออกเป็น CSV',
      exportExcel: 'ส่งออกเป็น Excel',
      printReport: 'พิมพ์รายงาน',
      highestTemperature: 'อุณหภูมิสูงสุด',
      lowestTemperature: 'อุณหภูมิต่ำสุด'
    },
    en: {
      title: 'Temperature Reports',
      description: 'View temperature reports and trends for temperature-controlled shipments',
      dateRange: 'Date Range',
      startDate: 'Start Date',
      endDate: 'End Date',
      search: 'Search by tracking number or customer',
      vehicle: 'Vehicle',
      allVehicles: 'All Vehicles',
      refresh: 'Refresh',
      export: 'Export',
      generateReport: 'Generate Report',
      reportType: 'Report Type',
      temperatureTrends: 'Temperature Trends',
      temperatureDeviations: 'Temperature Deviations',
      temperatureAlerts: 'Temperature Alerts',
      temperatureByVehicle: 'Temperature by Vehicle',
      temperatureByProduct: 'Temperature by Product Type',
      filters: 'Filters',
      loading: 'Loading...',
      noData: 'No data found for the selected period',
      selectDateRange: 'Please select a date range and generate a report',
      averageTemperature: 'Average Temperature',
      temperatureViolations: 'Temperature Violations',
      maxDeviation: 'Maximum Deviation',
      complianceRate: 'Compliance Rate',
      date: 'Date',
      temperature: 'Temperature',
      product: 'Product Type',
      expectedRange: 'Expected Range',
      exportPDF: 'Export as PDF',
      exportCSV: 'Export as CSV',
      exportExcel: 'Export as Excel',
      printReport: 'Print Report',
      highestTemperature: 'Highest Temperature',
      lowestTemperature: 'Lowest Temperature'
    }
  };

  const t = translations[language] || translations.en;

  useEffect(() => {
    setMounted(true);
    
    // ตรวจสอบการเข้าสู่ระบบและสิทธิ์
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/login';
      return;
    }
    
    if (!isLoading && isAuthenticated && user?.role !== 'admin') {
      window.location.href = '/dashboard';
      return;
    }
    
    // ตั้งค่าค่าเริ่มต้นของวันที่
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleVehicleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVehicleFilter(e.target.value);
  };
  
  const handleReportTypeChange = (reportType: ReportType) => {
    setSelectedReport(reportType);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const refreshData = () => {
    generateReport();
  };

  const generateReport = async () => {
    setLoading(true);
    
    try {
      // จำลองการเรียก API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // ข้อมูลจำลองสำหรับรายงานแนวโน้มอุณหภูมิ
      if (selectedReport === 'temperature-trends') {
        const mockData: TemperatureReportData = {
          labels: ['Mar 1', 'Mar 2', 'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9', 'Mar 10'],
          datasets: [
            {
              label: '2-8°C Range',
              data: [4.2, 4.5, 4.8, 5.2, 6.1, 5.8, 6.2, 5.9, 4.7, 4.5],
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.3
            },
            {
              label: '-18--20°C Range',
              data: [-19.5, -19.2, -19.8, -19.6, -18.9, -19.1, -19.4, -19.7, -19.3, -19.5],
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.3
            }
          ],
          stats: {
            averageTemperatureChilled: 5.19,
            averageTemperatureFrozen: -19.4,
            highestTemperatureChilled: 6.2,
            lowestTemperatureChilled: 4.2,
            highestTemperatureFrozen: -18.9,
            lowestTemperatureFrozen: -19.8,
            temperatureViolations: 3,
            complianceRate: 96.7
          }
        };
        
        setReportData(mockData);
      }
      
      // ข้อมูลจำลองสำหรับรายงานการเบี่ยงเบนอุณหภูมิ
      else if (selectedReport === 'temperature-deviations') {
        const mockData: TemperatureReportData = {
          labels: ['Truck XL-01', 'Truck MD-02', 'Van SM-03', 'Truck LG-04', 'Van SM-05'],
          datasets: [
            {
              label: 'Average Deviation (°C)',
              data: [0.8, 0.3, 1.2, 0.5, 0.4],
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
              borderColor: 'rgb(255, 159, 64)',
              borderWidth: 1
            }
          ],
          deviations: [
            { vehicle: 'Truck XL-01', avgDeviation: 0.8, maxDeviation: 1.6, minTemp: -19.2, maxTemp: -18.2, expectedRange: '-20°C to -18°C' },
            { vehicle: 'Truck MD-02', avgDeviation: 0.3, maxDeviation: 0.7, minTemp: 3.7, maxTemp: 5.2, expectedRange: '2°C to 6°C' },
            { vehicle: 'Van SM-03', avgDeviation: 1.2, maxDeviation: 2.1, minTemp: 1.8, maxTemp: 7.5, expectedRange: '2°C to 6°C' },
            { vehicle: 'Truck LG-04', avgDeviation: 0.5, maxDeviation: 1.1, minTemp: -20.2, maxTemp: -19.1, expectedRange: '-20°C to -18°C' },
            { vehicle: 'Van SM-05', avgDeviation: 0.4, maxDeviation: 0.9, minTemp: 3.2, maxTemp: 4.8, expectedRange: '2°C to 6°C' }
          ]
        };
        
        setReportData(mockData);
      }
      
      // ข้อมูลจำลองสำหรับรายงานการแจ้งเตือนอุณหภูมิ
      else if (selectedReport === 'temperature-alerts') {
        const mockData: TemperatureReportData = {
          labels: [],
          datasets: [],
          alerts: [
            { 
              id: '1', 
              date: '2025-03-01', 
              orderNumber: 'ORD-20250301-1234', 
              temperature: -16.5, 
              expectedRange: '-20°C to -18°C', 
              vehicle: 'Truck XL-01', 
              customer: 'John Doe', 
              product: 'Frozen Food' 
            },
            { 
              id: '2', 
              date: '2025-02-28', 
              orderNumber: 'ORD-20250228-9876', 
              temperature: 7.3, 
              expectedRange: '2°C to 6°C', 
              vehicle: 'Truck MD-02', 
              customer: 'Jane Smith', 
              product: 'Pharmaceuticals' 
            },
            { 
              id: '3', 
              date: '2025-02-27', 
              orderNumber: 'ORD-20250227-5432', 
              temperature: 1.8, 
              expectedRange: '2°C to 6°C', 
              vehicle: 'Van SM-03', 
              customer: 'David Johnson', 
              product: 'Dairy Products' 
            },
            { 
              id: '4', 
              date: '2025-02-26', 
              orderNumber: 'ORD-20250226-4321', 
              temperature: -21.2, 
              expectedRange: '-20°C to -18°C', 
              vehicle: 'Truck LG-04', 
              customer: 'Sarah Williams', 
              product: 'Frozen Seafood' 
            },
            { 
              id: '5', 
              date: '2025-02-25', 
              orderNumber: 'ORD-20250225-7654', 
              temperature: 6.8, 
              expectedRange: '2°C to 6°C', 
              vehicle: 'Van SM-05', 
              customer: 'Michael Brown', 
              product: 'Medical Supplies' 
            }
          ],
          summary: {
            totalAlerts: 5,
            highPriorityAlerts: 2,
            mediumPriorityAlerts: 2,
            lowPriorityAlerts: 1,
            alertsByVehicle: {
              'Truck XL-01': 1,
              'Truck MD-02': 1,
              'Van SM-03': 1,
              'Truck LG-04': 1,
              'Van SM-05': 1
            },
            alertsByProductType: {
              'Frozen Food': 1,
              'Pharmaceuticals': 1,
              'Dairy Products': 1,
              'Frozen Seafood': 1,
              'Medical Supplies': 1
            }
          }
        };
        
        setReportData(mockData);
      }
      
      // ข้อมูลจำลองสำหรับรายงานอุณหภูมิตามยานพาหนะ
      else if (selectedReport === 'temperature-by-vehicle') {
        const mockData: TemperatureReportData = {
          labels: ['Truck XL-01', 'Truck MD-02', 'Van SM-03', 'Truck LG-04', 'Van SM-05'],
          datasets: [
            {
              label: 'Average Temperature (°C)',
              data: [-19.2, 4.2, 3.5, -19.5, 3.8],
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
          vehicleData: [
            { 
              vehicle: 'Truck XL-01', 
              avgTemp: -19.2, 
              minTemp: -20.1, 
              maxTemp: -18.2, 
              expectedRange: '-20°C to -18°C', 
              complianceRate: 94.5,
              tripCount: 12
            },
            { 
              vehicle: 'Truck MD-02', 
              avgTemp: 4.2, 
              minTemp: 2.8, 
              maxTemp: 5.6, 
              expectedRange: '2°C to 6°C', 
              complianceRate: 98.2,
              tripCount: 15
            },
            { 
              vehicle: 'Van SM-03', 
              avgTemp: 3.5, 
              minTemp: 1.8, 
              maxTemp: 5.9, 
              expectedRange: '2°C to 6°C', 
              complianceRate: 92.8,
              tripCount: 8
            },
            { 
              vehicle: 'Truck LG-04', 
              avgTemp: -19.5, 
              minTemp: -20.4, 
              maxTemp: -18.7, 
              expectedRange: '-20°C to -18°C', 
              complianceRate: 96.3,
              tripCount: 10
            },
            { 
              vehicle: 'Van SM-05', 
              avgTemp: 3.8, 
              minTemp: 2.5, 
              maxTemp: 5.4, 
              expectedRange: '2°C to 6°C', 
              complianceRate: 97.5,
              tripCount: 7
            }
          ]
        };
        
        setReportData(mockData);
      }
      
      // ข้อมูลจำลองสำหรับรายงานอุณหภูมิตามประเภทสินค้า
      else if (selectedReport === 'temperature-by-product') {
        const mockData: TemperatureReportData = {
          labels: ['Frozen Food', 'Pharmaceuticals', 'Dairy Products', 'Medical Supplies', 'Flowers'],
          datasets: [
            {
              label: 'Average Temperature (°C)',
              data: [-19.3, 4.5, 3.8, 4.2, 5.1],
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
            { 
              product: 'Frozen Food', 
              avgTemp: -19.3, 
              minTemp: -20.2, 
              maxTemp: -18.1, 
              expectedRange: '-20°C to -18°C', 
              complianceRate: 95.2,
              shipmentCount: 18
            },
            { 
              product: 'Pharmaceuticals', 
              avgTemp: 4.5, 
              minTemp: 2.2, 
              maxTemp: 5.9, 
              expectedRange: '2°C to 6°C', 
              complianceRate: 97.8,
              shipmentCount: 12
            },
            { 
              product: 'Dairy Products', 
              avgTemp: 3.8, 
              minTemp: 1.6, 
              maxTemp: 5.7, 
              expectedRange: '2°C to 6°C', 
              complianceRate: 93.5,
              shipmentCount: 15
            },
            { 
              product: 'Medical Supplies', 
              avgTemp: 4.2, 
              minTemp: 2.5, 
              maxTemp: 5.6, 
              expectedRange: '2°C to 6°C', 
              complianceRate: 98.1,
              shipmentCount: 9
            },
            { 
              product: 'Flowers', 
              avgTemp: 5.1, 
              minTemp: 3.2, 
              maxTemp: 6.4, 
              expectedRange: '4°C to 8°C', 
              complianceRate: 96.7,
              shipmentCount: 7
            }
          ]
        };
        
        setReportData(mockData);
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: string) => {
    // จำลองการส่งออกรายงาน
    console.log(`Exporting report in ${format} format...`);
    alert(`Report would be exported as ${format} in a real implementation.`);
  };

  const printReport = () => {
    // จำลองการพิมพ์รายงาน
    window.print();
  };

  const renderTemperatureTrendsReport = () => {
    if (!reportData || !reportData.stats) return null;
    
    const { labels, datasets, stats } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: t.temperatureTrends,
        },
      },
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.temperatureTrends}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.averageTemperature} (2-8°C)</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.averageTemperatureChilled.toFixed(1)}°C</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.averageTemperature} (-20--18°C)</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.averageTemperatureFrozen.toFixed(1)}°C</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.temperatureViolations}</h4>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.temperatureViolations}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.complianceRate}</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.complianceRate}%</p>
            </div>
          </div>
          
          <div className="h-96">
            <Line options={options} data={{ labels, datasets }} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">2-8°C Range</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.highestTemperature}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.highestTemperatureChilled}°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.lowestTemperature}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.lowestTemperatureChilled}°C</p>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">-18--20°C Range</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.highestTemperature}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.highestTemperatureFrozen}°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.lowestTemperature}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{stats.lowestTemperatureFrozen}°C</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTemperatureDeviationsReport = () => {
    if (!reportData || !reportData.deviations) return null;
    
    const { labels, datasets, deviations } = reportData;
  
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: t.temperatureDeviations,
        },
      },
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.temperatureDeviations}</h3>
          </div>
          
          <div className="h-80 mb-6">
            <Bar options={options} data={{ labels, datasets }} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.vehicle}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.expectedRange}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.averageTemperature}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.maxDeviation}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {deviations.map((deviation, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {deviation.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {deviation.expectedRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Thermometer 
                          size={16} 
                          className={`mr-1 ${
                            Math.abs(deviation.avgDeviation) > 1 ? 'text-red-500' : 'text-green-500'
                          }`} 
                        />
                        <span className={`font-medium ${
                          Math.abs(deviation.avgDeviation) > 1
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {deviation.minTemp} to {deviation.maxTemp}°C
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {deviation.maxDeviation > 1 ? (
                          <TrendingUp size={16} className="text-red-500 mr-1" />
                        ) : (
                          <TrendingDown size={16} className="text-green-500 mr-1" />
                        )}
                        <span className={`font-medium ${
                          deviation.maxDeviation > 1
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {deviation.maxDeviation}°C
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

  const renderTemperatureAlertsReport = () => {
    if (!reportData || !reportData.alerts || !reportData.summary) return null;
    
    const { alerts, summary } = reportData;
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.temperatureAlerts}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">{t.temperatureAlerts}</h4>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.totalAlerts}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">High Priority</h4>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.highPriorityAlerts}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">Medium Priority</h4>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.mediumPriorityAlerts}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="text-sm text-gray-500 dark:text-gray-400">Low Priority</h4>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{summary.lowPriorityAlerts}</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.date}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.temperature}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.expectedRange}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.vehicle}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.product}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(alert.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        <Link href={`/admin/orders/${alert.orderNumber}`}>
                          {alert.orderNumber}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AlertCircle 
                          size={16} 
                          className="text-red-500 mr-1" 
                        />
                        <span className="font-medium text-red-600 dark:text-red-400">
                          {alert.temperature}°C
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {alert.expectedRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {alert.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {alert.product}
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

  const renderTemperatureByVehicleReport = () => {
    if (!reportData || !reportData.vehicleData) return null;
    
    const { labels, datasets, vehicleData } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: t.temperatureByVehicle,
        },
      },
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.temperatureByVehicle}</h3>
          </div>
          
          <div className="h-80 mb-6">
            <Bar options={options} data={{ labels, datasets }} />
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.vehicle}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.expectedRange}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.averageTemperature}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trips
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.complianceRate}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {vehicleData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {data.vehicle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {data.expectedRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Thermometer 
                          size={16} 
                          className="mr-1 text-blue-500" 
                        />
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {data.avgTemp}°C ({data.minTemp} - {data.maxTemp}°C)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.tripCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {data.complianceRate >= 95 ? (
                          <CheckCircle size={16} className="text-green-500 mr-1" />
                        ) : (
                          <AlertCircle size={16} className="text-yellow-500 mr-1" />
                        )}
                        <span className={`font-medium ${
                          data.complianceRate >= 95
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {data.complianceRate}%
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

  const renderTemperatureByProductReport = () => {
    if (!reportData || !reportData.productData) return null;
    
    const { labels, datasets, productData } = reportData;
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: t.temperatureByProduct,
        },
      },
    };
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.temperatureByProduct}</h3>
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
                    {t.expectedRange}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.averageTemperature}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Shipments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {t.complianceRate}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {productData.map((data, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {data.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {data.expectedRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Thermometer 
                          size={16} 
                          className="mr-1 text-blue-500" 
                        />
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {data.avgTemp}°C ({data.minTemp} - {data.maxTemp}°C)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {data.shipmentCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {data.complianceRate >= 95 ? (
                          <CheckCircle size={16} className="text-green-500 mr-1" />
                        ) : (
                          <AlertCircle size={16} className="text-yellow-500 mr-1" />
                        )}
                        <span className={`font-medium ${
                          data.complianceRate >= 95
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {data.complianceRate}%
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
      case 'temperature-trends':
        return renderTemperatureTrendsReport();
      case 'temperature-deviations':
        return renderTemperatureDeviationsReport();
      case 'temperature-alerts':
        return renderTemperatureAlertsReport();
      case 'temperature-by-vehicle':
        return renderTemperatureByVehicleReport();
      case 'temperature-by-product':
        return renderTemperatureByProductReport();
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.description}
        </p>
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
              <option value="temperature-trends">{t.temperatureTrends}</option>
              <option value="temperature-deviations">{t.temperatureDeviations}</option>
              <option value="temperature-alerts">{t.temperatureAlerts}</option>
              <option value="temperature-by-vehicle">{t.temperatureByVehicle}</option>
              <option value="temperature-by-product">{t.temperatureByProduct}</option>
            </select>
          </div>
          
          {/* Generate Report Button */}
          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full px-4 py-2 flex justify-center items-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <FileText size={16} className="mr-2" />
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
                <Truck className="absolute left-3 top-3 text-gray-400" size={18} />
                <select
                  value={vehicleFilter}
                  onChange={handleVehicleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none"
                >
                  <option value="all">{t.allVehicles}</option>
                  <option value="truck-xl-01">Truck XL-01</option>
                  <option value="truck-md-02">Truck MD-02</option>
                  <option value="van-sm-03">Van SM-03</option>
                  <option value="truck-lg-04">Truck LG-04</option>
                  <option value="van-sm-05">Van SM-05</option>
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