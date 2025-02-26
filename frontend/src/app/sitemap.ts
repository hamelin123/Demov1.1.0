// src/app/robots.ts
export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/private/',
      },
      sitemap: 'https://yourdomain.com/sitemap.xml',
    };
  }
  
  // src/app/sitemap.ts
  export default function sitemap() {
    return [
      {
        url: 'https://yourdomain.com',
        lastModified: new Date(),
      },
      {
        url: 'https://yourdomain.com/services',
        lastModified: new Date(),
      },
      {
        url: 'https://yourdomain.com/tracking',
        lastModified: new Date(),
      },
      {
        url: 'https://yourdomain.com/contact',
        lastModified: new Date(),
      },
    ];
  }