'use client';

import React from 'react';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {children}
    </div>
  );
}