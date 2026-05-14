'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Task } from './interfaces/task.interface';
import { TaskStatus } from './enums/task-status.enum';
import { validateDateFields } from './helpers';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function TasksPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [dueMonth, setDueMonth] = useState('');
    const [dueYear, setDueYear] = useState('');
    const [dateErrors, setDateErrors] = useState<{ day?: string; month?: string; year?: string }>({});

    useEffect(() => {
        if (!loading && !user) router.push('/login');
    }, [user, loading, router]);

    useEffect(() => {
        if (user) fetchTasks();
    }, [user]);

    useEffect(() => {
        // Re-initialize GOV.UK components whenever tasks are loaded
        const initGovUK = async () => {
            try {
                const { initAll } = await import('govuk-frontend');
                initAll();
            } catch (err) {
                console.error('Failed to re-initialize GOV.UK Frontend:', err);
            }
        };
        initGovUK();
    }, [tasks]);

    const validateDate = (): boolean => {
        const errors = validateDateFields(dueDay, dueMonth, dueYear);
        setDateErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const fetchTasks = async () => {
        setLoadingTasks(true);
        try {
            const token = user ? await user.getIdToken() : null;
            const res = await axios.get(`${API_BASE}/tasks`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            // Handle both array response and object with tasks property
            const tasksData = Array.isArray(res.data) ? res.data : res.data?.tasks || [];
            setTasks(tasksData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingTasks(false);
        }
    };

    const createTask = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate date before submission
        if (!validateDate()) {
            return;
        }

        try {
            // Convert day, month, year to ISO string
            let dueDate: string | undefined;
            if (dueDay && dueMonth && dueYear) {
                const date = new Date(`${dueYear}-${dueMonth.padStart(2, '0')}-${dueDay.padStart(2, '0')}T00:00:00Z`);
                dueDate = date.toISOString();
            }

            const payload = { title, description, dueDate, status: TaskStatus.NotStarted };
            const token = user ? await user.getIdToken() : null;
            await axios.post(`${API_BASE}/tasks`, payload, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            setTitle('');
            setDescription('');
            setDueDay('');
            setDueMonth('');
            setDueYear('');
            setDateErrors({});
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const updateStatus = async (id: string | undefined, status: string) => {
        if (!id) return;
        try {
            const token = user ? await user.getIdToken() : null;
            await axios.patch(`${API_BASE}/tasks/${id}/status`, { status }, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTask = async (id: string | undefined) => {
        if (!id) return;
        try {
            const token = user ? await user.getIdToken() : null;
            await axios.delete(`${API_BASE}/tasks/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            fetchTasks();
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

    return (
        <main className="govuk-main-wrapper">
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div className="govuk-clearfix">
                            <h1 className="govuk-heading-xl" style={{ marginBottom: '1rem' }}>
                                Tasks
                            </h1>
                            <div style={{ float: 'right', marginTop: '0.5rem' }}>
                                <p className="govuk-body-s" style={{ marginBottom: '0.5rem' }}>
                                    {user?.email}
                                </p>
                                <button onClick={() => signOut().then(() => router.push('/login'))} className="govuk-button govuk-button--secondary" data-module="govuk-button">
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        <div className="govuk-accordion" data-module="govuk-accordion" id="accordion-default">
                            <div className="govuk-accordion__section">
                                <div className="govuk-accordion__section-header">
                                    <h3 className="govuk-accordion__section-heading">
                                        <button type="button" className="govuk-accordion__section-button" id="accordion-default-heading-1">
                                            Create new task
                                        </button>
                                    </h3>
                                </div>
                                <div id="accordion-default-content-1" className="govuk-accordion__section-content">
                                    <section className="govuk-form-group">
                                        {/* <h2 className="govuk-heading-m">Create new task</h2> */}
                                        <form onSubmit={createTask}>
                                            <div className="govuk-form-group">
                                                <label className="govuk-label govuk-label--m" htmlFor="title">
                                                    Task title
                                                </label>
                                                <input className="govuk-input" id="title" name="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                            </div>

                                            <div className="govuk-form-group">
                                                <label className="govuk-label govuk-label--m" htmlFor="description">
                                                    Description
                                                </label>
                                                <textarea
                                                    className="govuk-textarea"
                                                    id="description"
                                                    name="description"
                                                    rows={4}
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                />
                                            </div>

                                            <div className={`govuk-form-group ${dateErrors.day || dateErrors.month || dateErrors.year ? 'govuk-form-group--error' : ''}`}>
                                                <fieldset className="govuk-fieldset" role="group" aria-describedby="passport-issued-hint">
                                                    <label className="govuk-label govuk-label--m" htmlFor="description">
                                                        Due Date
                                                    </label>
                                                    {(dateErrors.day || dateErrors.month || dateErrors.year) && (
                                                        <p className="govuk-error-message">
                                                            <span className="govuk-visually-hidden">Error:</span> {dateErrors.day || dateErrors.month || dateErrors.year}
                                                        </p>
                                                    )}
                                                    <div className="govuk-date-input" id="passport-issued">
                                                        <div className="govuk-date-input__item">
                                                            <div className="govuk-form-group">
                                                                <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-day">
                                                                    Day
                                                                </label>
                                                                <input
                                                                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${dateErrors.day ? 'govuk-input--error' : ''}`}
                                                                    id="passport-issued-day"
                                                                    name="passport-issued-day"
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    value={dueDay}
                                                                    onChange={(e) => {
                                                                        setDueDay(e.target.value);
                                                                        if (dateErrors.day) {
                                                                            setDateErrors((prev) => ({ ...prev, day: undefined }));
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="govuk-date-input__item">
                                                            <div className="govuk-form-group">
                                                                <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-month">
                                                                    Month
                                                                </label>
                                                                <input
                                                                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${dateErrors.month ? 'govuk-input--error' : ''}`}
                                                                    id="passport-issued-month"
                                                                    name="passport-issued-month"
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    value={dueMonth}
                                                                    onChange={(e) => {
                                                                        setDueMonth(e.target.value);
                                                                        if (dateErrors.month) {
                                                                            setDateErrors((prev) => ({ ...prev, month: undefined }));
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="govuk-date-input__item">
                                                            <div className="govuk-form-group">
                                                                <label className="govuk-label govuk-date-input__label" htmlFor="passport-issued-year">
                                                                    Year
                                                                </label>
                                                                <input
                                                                    className={`govuk-input govuk-date-input__input govuk-input--width-4 ${dateErrors.year ? 'govuk-input--error' : ''}`}
                                                                    id="passport-issued-year"
                                                                    name="passport-issued-year"
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    value={dueYear}
                                                                    onChange={(e) => {
                                                                        setDueYear(e.target.value);
                                                                        if (dateErrors.year) {
                                                                            setDateErrors((prev) => ({ ...prev, year: undefined }));
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>
                                            <br />
                                            {/* <div className="govuk-form-group">
                                                <label className="govuk-label govuk-label--m" htmlFor="dueAt">
                                                    Due date and time (ISO format)
                                                </label>
                                                <input
                                                    className="govuk-input"
                                                    id="dueAt"
                                                    name="dueAt"
                                                    type="text"
                                                    placeholder="2024-12-31T23:59:00"
                                                    value={dueAt}
                                                    onChange={(e) => setDueAt(e.target.value)}
                                                />
                                            </div> */}
                                            <button type="submit" className="govuk-button" data-module="govuk-button">
                                                Create task
                                            </button>
                                        </form>
                                    </section>
                                </div>
                            </div>
                        </div>

                        <section>
                            <h2 className="govuk-heading-m">All tasks</h2>
                            {loadingTasks ? (
                                <div className="govuk-body">Loading tasks...</div>
                            ) : tasks.length === 0 ? (
                                <div className="govuk-body">No tasks available.</div>
                            ) : (
                                <div className="govuk-summary-list">
                                    {tasks.map((t) => (
                                        <div key={t.id} className="govuk-summary-list__row" style={{ paddingTop: '1rem', paddingBottom: '1rem', borderTop: '1px solid #b1b4b6' }}>
                                            <div className="govuk-summary-list__key" style={{ width: '40%' }}>
                                                <Link href={`/tasks/${t.id}`} className="govuk-link">
                                                    <div className="govuk-heading-s" style={{ marginTop: 0, marginBottom: '0.5rem' }}>
                                                        {t.title}
                                                    </div>
                                                </Link>
                                                {t.description && (
                                                    <p className="govuk-body-s" style={{ marginBottom: '0.25rem' }}>
                                                        {t.description}
                                                    </p>
                                                )}
                                                {t.dueDate && (
                                                    <p
                                                        className="govuk-body-xs"
                                                        style={{
                                                            color: isOverdue(t.dueDate) ? '#d4351c' : '#626a6e',
                                                            marginBottom: 0
                                                        }}
                                                    >
                                                        Due: {new Date(t.dueDate).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="govuk-summary-list__value" style={{ width: '30%' }}>
                                                <select value={t.status} onChange={(e) => updateStatus(t.id, e.target.value)} className="govuk-select">
                                                    <option value={TaskStatus.NotStarted}>Not Started</option>
                                                    <option value={TaskStatus.InProgress}>In Progress</option>
                                                    <option value={TaskStatus.Complete}>Complete</option>
                                                </select>
                                            </div>
                                            <div className="govuk-summary-list__actions" style={{ width: '30%', textAlign: 'right' }}>
                                                <Link href={`/tasks/${t.id}`} className="govuk-link govuk-link--no-visited-state">
                                                    View
                                                </Link>
                                                <button
                                                    className="govuk-link govuk-link--no-visited-state"
                                                    onClick={() => deleteTask(t.id)}
                                                    style={{ color: '#d4351c', cursor: 'pointer', marginLeft: '1rem', border: 'none', background: 'none', padding: 0 }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
