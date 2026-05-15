'use client';

import { useEffect } from 'react';

export default function GovUKInitializer() {
  useEffect(() => {
    // Initialize GOV.UK components when component mounts
    const initGovUK = async () => {
      try {
        const { initAll } = await import('govuk-frontend');
        initAll();
      } catch (err) {
        console.error('Failed to initialize GOV.UK Frontend:', err);
      }
    };

    // Give the DOM a moment to fully render before initializing
    const timeoutId = setTimeout(initGovUK, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}
