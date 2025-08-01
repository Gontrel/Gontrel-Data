import { router } from "@/lib/trpc";
import { authRouter } from "./auth";
import { restaurantRouter } from "./restaurant";
import { adminRouter } from "./admin";
import { externalRouter } from "./external";

export const appRouter = router({
  auth: authRouter,
  restaurant: restaurantRouter,
  admin: adminRouter,
  external: externalRouter,
});

export type AppRouter = typeof appRouter;
