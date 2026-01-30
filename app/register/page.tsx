'use client';

import { useRouter } from 'next/navigation';
import RegisterPage from '@/components/auth/register-page';

export default function RegisterRoute() {
  const router = useRouter();

  const handleSuccess = (role: 'patient' | 'doctor') => {
    // Redirect to the appropriate portal after successful registration
    router.push('/portal');
  };

  const handleBackToLogin = () => {
    router.push('/');
  };

  return (
    <RegisterPage 
      onSuccess={handleSuccess} 
      onBackToLogin={handleBackToLogin} 
    />
  );
}
