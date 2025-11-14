"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { httpBatchLink } from "@trpc/client";

/**
 * QueryProvider component
 * @param children - The children components
 * @returns The QueryProvider component
 */
export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        retry: (failureCount, error) => {
          if (error instanceof Error && error.message.includes('4')) {
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        retry: 1,
        retryDelay: 1000,
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          // CRITICAL: Include credentials for cookie-based auth in all browsers
          // This is especially important for Safari and strict Chrome browsers
          fetch: (url, options) => {
            // Create timeout controller for browser compatibility
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            // Use existing signal if provided, otherwise use timeout signal
            const signal = options?.signal || controller.signal;

            const fetchPromise = fetch(url, {
              ...options,
              credentials: "include", // Required for cookies to work in all browsers
              signal,
            });

            // Clear timeout if fetch completes
            fetchPromise.finally(() => clearTimeout(timeoutId));

            return fetchPromise;
          },
          // Add headers for better browser compatibility
          headers: () => {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
            };
            return headers;
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
