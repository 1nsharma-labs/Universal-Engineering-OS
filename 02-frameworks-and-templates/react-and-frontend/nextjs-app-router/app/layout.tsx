import React from 'react';

export const metadata = {
  title: 'Universal Dev Hub - Next.js App Router',
  description: 'Enterprise Fullstack Next.js 14 Service Starter'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0b1120', color: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
