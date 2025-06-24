import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Simple Running Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              {/* Simple track circle */}
              <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
              <div className="absolute inset-2 border-2 border-red-400 rounded-full"></div>
              
              {/* Animated runner icon in the center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🏃‍♂️</div>
              </div>
              
              {/* Question marks around */}
              <div className="absolute -top-2 -right-2 text-2xl text-red-500">?</div>
              <div className="absolute -bottom-2 -left-2 text-xl text-blue-500 animate-pulse">?</div>
              <div className="absolute top-4 -left-4 text-lg text-emerald-500">?</div>
            </div>
            
            {/* 404 Text */}
            <div className="text-8xl font-bold text-green-700 mb-4">
              404
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-green-700 mb-4">
            ページが見つかりません
          </h1>
          
          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            お探しのページは見つかりませんでした。<br />
            ランニングコースを見失ってしまったようです。
          </p>
          
          {/* Action Button */}
          <div>
            <Link 
              href="/"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              🏠 ホームに戻る
            </Link>
          </div>
          
          {/* Footer message */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm">
              💪 正しいコースに戻って、目標達成を目指しましょう！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}