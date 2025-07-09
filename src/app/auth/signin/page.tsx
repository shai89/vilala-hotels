import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { authOptions } from "@/lib/auth"
import { SignInForm } from "@/components/auth/SignInForm"

export default async function SignInPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            התחבר לאזור המנהלים
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            או
            <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500 mr-1">
              חזור לדף הבית
            </Link>
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}