// Optimized TemperatureChart.tsx
'use client';

import { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Thermometer, Info } from 'lucide-react';

interface TemperatureLogData {
  id: string;
  temperature: number;
  humidity?: number;
  timestamp: string;
  is_alert: boolean;
}

interface TemperatureChartProps {
  data: TemperatureLogData[];
  acceptableRange?: { min: number; max: number };
  showHumidity?: boolean;
  title?: string;
  language?: 'en' | 'th';
}

export function TemperatureChart({ 
  data,
  acceptableRange = { min: -20, max: -15 },
  showHumidity = true,
  title,
  language = 'en'
}: TemperatureChartProps) {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(12);
  
  const t = {
    en: {
      temperatureHistory: 'Temperature History',
      temperature: 'Temperature',
      humidity: 'Humidity',
      acceptableRange: 'Acceptable Range',
      minTemp: 'Min Temp',
      avgTemp: 'Avg Temp',
      maxTemp: 'Max Temp',
      alertsDetected: 'Temperature Alerts Detected',
      alertsDescription: 'Temperature readings outside acceptable range.',
      noData: 'No temperature data available',
      pageXofY: 'Page {current} of {total}'
    },
    th: {
      temperatureHistory: 'ประวัติอุณหภูมิ',
      temperature: 'อุณหภูมิ',
      humidity: 'ความชื้น',
      acceptableRange: 'ช่วงอุณหภูมิที่ยอมรับได้',
      minTemp: 'อุณหภูมิต่ำสุด',
      avgTemp: 'อุณหภูมิเฉลี่ย',
      maxTemp: 'อุณหภูมิสูงสุด',
      alertsDetected: 'ตรวจพบการแจ้งเตือนอุณหภูมิ',
      alertsDescription: 'อุณหภูมิบางค่าอยู่นอกช่วงที่ยอมรับได้',
      noData: 'ไม่มีข้อมูลอุณหภูมิ',
      pageXofY: 'หน้า {current} จาก {total}'
    }
  }[language];
  
  // Sort data and compute stats once
  const { sortedData, stats, totalPages, currentPageData } = useMemo(() => {
    if (!data.length) return { sortedData: [], stats: {min: 0, max: 0, avg: 0}, totalPages: 0, currentPageData: [] };
    
    const sorted = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const temps = sorted.map(d => d.temperature);
    const stats = {
      min: Math.min(...temps),
      max: Math.max(...temps),
      avg: temps.reduce((sum, t) => sum + t, 0) / temps.length
    };
    
    const totalPages = Math.ceil(sorted.length / pageSize);
    const current = sorted.slice(page * pageSize, (page + 1) * pageSize);
    
    return { sortedData: sorted, stats, totalPages, currentPageData: current };
  }, [data, page, pageSize]);
  
  // No data check
  if (!sortedData.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title || t.temperatureHistory}</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <Thermometer size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t.noData}</p>
        </div>
      </div>
    );
  }
  
  // Chart dimensions
  const chartHeight = 200;
  
  // Calculate temperature range for scaling
  const minDisplay = Math.min(acceptableRange.min - 5, stats.min - 2);
  const maxDisplay = Math.max(acceptableRange.max + 5, stats.max + 2);
  
  // Function to calculate y position
  const getYPosition = (temp: number) => {
    const range = maxDisplay - minDisplay;
    if (range === 0) return chartHeight / 2;
    return chartHeight - ((temp - minDisplay) / range * chartHeight);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{title || t.temperatureHistory}</h3>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`p-1 rounded-full ${page === 0 ? 'text-gray-400' : 'text-blue-600'}`}
              aria-label="Previous page"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t.pageXofY.replace('{current}', String(page + 1)).replace('{total}', String(totalPages))}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={`p-1 rounded-full ${page >= totalPages - 1 ? 'text-gray-400' : 'text-blue-600'}`}
              aria-label="Next page"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      
      {/* Chart Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{t.temperature}</span>
        </div>
        
        {showHumidity && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{t.humidity}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <div className="w-6 h-2 bg-red-300 dark:bg-red-700 mr-1"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{t.acceptableRange}</span>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t.minTemp}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.min.toFixed(1)}°C</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t.avgTemp}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.avg.toFixed(1)}°C</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t.maxTemp}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{stats.max.toFixed(1)}°C</div>
        </div>
      </div>
      
      {/* Simple Chart Visualization */}
      <div className="relative h-64 border-b border-l border-gray-300 dark:border-gray-600 mb-4">
        {/* Acceptable range horizontal band */}
        <div 
          className="absolute left-0 right-0 bg-red-200/30 dark:bg-red-900/20 border-t border-b border-red-300 dark:border-red-700"
          style={{
            top: `${getYPosition(acceptableRange.max)}px`,
            height: `${getYPosition(acceptableRange.min) - getYPosition(acceptableRange.max)}px`
          }}
        ></div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 -ml-14">
          <div>{maxDisplay.toFixed(0)}°C</div>
          <div>{((maxDisplay + minDisplay) / 2).toFixed(0)}°C</div>
          <div>{minDisplay.toFixed(0)}°C</div>
        </div>
        
        {/* Connect the dots with a line */}
        <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
          <polyline
            points={currentPageData.map((point, index) => {
              const x = (index / (currentPageData.length - 1 || 1)) * 100;
              const y = getYPosition(point.temperature);
              return `${x},${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(59, 130, 246, 0.5)"
            strokeWidth="2"
          />
        </svg>
        
        {/* Data points */}
        {currentPageData.map((point, index) => {
          const x = (index / (currentPageData.length - 1 || 1)) * 100;
          const y = getYPosition(point.temperature);
          
          return (
            <div 
              key={point.id || index} 
              className="absolute" 
              style={{ left: `${x}%`, top: `${y}px` }}
              title={`${point.temperature.toFixed(1)}°C - ${new Date(point.timestamp).toLocaleString()}`}
            >
              <div className={`w-3 h-3 rounded-full -ml-1.5 -mt-1.5 ${point.is_alert ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            </div>
          );
        })}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
        {currentPageData.filter((_, i) => i === 0 || i === currentPageData.length - 1 || i % 4 === 0)
          .map((point, i) => (
            <div key={i} className="text-center w-10 overflow-hidden text-ellipsis">
              {new Date(point.timestamp).toLocaleDateString()}
            </div>
          ))
        }
      </div>
      
      {/* Alert information */}
      {sortedData.some(d => d.is_alert) && (
        <div className="mt-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-start">
          <Info size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{t.alertsDetected}</p>
            <p className="text-xs mt-1">{t.alertsDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
}