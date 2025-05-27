'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="flex flex-col md:flex-row w-full h-full bg-white shadow-lg">
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-blue-600 text-white flex flex-col justify-center items-start p-10">
          <h2 className="text-5xl font-extrabold mb-4">Team Task Manager</h2>
          <p className="text-lg opacity-90 max-w-md">
            Collaborate efficiently, invite teammates via email, and track team tasks in one place.
          </p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10">
          <div className="w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Get Started</h3>

            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 w-full rounded-lg mb-4 transition"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <button
                onClick={() => router.push('/register')}
                className="text-blue-600 hover:underline"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
