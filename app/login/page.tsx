'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider';
import { initAll } from 'govuk-frontend';

export default function LoginPage() {
    const { signIn, signUp, signInWithGoogle, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize GOV.UK Frontend components
        initAll();
    }, []);

    if (user) {
        router.push('/tasks');
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await signIn(email, password);
            router.push('/tasks');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign in failed';
            setError(message);
        }
    };

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

    const handleGoogle = async () => {
        setError(null);
        try {
            await signInWithGoogle();
            router.push('/tasks');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Google sign in failed';
            setError(message);
        }
    };

    return (
        <>
            <main className="govuk-main-wrapper">
                <div className="govuk-width-container">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-xl">Sign in</h1>

                            {error && (
                                <div className="govuk-error-summary" data-module="govuk-error-summary">
                                    <div className="govuk-error-summary__body">
                                        <ul className="govuk-list govuk-error-summary__list">
                                            <li>{error}</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSignIn}>
                                <div className="govuk-form-group">
                                    <label className="govuk-label" htmlFor="email">
                                        Email address
                                    </label>
                                    <input
                                        className="govuk-input"
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
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
                                        Sign in
                                    </button>
                                    <button type="button" className="govuk-button govuk-button--secondary" onClick={handleSignUp} data-module="govuk-button">
                                        Create account
                                    </button>
                                    <button type="button" className="govuk-button govuk-button--secondary" onClick={handleGoogle} data-module="govuk-button">
                                        Sign in with Google
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <main className="govuk-main-wrapper">
                <div className="govuk-width-container">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-two-thirds">
                            <h2 className="govuk-heading-m">Help and information</h2>
                            <div className="govuk-accordion" data-module="govuk-accordion" id="accordion-default">
                                <div className="govuk-accordion__section">
                                    <div className="govuk-accordion__section-header">
                                        <h3 className="govuk-accordion__section-heading">
                                            <button type="button" className="govuk-accordion__section-button" id="accordion-default-heading-1">
                                                Writing well for the web
                                            </button>
                                        </h3>
                                    </div>
                                    <div id="accordion-default-content-1" className="govuk-accordion__section-content">
                                        <p className="govuk-body">This is the content for Writing well for the web.</p>
                                    </div>
                                </div>
                                <div className="govuk-accordion__section">
                                    <div className="govuk-accordion__section-header">
                                        <h3 className="govuk-accordion__section-heading">
                                            <button type="button" className="govuk-accordion__section-button" id="accordion-default-heading-2">
                                                Writing well for specialists
                                            </button>
                                        </h3>
                                    </div>
                                    <div id="accordion-default-content-2" className="govuk-accordion__section-content">
                                        <p className="govuk-body">This is the content for Writing well for specialists.</p>
                                    </div>
                                </div>
                                <div className="govuk-accordion__section">
                                    <div className="govuk-accordion__section-header">
                                        <h3 className="govuk-accordion__section-heading">
                                            <button type="button" className="govuk-accordion__section-button" id="accordion-default-heading-3">
                                                Know your audience
                                            </button>
                                        </h3>
                                    </div>
                                    <div id="accordion-default-content-3" className="govuk-accordion__section-content">
                                        <p className="govuk-body">This is the content for Know your audience.</p>
                                    </div>
                                </div>
                                <div className="govuk-accordion__section">
                                    <div className="govuk-accordion__section-header">
                                        <h3 className="govuk-accordion__section-heading">
                                            <button type="button" className="govuk-accordion__section-button" id="accordion-default-heading-4">
                                                How people read
                                            </button>
                                        </h3>
                                    </div>
                                    <div id="accordion-default-content-4" className="govuk-accordion__section-content">
                                        <p className="govuk-body">This is the content for How people read.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
