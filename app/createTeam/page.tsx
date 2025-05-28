'use client';

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function CreateTeamPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const token = Cookies.get('authToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post(
        'https://localhost:7178/api/Teams',
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 && response.data?.isSuccess) {
        setSuccess(true);
        setName('');
        setDescription('');
      } else {
        setError('Team created, but response was unexpected.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create team.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
  <Link href="/AllTeams">
    <span className="text-blue-600 hover:underline font-medium cursor-pointer">
      ← Back to All Teams
    </span>
  </Link>
  <h1 className="text-2xl font-bold text-center flex-1">Create New Team</h1>
</div>

      {success && (
        <div className="text-green-700 bg-green-100 border border-green-300 rounded p-3 mb-4 text-sm">
          ✅ Team created successfully!
        </div>
      )}

      {error && (
        <div className="text-red-700 bg-red-100 border border-red-300 rounded p-3 mb-4 text-sm">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Team Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded w-full cursor-pointer"
        >
          Create Team
        </button>
      </form>
    </div>
  );
}
