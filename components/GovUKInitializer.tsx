'use client';

import { useEffect } from 'react';

export default function GovUKInitializer() {
  useEffect(() => {
    const initGovUK = async () => {
      const { initAll } = await import('govuk-frontend');
      initAll();
    };
    initGovUK();
  }, []);

  return null;
}
