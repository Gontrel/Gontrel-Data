import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = (opts: FetchCreateContextFnOptions) => {
  return {
    ...opts,
    req: opts.req,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
