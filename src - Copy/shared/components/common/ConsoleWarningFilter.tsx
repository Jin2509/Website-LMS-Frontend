import { useEffect } from 'react';

/**
 * Component to filter out known harmless warnings from console
 * This helps reduce noise during development
 */
export function ConsoleWarningFilter() {
  useEffect(() => {
    // Store original console methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Filter function for warnings
    console.warn = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      
      // Filter out known harmless warnings
      const ignoredWarnings = [
        'Detected multiple Jotai instances',
        'Detected multiple renderers concurrently',
      ];
      
      if (ignoredWarnings.some(warning => message.includes(warning))) {
        // Suppress these warnings
        return;
      }
      
      // Log other warnings normally
      originalWarn.apply(console, args);
    };

    // Filter function for errors - be more selective here
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      
      // Only filter specific non-critical errors from Figma environment
      const ignoredErrors = [
        'multiple Jotai instances',
        'multiple renderers concurrently',
      ];
      
      if (ignoredErrors.some(error => message.includes(error))) {
        // Convert to warning instead of error
        console.log('%c[Info]', 'color: blue', ...args);
        return;
      }
      
      // Log other errors normally
      originalError.apply(console, args);
    };

    // Cleanup: restore original console methods on unmount
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return null;
}
