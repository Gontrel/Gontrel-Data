import { publicProcedure, router } from "@/lib/trpc";
import { z } from "zod";
import { authRouter } from "./auth";

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
