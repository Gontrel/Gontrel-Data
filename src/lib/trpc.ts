import { initTRPC } from "@trpc/server";
import { type Context } from "./trpc-context";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to check authentication
const isAuthed = t.middleware(({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
