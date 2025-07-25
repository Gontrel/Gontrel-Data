import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { createContext } from "@/lib/trpc-context";

const handler = async (req: Request) => {
  const resHeaders = new Headers();
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) =>
      createContext({ req, resHeaders, info: opts.info }),
  });

  resHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
};

export { handler as GET, handler as POST };
