import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { createContext } from "@/lib/trpc-context";

const handler = async (req: Request) => {
  const resHeaders = new Headers();
  
  // CRITICAL: Set CORS headers for browser compatibility
  // Some browsers (especially Safari) require explicit CORS headers
  const origin = req.headers.get("origin");
  if (origin) {
    resHeaders.set("Access-Control-Allow-Origin", origin);
    resHeaders.set("Access-Control-Allow-Credentials", "true");
    resHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    resHeaders.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-api-key"
    );
  }

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: resHeaders,
    });
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) =>
      createContext({ req, resHeaders, info: opts.info }),
  });

  // Merge response headers with our CORS headers
  resHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
};

export { handler as GET, handler as POST };
