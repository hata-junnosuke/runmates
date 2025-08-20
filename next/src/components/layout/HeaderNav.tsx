'use client';

import { Menu, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import LogoutButton from './LogoutButton';

export default function HeaderNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* デスクトップナビゲーション */}
      <div className="hidden items-center space-x-4 md:flex">
        <Link
          href="/settings"
          className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-green-700"
        >
          <Settings className="h-5 w-5" />
          <span className="font-medium">設定</span>
        </Link>
        <LogoutButton />
      </div>

      {/* モバイルメニューボタン */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 transition-colors hover:text-green-700 md:hidden"
        aria-label="メニューを開く"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
            onClick={closeMenu}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                closeMenu();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="メニューを閉じる"
          />

          {/* メニューパネル */}
          <div className="fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-xl md:hidden">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold text-gray-800">メニュー</h2>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-600 transition-colors hover:text-green-700"
                aria-label="メニューを閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-4 p-4">
              <Link
                href="/settings"
                onClick={closeMenu}
                className="flex items-center space-x-3 rounded-lg p-3 text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">設定</span>
              </Link>

              <div className="border-t pt-4">
                <LogoutButton className="w-full justify-center" />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
