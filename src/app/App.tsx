import { RouterProvider } from 'react-router';
import { router } from '../core/routes';
import { Toaster } from '@/shared/components/ui/sonner';
import { ErrorBoundary, ConsoleWarningFilter } from '@/shared/components/common';

// Main App component - LMS System
export default function App() {
  return (
    <ErrorBoundary>
      <ConsoleWarningFilter />
      <RouterProvider router={router} />
      <Toaster />
    </ErrorBoundary>
  );
}