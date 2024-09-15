import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import Table from '@/videos/table';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="grid min-h-[100dvh] grid-rows-[auto_1fr]">
        <div className="container mx-auto p-8">
          <Table />
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  ),
});
