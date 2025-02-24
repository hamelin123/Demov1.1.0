'use client';

import { Thermometer, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-divider">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Thermometer className="text-primary" />
              <span className="font-bold text-xl">ColdChain</span>
            </div>
            <p className="text-foreground/70">
              {t('professionalServices.subtitle')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-foreground/70 hover:text-primary transition">{t('footer.about')}</a></li>
              <li><a href="/services" className="text-foreground/70 hover:text-primary transition">{t('footer.services')}</a></li>
              <li><a href="/tracking" className="text-foreground/70 hover:text-primary transition">{t('footer.tracking')}</a></li>
              <li><a href="/contact" className="text-foreground/70 hover:text-primary transition">{t('footer.contact')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-foreground/70 hover:text-primary transition">{t('professionalServices.temperatureControl')}</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition">{t('professionalServices.realTimeTracking')}</a></li>
              <li><a href="#" className="text-foreground/70 hover:text-primary transition">{t('professionalServices.qualityAssurance')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">{t('contact.title')}</h3>
            <ul className="space-y-2">
              <li className="text-foreground/70">{t('contact.address')}</li>
              <li className="text-foreground/70">{t('contact.city')}</li>
              <li className="text-foreground/70">{t('contact.phone')}: {t('contact.phoneNumber')}</li>
              <li className="text-foreground/70">{t('contact.email')}: {t('contact.emailAddress')}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-divider">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground/70 text-sm">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}