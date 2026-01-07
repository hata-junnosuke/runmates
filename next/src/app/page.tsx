import { Bebas_Neue, Manrope } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import HeaderNav from '@/components/layout/HeaderNav';

import DemoDashboard from './components/DemoDashboard';

const display = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
});

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const features = [
  {
    title: 'ランニング記録',
    description: '距離・日付を登録して履歴を管理。',
  },
  {
    title: 'カレンダー管理',
    description: '走った日と予定日を一目で把握。',
  },
  {
    title: '目標 & 統計',
    description: '月間/年間目標の進捗と統計を可視化。',
  },
];

export default function PlanAPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#eef4ff] text-slate-900`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <HeaderNav isAuthenticated={false} />

      <main className="pt-0">
        <section className="relative -mt-16 min-h-[90vh] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?auto=format&fit=crop&q=80&w=2000"
              alt="Runner at night"
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#eef4ff]/5 via-[#eef4ff]/40 to-[#eef4ff]/75" />
            <div className="absolute top-10 left-1/4 h-96 w-96 rounded-full bg-blue-200/60 blur-[120px]" />
            <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-cyan-200/60 blur-[140px]" />
          </div>
          <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl items-center px-6 pt-16 md:pt-20">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-blue-700 uppercase">
                ランニング管理アプリ
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
                <h2
                  className="text-6xl leading-none md:text-7xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    Runmates
                  </span>
                </h2>
                <p className="text-lg font-medium tracking-[0.12em] text-slate-700 md:translate-y-1">
                  - あなたの走りを&ldquo;可視化&rdquo;する -
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/create-account"
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5"
                >
                  新規登録
                </Link>
                <Link
                  href="/login"
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(15,23,42,0.25)] transition hover:-translate-y-0.5"
                >
                  ログイン
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <p className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
            Features
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="relative rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
              >
                <div className="absolute top-6 right-6 text-5xl font-black text-blue-100">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 pb-24">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                Dashboard Snapshot
              </p>
              <p className="text-xl text-slate-800 italic">
                記録・目標・統計が
                <span className="mx-2 font-semibold text-blue-600">
                  &ldquo;可視化&rdquo;
                </span>
                <span className="ml-2 text-slate-900 underline decoration-blue-400/70 decoration-2 underline-offset-4">
                  もう走らずにはいられない！
                </span>
              </p>
            </div>
            <DemoDashboard />
          </div>
        </section>
      </main>
    </div>
  );
}
