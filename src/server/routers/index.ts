import { router } from "@/lib/trpc";
import { authRouter } from "./auth";
import { restaurantRouter } from "./restaurants";
import { tiktokRouter } from "./tiktok";
import { postRouter } from "./posts";

export const appRouter = router({
  auth: authRouter,
  restaurants: restaurantRouter,
  tiktok: tiktokRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
