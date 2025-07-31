import { router } from "@/lib/trpc";
import { authRouter } from "./auth";
import { restaurantRouter } from "./restaurants";
import { tiktokRouter } from "./tiktok";

export const appRouter = router({
  auth: authRouter,
  restaurants: restaurantRouter,
  tiktok: tiktokRouter,
});

export type AppRouter = typeof appRouter;
