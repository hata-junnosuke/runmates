import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Runner Illustration Area */}
        <div className="relative mb-8">
          {/* Track Background */}
          <div className="relative h-48 mb-4">
            {/* Trees in background */}
            <div className="absolute left-4 top-8">
              <div className="w-8 h-8 bg-green-500 rounded-full opacity-80"></div>
              <div className="w-2 h-6 bg-green-700 mx-auto"></div>
            </div>
            <div className="absolute right-6 top-12">
              <div className="w-6 h-6 bg-green-600 rounded-full opacity-70"></div>
              <div className="w-1 h-4 bg-green-800 mx-auto"></div>
            </div>
            
            {/* Track lines */}
            <div className="absolute bottom-8 left-0 right-0">
              <div className="h-1 bg-orange-400 rounded mb-2"></div>
              <div className="h-1 bg-orange-300 rounded mb-2"></div>
              <div className="h-1 bg-orange-200 rounded"></div>
            </div>
            
            {/* Runner figure (simplified) */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
              {/* Head */}
              <div className="w-8 h-8 bg-orange-300 rounded-full mx-auto mb-1 border-2 border-orange-400"></div>
              {/* Body */}
              <div className="w-6 h-8 bg-orange-500 rounded mx-auto mb-1"></div>
              {/* Arms */}
              <div className="absolute top-8 -left-2 w-4 h-2 bg-orange-400 rounded transform rotate-12"></div>
              <div className="absolute top-8 -right-2 w-4 h-2 bg-orange-400 rounded transform -rotate-12"></div>
              {/* Legs */}
              <div className="w-3 h-6 bg-blue-600 rounded mx-auto"></div>
              {/* Confused expression (question marks) */}
              <div className="absolute -top-4 -right-2 text-blue-800 text-lg font-bold">?</div>
              <div className="absolute -top-6 right-1 text-blue-700 text-sm">?</div>
            </div>
          </div>
          
          {/* Large 404 Text */}
          <div className="text-6xl font-bold text-blue-900 mb-2 tracking-wider">
            404
          </div>
        </div>
        
        {/* Page Not Found Text */}
        <h1 className="text-2xl font-bold text-blue-900 mb-4 tracking-wide">
          PAGE NOT FOUND
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          お探しのページは見つかりませんでした。<br />
          ランニングコースから外れてしまったようです。
        </p>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            ホームに戻る
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            前のページに戻る
          </button>
        </div>
        
        {/* Running themed message */}
        <div className="mt-8 p-4 bg-orange-100 rounded-lg border-l-4 border-orange-400">
          <p className="text-orange-800 text-sm">
            💨 正しいルートに戻って、ランニングを続けましょう！
          </p>
        </div>
      </div>
    </div>
  )
}