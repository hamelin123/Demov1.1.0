// frontend/src/components/temperature/TemperatureChart.tsx
'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { ArrowLeft, ArrowRight, Thermometer, Droplets, Info } from 'lucide-react';

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
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ 
  data,
  acceptableRange = { min: -20, max: -15 },
  showHumidity = true
}) => {
  const { t } = useI18n();
  const [chartData, setChartData] = useState<TemperatureLogData[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12); // 12 data points per page
  
  useEffect(() => {
    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    setChartData(sortedData);
  }, [data]);
  
  // Calculate total pages
  const totalPages = Math.ceil(chartData.length / pageSize);
  
  // Get current page data
  const currentPageData = chartData.slice(page * pageSize, (page + 1) * pageSize);
  
  // Calculate statistics
  const minTemp = Math.min(...chartData.map(d => d.temperature));
  const maxTemp = Math.max(...chartData.map(d => d.temperature));
  const avgTemp = chartData.length 
    ? chartData.reduce((sum, d) => sum + d.temperature, 0) / chartData.length 
    : 0;
  
  // Handle pagination
  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };
  
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };
  
  // Calculate chart dimensions
  const chartHeight = 200;
  const chartWidth = 100;
  
  // Calculate temperature range for scaling
  const tempRange = 15; // Range in degrees to display
  const minDisplay = Math.min(acceptableRange.min - 5, minTemp - 2);
  const maxDisplay = Math.max(acceptableRange.max + 5, maxTemp + 2);
  
  // Function to calculate y position
  const getYPosition = (temp: number) => {
    const range = maxDisplay - minDisplay;
    const percentage = (temp - minDisplay) / range;
    return chartHeight - (percentage * chartHeight);
  };
  
  // No data
  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{t('temperature.temperatureHistory')}</h3>
        <div className="flex flex-col items-center justify-center py-8">
          <Thermometer size={48} className="text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('temperature.noData')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t('temperature.temperatureHistory')}</h3>
        
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrevPage}
              disabled={page === 0}
              className={`p-1 rounded-full ${
                page === 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('common.pageXofY', { current: page + 1, total: totalPages })}
            </span>
            <button 
              onClick={handleNextPage}
              disabled={page >= totalPages - 1}
              className={`p-1 rounded-full ${
                page >= totalPages - 1
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
              }`}
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
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('temperature.temperature')}
          </span>
        </div>
        
        {showHumidity && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('temperature.humidity')}
            </span>
          </div>
        )}
        
        <div className="flex items-center">
          <div className="w-6 h-2 bg-red-300 dark:bg-red-700 mr-1"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('temperature.acceptableRange')}
          </span>
        </div>
      </div>
      
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t('temperature.minTemp')}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{minTemp.toFixed(1)}°C</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t('temperature.avgTemp')}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{avgTemp.toFixed(1)}°C</div>
        </div>
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <div className="text-xs text-gray-500 dark:text-gray-400">{t('temperature.maxTemp')}</div>
          <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{maxTemp.toFixed(1)}°C</div>
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
        
        {/* Data points */}
        {currentPageData.map((point, index) => {
          const x = (index / (currentPageData.length - 1 || 1)) * 100;
          const y = getYPosition(point.temperature);
          
          return (
            <div key={point.id || index} className="absolute" style={{ left: `${x}%`, top: `${y}px` }}>
              <div 
                className={`w-3 h-3 rounded-full -ml-1.5 -mt-1.5 ${
                  point.is_alert ? 'bg-red-500' : 'bg-blue-500'
                }`}
                title={`${point.temperature.toFixed(1)}°C - ${new Date(point.timestamp).toLocaleString()}`}
              ></div>
            </div>
          );
        })}
        
        {/* Connect the dots */}
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
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
        {currentPageData.map((point, index) => {
          // Show labels for first, last, and every 4th point to avoid overcrowding
          if (index === 0 || index === currentPageData.length - 1 || index % 4 === 0) {
            return (
              <div key={index} className="text-center" style={{ width: '40px', marginLeft: index === 0 ? 0 : `-20px` }}>
                {new Date(point.timestamp).toLocaleDateString()}
              </div>
            );
          }
          return null;
        })}
      </div>
      
      {/* Alert information */}
      {chartData.some(d => d.is_alert) && (
        <div className="mt-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md flex items-start">
          <Info size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">{t('temperature.alertsDetected')}</p>
            <p className="text-xs mt-1">{t('temperature.alertsDescription')}</p>
          </div>
        </div>
      )}
    </div>
  );
};