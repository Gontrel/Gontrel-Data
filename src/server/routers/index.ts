import { publicProcedure, router } from "@/lib/trpc";
import { z } from "zod";
import { authRouter } from "./auth";
import { restaurantRouter } from "./restaurant";
import { adminRouter } from "./admin";
import { externalRouter } from "./external";

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
  auth: authRouter,
  restaurant: restaurantRouter,
  admin: adminRouter,
  external: externalRouter,
});

export type AppRouter = typeof appRouter;
