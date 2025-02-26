// src/lib/i18n-mock.ts
const translations = {
    en: {
      navigation: {
        services: "Services",
        tracking: "Tracking",
        contact: "Contact",
        login: "Login"
      },
      hero: {
        title: "Temperature-Controlled Logistics Excellence",
        subtitle: "Advanced Cold Chain Solutions with Real-Time Monitoring",
        getStarted: "Get Started",
        learnMore: "Learn More"
      },
      features: {
        temperatureControl: {
          title: "Temperature Control",
          description: "Precise Temperature Monitoring Throughout Transit"
        },
        tracking: {
          title: "Real-Time Tracking",
          description: "GPS Tracking for Complete Shipment Visibility"
        },
        quality: {
          title: "Quality Assured",
          description: "Strict Quality Controls for Product Integrity"
        }
      }
    },
    th: {
      navigation: {
        services: "บริการ",
        tracking: "ติดตามสินค้า",
        contact: "ติดต่อเรา",
        login: "เข้าสู่ระบบ"
      },
      hero: {
        title: "ความเป็นเลิศด้านโลจิสติกส์ควบคุมอุณหภูมิ",
        subtitle: "โซลูชันโซ่ความเย็นขั้นสูงพร้อมการติดตามแบบเรียลไทม์",
        getStarted: "เริ่มต้นใช้งาน",
        learnMore: "เรียนรู้เพิ่มเติม"
      },
      features: {
        temperatureControl: {
          title: "ควบคุมอุณหภูมิ",
          description: "การตรวจสอบอุณหภูมิอย่างแม่นยำตลอดการขนส่ง"
        },
        tracking: {
          title: "การติดตามแบบเรียลไทม์",
          description: "การติดตามด้วย GPS เพื่อการเห็นสถานะการจัดส่งอย่างสมบูรณ์"
        },
        quality: {
          title: "รับประกันคุณภาพ",
          description: "การควบคุมคุณภาพอย่างเข้มงวดเพื่อความสมบูรณ์ของสินค้า"
        }
      }
    }
  };
  
  export function useTranslations(namespace?: string) {
    const locale = 'en'; // Default locale
    
    const t = (key: string) => {
      if (!key) return '';
      
      if (namespace) {
        try {
          const parts = key.split('.');
          let result = translations[locale][namespace];
          
          for (const part of parts) {
            result = result[part];
          }
          
          return result || key;
        } catch (e) {
          return key;
        }
      } else {
        try {
          const parts = key.split('.');
          let result = translations[locale];
          
          for (const part of parts) {
            result = result[part];
          }
          
          return result || key;
        } catch (e) {
          return key;
        }
      }
    };
    
    return t;
  }