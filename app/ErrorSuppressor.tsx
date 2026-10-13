'use client';

import { useEffect } from 'react';

export default function ErrorSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalError = console.error;
      console.error = (...args: any[]) => {
        const errorMsg = typeof args[0] === 'string' ? args[0] : '';

        // Ignore both directions of the controlled/uncontrolled warning
        if (
          errorMsg.includes('changing a controlled input to be uncontrolled') ||
          errorMsg.includes('changing an uncontrolled input to be controlled')
        ) {
          return;
        }

        originalError.apply(console, args);
      };
    }
  }, []);

  return null;
}