'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";




export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inviteToken = searchParams.get('token');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("authToken");

  useEffect(() => {
    if (!inviteToken) {
      setError('No invite token provided.');
      return;
    }

    const acceptInvite = async () => {
      setLoading(true);
      setError(null);
      setMessage(null);

      try {
        // Call backend endpoint with invite token
         const res = await axios.get(`https://localhost:7178/api/Teams/accept-invite?token=${inviteToken}`, {
             headers: {
            Authorization: `Bearer ${token}`,
           },
        });

        if (res.data?.isSuccess) {
         setTimeout(()=> {
             setMessage('Invitation accepted! Redirecting to dashboard...');
         },1000)
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setError(res.data?.message || 'Failed to accept invitation.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error accepting invitation.');
      } finally {
        setLoading(false);
      }
    };

    acceptInvite();
  }, [inviteToken, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-6">Accept Invitation</h1>

        {loading && <p className="text-blue-600">Processing your invitation...</p>}

        {message && <p className="text-green-600">{message}</p>}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !message && !error && (
          <p>Please wait while we process your invitation.</p>
        )}
      </div>
    </div>
  );
}
