// Optimized ManualLogForm.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  orderId: string;
  onSuccess?: () => void;
  language?: 'en' | 'th';
}

export function ManualLogForm({ orderId, onSuccess, language = 'en' }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ temperature: '', humidity: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const t = {
    en: {
      title: 'Add Temperature Reading',
      temp: 'Temperature (°C) *',
      humidity: 'Humidity (%)',
      notes: 'Notes',
      notesPlaceholder: 'Enter any observations or comments',
      submit: 'Submit Reading',
      submitting: 'Submitting...',
      success: 'Temperature log added successfully',
      validation: 'Please enter a valid temperature value',
      humidityRange: 'Humidity must be between 0-100%',
      cancel: 'Cancel'
    },
    th: {
      title: 'เพิ่มค่าอุณหภูมิ',
      temp: 'อุณหภูมิ (°C) *',
      humidity: 'ความชื้น (%)',
      notes: 'บันทึกเพิ่มเติม',
      notesPlaceholder: 'ใส่ข้อสังเกตหรือความคิดเห็น',
      submit: 'บันทึกค่า',
      submitting: 'กำลังบันทึก...',
      success: 'บันทึกอุณหภูมิสำเร็จ',
      validation: 'กรุณาใส่ค่าอุณหภูมิที่ถูกต้อง',
      humidityRange: 'ความชื้นต้องอยู่ระหว่าง 0-100%',
      cancel: 'ยกเลิก'
    }
  }[language];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate input
      const temp = parseFloat(form.temperature);
      if (isNaN(temp)) throw new Error(t.validation);

      // Optional humidity validation
      if (form.humidity) {
        const humidity = parseFloat(form.humidity);
        if (isNaN(humidity) || humidity < 0 || humidity > 100) 
          throw new Error(t.humidityRange);
      }

      // Submit data
      // await temperatureService.addLog({ orderId, temperature: temp, ... });
      
      // Simulate API call for now
      await new Promise(r => setTimeout(r, 800));

      setSuccess(true);
      setForm({ temperature: '', humidity: '', notes: '' });
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{t.title}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-md flex items-start">
          <CheckCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{t.success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.temp}</label>
          <input type="number" name="temperature" step="0.1" required
            value={form.temperature} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"
            placeholder="-18.5" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{t.humidity}</label>
          <input type="number" name="humidity" step="0.1" min="0" max="100"
            value={form.humidity} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg"
            placeholder="65.0" />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{t.notes}</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
            className="w-full px-4 py-2 border rounded-lg" placeholder={t.notesPlaceholder}></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 border rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            {t.cancel}
          </button>
          <button type="submit" disabled={loading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${loading ? 'opacity-70' : ''}`}>
            {loading ? t.submitting : t.submit}
          </button>
        </div>
      </form>
    </div>
  );
}