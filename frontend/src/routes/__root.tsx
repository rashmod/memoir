import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import Navbar from '@/components/custom/navbar';
import ThemeProvider from '@/providers/theme';

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="grid min-h-[100dvh] grid-rows-[auto_1fr]">
          <Navbar />
          <div className="container mx-auto grid grid-rows-subgrid p-8">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  ),
});
