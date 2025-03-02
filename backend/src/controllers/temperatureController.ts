// backend/src/controllers/temperatureController.ts
// เพิ่มฟังก์ชันสำหรับ Staff

/**
 * เพิ่มบันทึกอุณหภูมิใหม่ (สำหรับ Staff)
 */
export const addTemperatureLogByStaff = async (req: Request, res: Response) => {
  try {
    // ตรวจสอบสิทธิ์การเข้าถึง
    if (!req.user || !['staff', 'admin'].includes(req.user.role)) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    // ตรวจสอบความถูกต้องของข้อมูล
    const { error, value } = validateTemperatureLogInput(req.body);
    if (error) {
      res.status(400).json({ message: error.details[0].message });
      return;
    }

    const { orderId, temperature, humidity, notes } = value;
    
    // ตรวจสอบว่าคำสั่งซื้อมีอยู่จริง
    const order = await OrderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // ดึงข้อมูลสินค้าและช่วงอุณหภูมิที่กำหนด
    const productInfo = await ProductModel.findById(order.product_id);
    const minTemp = productInfo?.min_temperature || 0;
    const maxTemp = productInfo?.max_temperature || 0;

    // ตรวจสอบว่าอุณหภูมิอยู่ในช่วงปกติหรือไม่
    const isAlert = temperature < minTemp || temperature > maxTemp;

    // สร้างบันทึกอุณหภูมิใหม่
    const temperatureLog = await TemperatureLogModel.create({
      order_id: orderId,
      temperature,
      humidity: humidity || null,
      is_alert: isAlert,
      notes: notes || null,
      recorded_by: req.user.id
    });

    // ถ้าอุณหภูมิไม่อยู่ในช่วงที่กำหนด ส่งการแจ้งเตือน
    if (isAlert) {
      // บันทึกการแจ้งเตือน
      await AlertModel.create({
        order_id: orderId,
        type: 'temperature',
        message: `Temperature out of range: ${temperature}°C (Range: ${minTemp}°C - ${maxTemp}°C)`,
        severity: (temperature < minTemp - 5 || temperature > maxTemp + 5) ? 'high' : 'medium',
        acknowledged: false
      });
      
      // ส่งการแจ้งเตือนไปยังแอดมินและลูกค้า
      await notificationService.sendAlert({
        order_id: orderId,
        temperature,
        threshold: { min: minTemp, max: maxTemp },
        timestamp: new Date()
      });
    }
    
    res.status(201).json({ 
      message: 'Temperature log added successfully', 
      temperatureLog,
      isAlert
    });
  } catch (error) {
    console.error('Add temperature log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};