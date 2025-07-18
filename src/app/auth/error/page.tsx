import Link from "next/link"

export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            שגיאה בהתחברות
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            אירעה שגיאה בעת ניסיון ההתחברות. אנא נסו שוב.
          </p>
        </div>
        
        <div className="text-center space-y-4">
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            נסה שוב
          </Link>
          
          <div>
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              חזור לדף הבית
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}