import { Metadata } from 'next';
import ClientWrapper from '@/components/ClientWrapper';
import ContactForm from '@/components/ContactForm';
import { Facebook, Twitter, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ColdChain - Contact Us',
  description: 'Get in touch with our team for cold chain logistics solutions and services.',
};

export default function ContactPage() {
  const socialLinks = [
    { 
      Icon: Facebook, 
      href: 'https://facebook.com/coldchain', 
      label: 'Facebook' 
    },
    { 
      Icon: Twitter, 
      href: 'https://twitter.com/coldchain', 
      label: 'Twitter' 
    },
    { 
      Icon: Linkedin, 
      href: 'https://linkedin.com/company/coldchain', 
      label: 'LinkedIn' 
    }
  ];

  return (
    <ClientWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center space-x-4">
                <Phone className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                <div>
                  <h3 className="text-lg font-medium">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-300">+66 2 123 4567</p>
                </div>
              </div>
              
              {/* Email */}
              <div className="flex items-center space-x-4">
                <Mail className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                <div>
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">contact@coldchain.example.com</p>
                </div>
              </div>
              
              {/* Address */}
              <div className="flex items-center space-x-4">
                <MapPin className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                <div>
                  <h3 className="text-lg font-medium">Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    123 Cold Storage Building<br />
                    Digital Park, Sukhumvit Road<br />
                    Bangkok 10110, Thailand
                  </p>
                </div>
              </div>
              
              {/* Working Hours */}
              <div className="flex items-center space-x-4">
                <Clock className="text-blue-600 dark:text-blue-400 w-6 h-6" />
                <div>
                  <h3 className="text-lg font-medium">Working Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Monday-Friday: 8am - 6pm<br />
                    Saturday: 9am - 3pm<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map(({ Icon, href, label }) => (
                  <a 
                    key={label} 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
        
        {/* Map Placeholder */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Find Us</h2>
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300">Map will be displayed here</p>
            {/* TODO: Integrate Google Maps or other map service */}
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}