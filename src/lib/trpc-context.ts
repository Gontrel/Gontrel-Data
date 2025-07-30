import APIRequest from "@/api/service";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = (opts: FetchCreateContextFnOptions) => {
  const apiRequest = new APIRequest(opts.req.headers);
  return {
    ...opts,
    req: opts.req,
    apiRequest,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
