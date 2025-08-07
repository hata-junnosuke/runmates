import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-100 to-blue-200 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 text-center shadow-lg">
          {/* Simple Running Illustration */}
          <div className="mb-8">
            <div className="relative mx-auto mb-6 h-32 w-32">
              {/* Simple track circle */}
              <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
              <div className="absolute inset-2 rounded-full border-2 border-red-400"></div>

              {/* Animated runner icon in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🏃‍♂️</div>
              </div>

              {/* Question marks around */}
              <div className="absolute -top-2 -right-2 text-2xl text-red-500">
                ?
              </div>
              <div className="absolute -bottom-2 -left-2 animate-pulse text-xl text-blue-500">
                ?
              </div>
              <div className="absolute top-4 -left-4 text-lg text-emerald-500">
                ?
              </div>
            </div>

            {/* 404 Text */}
            <div className="mb-4 text-8xl font-bold text-green-700">404</div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-2xl font-bold text-green-700">
            ページが見つかりません
          </h1>

          {/* Description */}
          <p className="mb-8 leading-relaxed text-gray-600">
            お探しのページは見つかりませんでした。
            <br />
            ランニングコースを見失ってしまったようです。
          </p>

          {/* Action Button */}
          <div>
            <Link
              href="/"
              className="block w-full rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-emerald-700 hover:shadow-lg"
            >
              🏠 ホームに戻る
            </Link>
          </div>

          {/* Footer message */}
          <div className="mt-6 rounded-lg bg-green-50 p-4">
            <p className="text-sm text-green-700">
              💪 正しいコースに戻って、目標達成を目指しましょう！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
