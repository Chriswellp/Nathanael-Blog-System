'use client';

import dynamic from 'next/dynamic';

const DynamicLoginPage = dynamic(
  () => import('@/src/components/LoginPageContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-xs">
        Loading login portal...
      </div>
    )
  }
);

export default function LoginPage() {
  return <DynamicLoginPage />;
}