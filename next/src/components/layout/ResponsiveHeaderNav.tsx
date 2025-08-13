'use client';

import { Menu, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import LogoutButton from './LogoutButton';

export default function ResponsiveHeaderNav() {
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
      <div className="hidden md:flex items-center space-x-4">
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
        className="md:hidden p-2 text-gray-600 hover:text-green-700 transition-colors"
        aria-label="メニューを開く"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <>
          {/* オーバーレイ */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
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
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">メニュー</h2>
              <button
                onClick={closeMenu}
                className="p-2 text-gray-600 hover:text-green-700 transition-colors"
                aria-label="メニューを閉じる"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <nav className="p-4 space-y-4">
              <Link
                href="/settings"
                onClick={closeMenu}
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">設定</span>
              </Link>
              
              <div className="pt-4 border-t">
                <LogoutButton className="w-full justify-center" />
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}