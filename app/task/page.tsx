'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function AssignTaskPage() {
  const searchParams = useSearchParams();
  const memberId = searchParams.get('memberId');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [teamId, setTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = Cookies.get('authToken');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get('https://localhost:7178/api/Teams', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(res.data.result || []);
      } catch (err) {
        setError('Failed to load teams.');
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!memberId || !teamId || !title || !dueDate) {
      setError('Please fill all required fields.');
      return;
    }

    try {
        setLoading(true)
      await axios.post(
        'https://localhost:7178/api/Task',
        {
          title,
          description,
          dueDate,
          assignedToMemberId: memberId,
          teamId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Task assigned successfully.');
      setTitle('');
      setDescription('');
      setDueDate('');
      setTeamId('');
    } catch (err) {
      setError('❌ Failed to assign task.');
    } finally {
        setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Assign Task</h1>

        {message && <div className="text-green-600 mb-4">{message}</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-sm mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Due Date</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Team</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              required
            >
              <option value="">Select a team</option>
              {teams.map((team: any) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

        <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded transition ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
>
  {loading ? (
    <svg
      className="animate-spin h-5 w-5 mx-auto text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  ) : (
    'Assign Task'
  )}
</button>

        </form>
      </div>
    </div>
  );
}
