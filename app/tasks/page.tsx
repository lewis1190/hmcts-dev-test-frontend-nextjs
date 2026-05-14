"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueAt?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function TasksPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const token = user ? await user.getIdToken() : null;
      const res = await axios.get(`${API_BASE}/tasks`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { title, description, dueAt, status: "todo" };
      const token = user ? await user.getIdToken() : null;
      await axios.post(`${API_BASE}/tasks`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      setTitle("");
      setDescription("");
      setDueAt("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = user ? await user.getIdToken() : null;
      await axios.patch(
        `${API_BASE}/tasks/${id}/status`,
        { status },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = user ? await user.getIdToken() : null;
      await axios.delete(`${API_BASE}/tasks/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-zinc-600">{user?.email}</div>
            <button
              onClick={() => signOut().then(() => router.push("/login"))}
              className="px-3 py-1 border rounded"
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="font-medium mb-2">Create Task</h2>
          <form onSubmit={createTask} className="grid grid-cols-1 gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="border px-3 py-2 rounded"
              required
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="border px-3 py-2 rounded"
            />
            <input
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              placeholder="Due date/time (ISO)"
              className="border px-3 py-2 rounded"
            />
            <div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
            </div>
          </form>
        </section>

        <section className="p-4 bg-white rounded shadow">
          <h2 className="font-medium mb-4">All tasks</h2>
          {loadingTasks ? (
            <div>Loading tasks...</div>
          ) : (
            <ul className="space-y-3">
              {tasks.map((t) => (
                <li key={t.id} className="border p-3 rounded flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    {t.description && <div className="text-sm text-zinc-600">{t.description}</div>}
                    {t.dueAt && <div className="text-xs text-zinc-500">Due: {new Date(t.dueAt).toLocaleString()}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)} className="border rounded px-2 py-1">
                      <option value="todo">To do</option>
                      <option value="in_progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => deleteTask(t.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
