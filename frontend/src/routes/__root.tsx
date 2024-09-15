import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import Navbar from '@/components/custom/navbar';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="grid min-h-[100dvh] grid-rows-[auto_1fr]">
        <Navbar />
        <div className="container mx-auto p-8">
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  ),
});
