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
        retry: false, // Disable automatic retries to prevent infinite loading
        retryDelay: 0,
        // Add mutation timeout
        gcTime: 0, // Don't cache mutations
      },
    },
  }));

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // Add logger for debugging (only in development)
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          logger: (opts) => {
            if (opts.direction === "down" && opts.result instanceof Error) {
              console.error("[tRPC Error]", opts.path, opts.result);
            } else if (process.env.NODE_ENV === "development") {
              console.log("[tRPC]", opts.direction, opts.path, opts);
            }
          },
        }),
        httpBatchLink({
          url: "/api/trpc",
          // CRITICAL: Include credentials for cookie-based auth in all browsers
          // This is especially important for Safari and strict Chrome browsers
          fetch: (url, options) => {
            // Create timeout controller for browser compatibility
            const timeoutController = new AbortController();
            const timeoutId = setTimeout(() => {
              timeoutController.abort();
            }, 30000); // 30s timeout

            // Use timeout signal, but respect existing signal if provided
            // If both exist, create a merged signal that aborts when either aborts
            let finalSignal = timeoutController.signal;
            if (options?.signal) {
              const mergedController = new AbortController();
              
              // Abort merged when timeout fires
              timeoutController.signal.addEventListener("abort", () => {
                mergedController.abort();
              });
              
              // Abort merged when existing signal aborts
              options.signal.addEventListener("abort", () => {
                clearTimeout(timeoutId); // Clear timeout if request is cancelled
                mergedController.abort();
              });
              
              finalSignal = mergedController.signal;
            }

            const fetchPromise = fetch(url, {
              ...options,
              credentials: "include", // Required for cookies to work in all browsers
              signal: finalSignal,
            }).catch((error) => {
              // Clear timeout on error
              clearTimeout(timeoutId);
              // Provide better error messages
              if (error.name === "AbortError" || error.message?.includes("aborted")) {
                // Check if it was a timeout or user cancellation
                if (timeoutController.signal.aborted) {
                  throw new Error("Request timeout. Please try again.");
                }
                throw new Error("Request was cancelled.");
              }
              throw error;
            });

            // Clear timeout if fetch completes (success or error)
            fetchPromise.finally(() => {
              clearTimeout(timeoutId);
            });

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
