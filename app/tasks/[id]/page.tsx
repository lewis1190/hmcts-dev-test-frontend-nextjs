'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../../../components/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { Task } from '../interfaces/task.interface';
import { TaskStatus } from '../enums/task-status.enum';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function TaskDetailPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const params = useParams();
    const taskId = params.id as string;

    const [task, setTask] = useState<Task | null>(null);
    const [loadingTask, setLoadingTask] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.NotStarted);

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    useEffect(() => {
        if (user && taskId) {
            fetchTask();
        }
    }, [user, taskId]);

    const fetchTask = async () => {
        setLoadingTask(true);
        try {
            const token = user ? await user.getIdToken() : null;
            const res = await axios.get(`${API_BASE}/tasks/${taskId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            setTask(res.data);
            setTitle(res.data.title);
            setDescription(res.data.description || '');
            setStatus(res.data.status);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTask(false);
        }
    };

    const updateTask = async () => {
        try {
            const token = user ? await user.getIdToken() : null;
            const res = await axios.patch(`${API_BASE}/tasks/${taskId}`, { title, description, status }, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
            setTask(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async () => {
        try {
            const token = user ? await user.getIdToken() : null;
            await axios.delete(`${API_BASE}/tasks/${taskId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            router.push('/tasks');
        } catch (err) {
            console.error(err);
        }
    };

    const isOverdue = (dueDate: string): boolean => {
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return due < today;
    };

    if (loading || !user) return <div className="govuk-body">Loading...</div>;
    if (loadingTask) return <div className="govuk-body">Loading task...</div>;
    if (!task) return <div className="govuk-body">Task not found.</div>;

    return (
        <main className="govuk-main-wrapper">
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        <Link href="/tasks" className="govuk-back-link">
                            Back to tasks
                        </Link>

                        <h1 className="govuk-heading-xl">{task.title}</h1>

                        {isEditing ? (
                            <section className="govuk-form-group" style={{ marginBottom: '3rem' }}>
                                <h2 className="govuk-heading-m">Edit task</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateTask();
                                    }}
                                >
                                    <div className="govuk-form-group">
                                        <label className="govuk-label govuk-label--m" htmlFor="title">
                                            Title
                                        </label>
                                        <input className="govuk-input" id="title" name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>

                                    <div className="govuk-form-group">
                                        <label className="govuk-label govuk-label--m" htmlFor="description">
                                            Description
                                        </label>
                                        <textarea className="govuk-textarea" id="description" name="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
                                    </div>

                                    <div className="govuk-form-group">
                                        <label className="govuk-label govuk-label--m" htmlFor="status">
                                            Status
                                        </label>
                                        <select className="govuk-select" id="status" name="status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                                            <option value={TaskStatus.NotStarted}>Not Started</option>
                                            <option value={TaskStatus.InProgress}>In Progress</option>
                                            <option value={TaskStatus.Complete}>Complete</option>
                                        </select>
                                    </div>

                                    <div className="govuk-button-group">
                                        <button type="submit" className="govuk-button" data-module="govuk-button">
                                            Save changes
                                        </button>
                                        <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setIsEditing(false)} data-module="govuk-button">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </section>
                        ) : (
                            <div className="govuk-summary-list" style={{ marginBottom: '3rem' }}>
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">Status</dt>
                                    <dd className="govuk-summary-list__value">{task.status}</dd>
                                </div>
                                {task.description && (
                                    <div className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">Description</dt>
                                        <dd className="govuk-summary-list__value">{task.description}</dd>
                                    </div>
                                )}
                                {task.dueDate && (
                                    <div className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">Due date</dt>
                                        <dd className="govuk-summary-list__value" style={{ color: isOverdue(task.dueDate) ? '#d4351c' : 'inherit' }}>
                                            {new Date(task.dueDate).toLocaleString()}
                                            {isOverdue(task.dueDate) && <span style={{ marginLeft: '0.5rem', fontWeight: 'bold' }}>(Overdue)</span>}
                                        </dd>
                                    </div>
                                )}
                                {task.createdAt && (
                                    <div className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">Created</dt>
                                        <dd className="govuk-summary-list__value">{new Date(task.createdAt).toLocaleString()}</dd>
                                    </div>
                                )}
                                {task.updatedAt && (
                                    <div className="govuk-summary-list__row">
                                        <dt className="govuk-summary-list__key">Last updated</dt>
                                        <dd className="govuk-summary-list__value">{new Date(task.updatedAt).toLocaleString()}</dd>
                                    </div>
                                )}
                                <div className="govuk-summary-list__row">
                                    <dt className="govuk-summary-list__key">Actions</dt>
                                    <dd className="govuk-summary-list__actions">
                                        <button className="govuk-link govuk-link--no-visited-state" onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
                                            Edit
                                        </button>
                                    </dd>
                                </div>
                            </div>
                        )}

                        <button className="govuk-button govuk-button--warning" onClick={deleteTask} data-module="govuk-button" style={{ backgroundColor: '#d4351c' }}>
                            Delete task
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
