import { publicProcedure, router } from "@/lib/trpc";
import { z } from "zod";
import { authRouter } from "./auth";
import { restaurantRouter } from "./restaurants";

export const appRouter = router({
  auth: authRouter,
  restaurants: restaurantRouter,
});

export type AppRouter = typeof appRouter;
