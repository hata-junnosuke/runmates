import Image from 'next/image';
import type { ReactNode } from 'react';

// 装飾用ドットグリッド（ハイドレーション差異を防ぐため決定論的に生成）
function DotGrid({ palette }: { palette: string[] }) {
  const cols = 10;
  const rows = 4;
  const step = 21;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * step}
          y={r * step}
          width={16}
          height={16}
          rx={3}
          fill={palette[(r * cols + c * 3) % palette.length]}
        />,
      );
    }
  }
  return (
    <svg
      width={cols * step - 5}
      height={rows * step - 5}
      viewBox={`0 0 ${cols * step - 5} ${rows * step - 5}`}
    >
      {cells}
    </svg>
  );
}

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#F4F8FB] px-4 py-8 text-[#0F1A2B]">
      {/* 背景装飾 */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute bottom-[-80px] left-[-80px] h-[380px] w-[380px] rounded-full bg-[#A7E0FB] opacity-[0.55] blur-[70px]" />
        <div className="absolute top-[-80px] right-[-80px] h-[380px] w-[380px] rounded-full bg-[#A7E3C3] opacity-[0.55] blur-[70px]" />
        <div className="absolute top-[-30px] left-[-40px] -rotate-[8deg] opacity-50">
          <DotGrid palette={['#94DDB2', '#C0EDD4', '#E4F6EC']} />
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] rotate-[8deg] opacity-50">
          <DotGrid palette={['#9CCBF2', '#C7E2F8', '#E8F2FC']} />
        </div>
      </div>

      {/* 本体 */}
      <div className="relative w-full max-w-[440px]">
        <div className="mb-5 flex items-center justify-center gap-3 text-2xl font-bold tracking-tight">
          <Image
            src="/logo.png"
            alt="Runmates ロゴ"
            width={56}
            height={56}
            priority
            className="h-14 w-14"
          />
          <span>Runmates</span>
        </div>

        <div className="rounded-3xl border border-[#E5EAF1] bg-white px-9 pt-9 pb-7 shadow-[0_1px_0_rgba(15,26,43,0.04),0_30px_60px_-20px_rgba(15,26,43,0.18)]">
          <h1 className="mb-1 text-center text-2xl font-bold tracking-[-0.01em]">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-[22px] text-center text-[13px] text-[#6b7a90]">
              {subtitle}
            </p>
          )}
          {!subtitle && <div className="mb-[22px]" />}
          {children}
        </div>

        {footer && (
          <div className="mt-[18px] text-center text-[13px] text-[#6b7a90]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
