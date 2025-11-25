'use client';
import { ReactNode, useTransition } from 'react';

import { logoutAction } from '@/features/auth/actions/auth-actions';

interface LogoutButtonProps {
  className?: string;
  children?: ReactNode;
}

export default function LogoutButton({
  className = '',
  children,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={`rounded bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600 disabled:opacity-50 ${className}`}
    >
      {children ?? (isPending ? 'ログアウト中...' : 'ログアウト')}
    </button>
  );
}
