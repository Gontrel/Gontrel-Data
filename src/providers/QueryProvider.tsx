"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { httpBatchLink, loggerLink } from "@trpc/client";

/**
 * QueryProvider component
 * @param children - The children components
 * @returns The QueryProvider component
 */
export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: true,
            refetchOnMount: true,
            retry: (failureCount, error) => {
              if (error instanceof Error && error.message.includes("4")) {
                return false;
              }
              return failureCount < 2;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            retry: false, // Disable automatic retries to prevent infinite loading
            retryDelay: 0,
            // Add mutation timeout
            gcTime: 0, // Don't cache mutations
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // Add logger for debugging (only in development)
        loggerLink({
          enabled: () => true, // Always enabled for debugging
        }),
        httpBatchLink({
          url: "/api/trpc",
          // Let tRPC handle everything - just ensure credentials are included
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: "include", // Required for cookies to work in all browsers
            } as RequestInit);
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
