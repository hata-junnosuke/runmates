import { Bebas_Neue, Manrope } from 'next/font/google';

import HeaderNav from '@/components/layout/HeaderNav';

import DemoDashboard from './components/DemoDashboard';
import Link from 'next/link';

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
            <img
              src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?auto=format&fit=crop&q=80&w=2000"
              className="h-full w-full object-cover opacity-80"
              alt="Runner at night"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#eef4ff]/5 via-[#eef4ff]/40 to-[#eef4ff]/75" />
            <div className="absolute left-1/4 top-10 h-96 w-96 rounded-full bg-blue-200/60 blur-[120px]" />
            <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-cyan-200/60 blur-[140px]" />
          </div>
          <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl items-center px-6 pt-16 md:pt-20">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-600/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
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
                  - あなたの走りを"可視化"する -
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
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Features
          </p>
          <h3
            className="mt-3 text-3xl md:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            こんなことができます
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="relative rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
              >
                <div className="absolute right-6 top-6 text-5xl font-black text-blue-100">
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                Dashboard Snapshot
              </p>
              <h3
                className="text-4xl md:text-5xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                実際のダッシュボードを
                <span className="block text-blue-600">デモデータで再現</span>
              </h3>
              <p className="text-base text-slate-700">
                既存のダッシュボードUIに、サンプル記録・目標・統計を入れて表示。
                LP上でそのまま使用感を確認できます。
              </p>
            </div>
            <DemoDashboard />
          </div>
        </section>
      </main>
    </div>
  );
}
