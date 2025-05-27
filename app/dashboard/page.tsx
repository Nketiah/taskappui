'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, XCircle, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface User {
  id: string;
  fullName: string;
  email: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();
  const token = Cookies.get('authToken');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://localhost:7178/api/Account/all-users-with-tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (user: User) => {
    setMessage('');
    setError('');
    setLoadingId(user.id);
    try {
      await axios.post('https://localhost:7178/api/Invite', { email: user.email });
      setMessage(`✅ Invitation sent to ${user.email}`);
    } catch (err) {
      setError(`❌ Failed to invite ${user.email}`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className='flex justify-center gap-24'>
             <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">User Dashboard</h1>

        {/* View All Teams Button */}
        <div className="text-center mb-6">
          <Link href="/AllTeams">
            <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
              View All Teams
            </span>
          </Link>
        </div>
        </div>

        {/* Message / Error */}
        {message && (
          <div className="flex items-center gap-2 mb-6 p-4 rounded-lg bg-green-100 text-green-700 border border-green-300 shadow-sm">
            <CheckCircle className="w-5 h-5" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300 shadow-sm">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded shadow-md overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3 text-left">Full Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="pr-10 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b last:border-none hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium">{user.fullName}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end">
                        <button
                          onClick={() => router.push(`/invite?email=${encodeURIComponent(user.email)}`)}
                          disabled={loadingId === user.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-white font-medium shadow-sm transition ${
                            loadingId === user.id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          <Mail className="w-4 h-4" />
                          <span className="ml-1">{loadingId === user.id ? 'Sending...' : 'Invite'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
