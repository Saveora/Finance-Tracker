// File: app/auth/reset-password/page.tsx
import { redirect } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams?.token;

  // If token is missing, redirect them away
  if (!token || token.trim().length < 20) {
    // You could redirect to forgot-password instead
    redirect('/auth?type=login?error=invalid-token');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#061021] to-[#04111a] p-6">
      <ResetPasswordForm />
    </div>
  );
}
