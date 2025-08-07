import { Settings } from 'lucide-react';
import Link from 'next/link';

import LogoutButton from './LogoutButton';

export default function HeaderNav() {
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/settings"
        className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-green-700"
      >
        <Settings className="h-5 w-5" />
        <span className="font-medium">設定</span>
      </Link>
      <LogoutButton />
    </div>
  );
}
