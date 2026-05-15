import Link from 'next/link';

export default function Home() {
    return (
        <main className="govuk-main-wrapper">
            <div className="govuk-width-container">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        {/* Warning Notice */}
                        <div className="govuk-notification-banner govuk-notification-banner--important" role="region" aria-labelledby="govuk-notification-banner-title">
                            <div className="govuk-notification-banner__header">
                                <h2 className="govuk-notification-banner__title" id="govuk-notification-banner-title">
                                    Important
                                </h2>
                            </div>
                            <div className="govuk-notification-banner__content">
                                <p className="govuk-body">
                                    <strong>This is not a real government website.</strong> This service has been created solely for testing purposes and is not an official UK government service. Do
                                    not use this for any official transactions.
                                </p>
                            </div>
                        </div>

                        <h1 className="govuk-heading-xl">Task Management Service</h1>

                        <p className="govuk-body-l">This is a demonstration task management application built with GOV.UK Frontend components.</p>

                        <h2 className="govuk-heading-m">About this service</h2>
                        <p className="govuk-body">
                            This service allows users to create, manage, and track tasks with due dates and status updates.
                        </p>

                        <h2 className="govuk-heading-m">Resources</h2>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>
                                <a href="https://github.com/lewis1190/hmcts-dev-test-frontend-nextjs" className="govuk-link">
                                    Frontend GitHub Repository
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/lewis1190/hmcts-dev-test-backend-nestjs" className="govuk-link">
                                    Backend GitHub Repository
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/hmcts/dts-developer-challenge" className="govuk-link">
                                    Official DTS Developer Challenge Brief GitHub Repository
                                </a>
                            </li>
                        </ul>

                        <h2 className="govuk-heading-m">Get started</h2>
                        <p className="govuk-body">To begin using the task management service, sign in with your account.</p>

                        <div className="govuk-button-group">
                            <Link href="/login" className="govuk-button govuk-button--start">
                                Sign in
                                <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false">
                                    <path fill="currentColor" d="m0 0h13l20 20-20 20H0l20-20z"></path>
                                </svg>
                            </Link>
                        </div>

                        <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

                        <h2 className="govuk-heading-m">{`Don't have an account?`}</h2>
                        <p className="govuk-body">
                            <Link href="/signup" className="govuk-link">
                                Create a new account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
