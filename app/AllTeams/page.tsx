'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Users } from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  id: string;
  email: string;
  role: number;
  joinedAt: string;
  assignedTasks: any[];
}

interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: TeamMember[];
}

export default function AllTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState('');
  const token = Cookies.get('authToken');

  const fetchTeams = async () => {
    try {
      const res = await axios.get('https://localhost:7178/api/Teams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeams(res.data.result || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load teams.');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="text-center mb-6">
        <Link href="/dashboard">
          <span className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition">
            Go to dashboard
          </span>
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">All Teams & Members</h1>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      <div className="space-y-6 max-w-5xl mx-auto">
        {teams.length === 0 ? (
          <div className="text-center text-gray-500">No teams found.</div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{team.name}</h2>
                  <p className="text-sm text-gray-500">{team.description}</p>
                  <p className="text-xs text-gray-400">
                    Created at: {new Date(team.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>
                    {team.members.length} member{team.members.length !== 1 && 's'}
                  </span>
                </div>
              </div>

              {team.members.length > 0 ? (
                <ul className="space-y-2">
                  {team.members.map((member) => (
                    <li
                      key={member.id}
                      className="bg-gray-100 rounded-lg px-4 py-2 flex justify-between items-center text-sm"
                    >
                      <div>
                        <a
                          href={`/task?memberId=${member.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {member.email}
                        </a>
                        <div className="text-gray-500 text-xs">
                          Role: {member.role} | Joined:{' '}
                          {new Date(member.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        <Link href={`/viewTask?teamId=${team.id}`}>
                          Tasks: {member.assignedTasks?.length || 0}
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm italic">No members in this team.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
