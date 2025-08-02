import { router } from "@/lib/trpc";
import { authRouter } from "./auth";
import { restaurantRouter } from "./restaurant";
import { adminRouter } from "./admin";
import { externalRouter } from "./external";
import { postRouter } from "./posts";

export const appRouter = router({
  auth: authRouter,
  restaurant: restaurantRouter,
  admin: adminRouter,
  external: externalRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
