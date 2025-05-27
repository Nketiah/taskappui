'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useSearchParams } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
  status: number;
  assignedToMemberId: string;
  teamId: string;
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  email: string;
  role: number;
  joinedAt: string;
  assignedTasks: Task[];
}

export default function ViewTaskPage() {
  const searchParams = useSearchParams();
  const teamId = searchParams.get('teamId');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const token = Cookies.get('authToken');

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamMembers = async () => {
      try {
        const res:any = await axios.get<TeamMember[]>(
          `https://localhost:7178/api/Teams/${teamId}/members-with-tasks`, // Adjust to your actual endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // res.data.result is an array of TeamMember objects, each has assignedTasks array

        // Flatten all assignedTasks from all members into a single array
        const allTasks:any = res.data.result.flatMap((member:any) => member.assignedTasks || []);

        setTasks(allTasks);
      } catch (err) {
        console.error(err);
        setError('Failed to load tasks.');
      }
    };

    fetchTeamMembers();
  }, [teamId, token]);

  if (!teamId) {
    return <div className="p-8 text-center text-red-600">Team ID is required.</div>;
  }

  return (
      <div className="min-h-screen p-8 bg-gray-50 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Tasks for Team</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks found for this team.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <li key={task.id} className="bg-white rounded shadow p-4 flex flex-col">
              <h2 className="font-semibold text-lg mb-2">{task.title}</h2>
              <p className="text-gray-700 flex-grow">{task.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">Status: {task.status}</p>
              <p className="text-sm text-gray-500">Assigned to Member ID: {task.assignedToMemberId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
