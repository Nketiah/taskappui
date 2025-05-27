'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckCircle, XCircle } from 'lucide-react';
import Cookies from "js-cookie";



interface Team {
  id: string;
  name: string;
}

export default function InvitePage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const token = Cookies.get("authToken");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get('https://localhost:7178/api/Teams', {
             headers: {
            Authorization: `Bearer ${token}`,
           },
        });
        console.log("res",res)
        setTeams(res.data.result);
      } catch {
        setError('Failed to load teams');
      }
    };

    fetchTeams();
  }, []);







  const handleInvite = async () => {
   try {
  // Fetch all users with tasks
  setLoading(true)
  const res = await axios.get('https://localhost:7178/api/Account/all-users-with-tasks', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const users = res.data;

  // Optional: you could validate email exists in users list
  const userExists = users.some((user: any) => user.email === email);
  if (!userExists) {
    setError('User not found');
    setLoading(false);
    return;
  }

  // Proceed to send invitation
  await axios.post('https://localhost:7178/api/Teams/invite', {
    email,
    teamId: selectedTeamId,
  },{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setMessage(`Invitation sent to ${email}`);
} catch (err) {
  console.error(err);
  setError('Failed to send invitation');
} finally {
  setLoading(false);
}

  };





  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Invite User</h1>

        {email && (
          <p className="mb-4 text-center text-gray-600">
            Sending invite to: <strong>{email}</strong>
          </p>
        )}

        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleInvite}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Sending...' : 'Send Invite'}
        </button>

        {message && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm border border-green-300">
            <CheckCircle className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-300">
            <XCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
