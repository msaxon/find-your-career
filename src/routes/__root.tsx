import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";
import { theme } from "../theme/theme.tsx";
import { Layout } from "../pages/layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export const Route = createRootRoute({
  component: () => (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Outlet />
        </Layout>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </MantineProvider>
  ),
});
