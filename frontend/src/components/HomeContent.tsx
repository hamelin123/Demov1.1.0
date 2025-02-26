'use client';

import { Button } from '@nextui-org/react';
import { ThermometerSnowflake, MapPin, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function HomeContent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              {t('hero.title')}
            </h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors"
                onPress={() => {}}
              >
                {t('hero.getStarted')}
              </Button>
              <Button
                size="lg"
                variant="bordered"
                className="border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onPress={() => {}}
              >
                {t('hero.learnMore')}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ThermometerSnowflake className="text-blue-600 dark:text-blue-400" size={32} />}
                title={t('features.temperatureControl.title')}
                description={t('features.temperatureControl.description')}
              />
              <FeatureCard
                icon={<MapPin className="text-blue-600 dark:text-blue-400" size={32} />}
                title={t('features.tracking.title')}
                description={t('features.tracking.description')}
              />
              <FeatureCard
                icon={<Shield className="text-blue-600 dark:text-blue-400" size={32} />}
                title={t('features.quality.title')}
                description={t('features.quality.description')}
              />
            </div>
          </div>
        </section>

        {/* Professional Services and Contact Section */}
        <section className="bg-white dark:bg-gray-900 py-20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  {t('professionalServices.title')}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  {t('professionalServices.subtitle')}
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                      <ThermometerSnowflake className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <span className="text-gray-800 dark:text-white">{t('professionalServices.temperatureControl')}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <span className="text-gray-800 dark:text-white">{t('professionalServices.realTimeTracking')}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                      <Shield className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <span className="text-gray-800 dark:text-white">{t('professionalServices.qualityAssurance')}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                  {t('contact.title')}
                </h2>
                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                    <p>{t('contact.address')}</p>
                    <p>{t('contact.city')}</p>
                    <p>{t('contact.phone')}: {t('contact.phoneNumber')}</p>
                    <p>{t('contact.email')}: {t('contact.emailAddress')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900/50 p-8 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/70 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}