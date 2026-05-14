'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { initAll } from 'govuk-frontend';

export default function SignupPage() {
    const { signUp, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initAll();
    }, []);

    if (user) {
        router.push('/tasks');
    }

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signUp(email, password);
            router.push('/tasks');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed';
            setError(message);
        }
    };

    return (
        <main className="govuk-main-wrapper">
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-xl">Create account</h1>

                        {error && (
                            <div className="govuk-error-summary" data-module="govuk-error-summary">
                                <div className="govuk-error-summary__body">
                                    <ul className="govuk-list govuk-error-summary__list">
                                        <li>{error}</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSignUp}>
                            <div className="govuk-form-group">
                                <label className="govuk-label" htmlFor="email">
                                    Email address
                                </label>
                                <input className="govuk-input" id="email" name="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="govuk-form-group">
                                <label className="govuk-label" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="govuk-input"
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="govuk-button-group">
                                <button type="submit" className="govuk-button" data-module="govuk-button">
                                    Create account
                                </button>
                            </div>
                        </form>

                        <p className="govuk-body">
                            Already have an account?{' '}
                            <Link href="/login" className="govuk-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
