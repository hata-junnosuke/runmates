'use client';

import { LogOut, Menu, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import LogoutButton from './LogoutButton';

type HeaderNavProps = {
  isAuthenticated?: boolean;
};

export default function HeaderNav({ isAuthenticated = true }: HeaderNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/50 bg-white/80 font-sans shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        {/* ブランド */}
        <div className="flex items-center gap-3">
          <div
            aria-label="Runmates ロゴ"
            className="h-9 w-9"
            style={{
              background:
                'linear-gradient(135deg, #2563eb 0%, #22d3ee 50%, #a855f7 100%)',
              WebkitMaskImage: 'url(/logo.png)',
              maskImage: 'url(/logo.png)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
            }}
          />
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              Runmates
            </h1>
            <p className="text-xs font-medium text-slate-600">
              ランニング管理アプリ
            </p>
          </div>
        </div>

        {/* デスクトップナビゲーション */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-blue-100 transition ring-inset hover:-translate-y-0.5 hover:shadow-md"
              >
                <Settings className="h-4 w-4" />
                <span>設定</span>
              </Link>
              <LogoutButton className="flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
                <LogOut className="h-4 w-4" />
                <span>ログアウト</span>
              </LogoutButton>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span>ログイン</span>
            </Link>
          )}
        </div>

        {/* モバイルメニューボタン */}
        <button
          onClick={toggleMenu}
          className="rounded-full bg-white/80 p-2 text-slate-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50 md:hidden"
          aria-label="メニューを開く"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <>
            {/* オーバーレイ */}
            <div
              className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
              style={{ animation: 'fade-in-overlay 0.2s ease-out forwards' }}
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
            <div
              className="fixed top-0 right-0 z-50 h-full w-64 bg-white/95 shadow-2xl backdrop-blur md:hidden"
              style={{ animation: 'slide-in-right 0.25s ease-out forwards' }}
            >
              <div className="flex items-center justify-between border-b border-blue-100 p-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  メニュー
                </h2>
                <button
                  onClick={closeMenu}
                  className="rounded-full p-2 text-slate-600 transition-colors hover:bg-blue-50"
                  aria-label="メニューを閉じる"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-3 p-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/settings"
                      onClick={closeMenu}
                      className="flex w-full items-center gap-3 rounded-lg border border-blue-100 bg-white px-4 py-3 text-slate-800 shadow-sm transition-colors hover:bg-blue-50"
                    >
                      <Settings className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">設定</span>
                    </Link>

                    <div className="pt-2">
                      <LogoutButton className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-900 px-4 py-3 text-white shadow-sm transition hover:opacity-90">
                        <LogOut className="h-4 w-4" />
                        <span>ログアウト</span>
                      </LogoutButton>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-white shadow-sm transition hover:opacity-90"
                  >
                    <span className="font-medium">ログイン</span>
                  </Link>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
