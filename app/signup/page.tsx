'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';

export default function SignupPage() {
    const { signUp, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; passwordConfirm?: string }>({});



    if (user) {
        router.push('/tasks');
    }

    const validateFields = (): boolean => {
        const errors: { email?: string; password?: string; passwordConfirm?: string } = {};

        // Email validation
        if (!email.trim()) {
            errors.email = 'Enter your email address';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Enter a valid email address';
        }

        // Password validation
        if (!password) {
            errors.password = 'Enter your password';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        // Password confirmation validation
        if (!passwordConfirm) {
            errors.passwordConfirm = 'Confirm your password';
        } else if (password !== passwordConfirm) {
            errors.passwordConfirm = 'Passwords do not match';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateFields()) {
            return;
        }

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
                            <div className={`govuk-form-group ${fieldErrors.email ? 'govuk-form-group--error' : ''}`}>
                                <label className="govuk-label" htmlFor="email">
                                    Email address
                                </label>
                                {fieldErrors.email && (
                                    <p className="govuk-error-message">
                                        <span className="govuk-visually-hidden">Error:</span> {fieldErrors.email}
                                    </p>
                                )}
                                <input
                                    className={`govuk-input govuk-input--width-20 ${fieldErrors.email ? 'govuk-input--error' : ''}`}
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (fieldErrors.email) {
                                            setFieldErrors(prev => ({ ...prev, email: undefined }));
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <div className={`govuk-form-group ${fieldErrors.password ? 'govuk-form-group--error' : ''}`}>
                                <label className="govuk-label" htmlFor="password">
                                    Password
                                </label>
                                {fieldErrors.password && (
                                    <p className="govuk-error-message">
                                        <span className="govuk-visually-hidden">Error:</span> {fieldErrors.password}
                                    </p>
                                )}
                                <input
                                    className={`govuk-input govuk-input--width-20 ${fieldErrors.password ? 'govuk-input--error' : ''}`}
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) {
                                            setFieldErrors(prev => ({ ...prev, password: undefined }));
                                        }
                                    }}
                                    required
                                />
                            </div>

                            <div className={`govuk-form-group ${fieldErrors.passwordConfirm ? 'govuk-form-group--error' : ''}`}>
                                <label className="govuk-label" htmlFor="password-confirm">
                                    Confirm password
                                </label>
                                {fieldErrors.passwordConfirm && (
                                    <p className="govuk-error-message">
                                        <span className="govuk-visually-hidden">Error:</span> {fieldErrors.passwordConfirm}
                                    </p>
                                )}
                                <input
                                    className={`govuk-input govuk-input--width-20 ${fieldErrors.passwordConfirm ? 'govuk-input--error' : ''}`}
                                    id="password-confirm"
                                    name="password-confirm"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={passwordConfirm}
                                    onChange={(e) => {
                                        setPasswordConfirm(e.target.value);
                                        if (fieldErrors.passwordConfirm) {
                                            setFieldErrors(prev => ({ ...prev, passwordConfirm: undefined }));
                                        }
                                    }}
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
