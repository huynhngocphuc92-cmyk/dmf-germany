import React from 'react';
import './globals.css';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import { HeaderWrapper } from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import JsonLd from '@/components/seo/JsonLd';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {/* QUAN TRỌNG: Provider phải bọc lấy TẤT CẢ mọi thứ bên trong body */}
        <LanguageProvider>
            
            {/* JsonLd nằm trong này mới có dữ liệu ngôn ngữ */}
            <JsonLd /> 
            
            {/* HeaderWrapper fetches logo from database (key: site_logo, header_logo, or logo_url) */}
            <HeaderWrapper />
            
            <main className="min-h-screen">
              {children}
            </main>
            
            <Footer />
            
        </LanguageProvider>
      </body>
    </html>
  );
}