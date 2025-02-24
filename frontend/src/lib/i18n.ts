import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      navigation: {
        services: "Services",
        tracking: "Track Shipment",
        contact: "Contact",
        login: "Login"
      },
      hero: {
        title: "Temperature-Controlled Logistics Excellence",
        subtitle: "Advanced cold chain solutions with real-time monitoring and nationwide coverage",
        getStarted: "Get Started",
        learnMore: "Learn More"
      },
      features: {
        temperatureControl: {
          title: "Temperature Control",
          description: "Precise temperature monitoring throughout transit"
        },
        tracking: {
          title: "Real-time Tracking",
          description: "GPS tracking for complete shipment visibility"
        },
        quality: {
          title: "Quality Assured",
          description: "Strict quality controls for product integrity"
        }
      },
      professionalServices: {
        title: "Professional Services",
        subtitle: "Professional temperature-controlled logistics solutions for your valuable cargo",
        temperatureControl: "Temperature Control",
        realTimeTracking: "Real-time Tracking",
        qualityAssurance: "Quality Assurance"
      },
      contact: {
        title: "Contact Us",
        address: "1234 Logistics Way",
        city: "Transport City, TC 12345",
        phone: "Phone",
        phoneNumber: "(123) 456-7890",
        email: "Email",
        emailAddress: "info@coldchain.com"
      },
      footer: {
        quickLinks: "Quick Links",
        about: "About Us",
        services: "Services",
        tracking: "Track Shipment",
        contact: "Contact",
        copyright: "© 2025 ColdChain. All rights reserved."
      },
      auth: {
        loginTitle: "Sign in to your account",
        registerTitle: "Create a new account",
        name: "Full name",
        email: "Email address",
        phone: "Phone number",
        password: "Password",
        confirmPassword: "Confirm password",
        login: "Sign in",
        register: "Register",
        orText: "Or",
        registerLink: "create a new account",
        loginLink: "sign in to your account",
        alreadyHaveAccount: "Already have an account?"
      }
    }
  },
  th: {
    translation: {
      navigation: {
        services: "บริการ",
        tracking: "ติดตามสินค้า",
        contact: "ติดต่อเรา",
        login: "เข้าสู่ระบบ"
      },
      hero: {
        title: "ผู้นำด้านการขนส่งควบคุมอุณหภูมิ",
        subtitle: "โซลูชั่นการขนส่งควบคุมอุณหภูมิพร้อมระบบติดตามแบบเรียลไทม์ครอบคลุมทั่วประเทศ",
        getStarted: "เริ่มต้นใช้งาน",
        learnMore: "เรียนรู้เพิ่มเติม"
      },
      features: {
        temperatureControl: {
          title: "ควบคุมอุณหภูมิ",
          description: "ติดตามอุณหภูมิแบบแม่นยำตลอดการขนส่ง"
        },
        tracking: {
          title: "ติดตามแบบเรียลไทม์",
          description: "ระบบ GPS ติดตามสถานะการจัดส่งแบบเรียลไทม์"
        },
        quality: {
          title: "รับประกันคุณภาพ",
          description: "ระบบควบคุมคุณภาพที่เข้มงวดสำหรับสินค้าที่ต้องดูแลพิเศษ"
        }
      },
      professionalServices: {
        title: "บริการมืออาชีพ",
        subtitle: "บริการขนส่งควบคุมอุณหภูมิมืออาชีพสำหรับสินค้ามีค่าของคุณ",
        temperatureControl: "ควบคุมอุณหภูมิ",
        realTimeTracking: "ติดตามแบบเรียลไทม์",
        qualityAssurance: "รับประกันคุณภาพ"
      },
      contact: {
        title: "ติดต่อเรา",
        address: "1234 ถนนโลจิสติกส์",
        city: "เมืองขนส่ง, TC 12345",
        phone: "โทรศัพท์",
        phoneNumber: "(123) 456-7890",
        email: "อีเมล",
        emailAddress: "info@coldchain.com"
      },
      footer: {
        quickLinks: "ลิงก์ด่วน",
        about: "เกี่ยวกับเรา",
        services: "บริการ",
        tracking: "ติดตามสินค้า",
        contact: "ติดต่อเรา",
        copyright: "© 2025 ColdChain สงวนลิขสิทธิ์"
      },
      auth: {
        loginTitle: "เข้าสู่ระบบ",
        registerTitle: "สร้างบัญชีใหม่",
        name: "ชื่อ-นามสกุล",
        email: "อีเมล",
        phone: "เบอร์โทรศัพท์",
        password: "รหัสผ่าน",
        confirmPassword: "ยืนยันรหัสผ่าน",
        login: "เข้าสู่ระบบ",
        register: "ลงทะเบียน",
        orText: "หรือ",
        registerLink: "สร้างบัญชีใหม่",
        loginLink: "เข้าสู่ระบบ",
        alreadyHaveAccount: "มีบัญชีอยู่แล้ว?"
      }
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;