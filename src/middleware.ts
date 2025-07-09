import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // For development: bypass auth if no Google OAuth is configured
        if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === "your-google-client-id") {
          return true; // Allow access during development
        }
        return !!token;
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
  ],
}