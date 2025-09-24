import { router } from "@/lib/trpc";
import { authRouter } from "./auth";
import { restaurantRouter } from "./restaurant";
import { adminRouter } from "./admin";
import { externalRouter } from "./external";
import { postRouter } from "./posts";
import { staffsRouter } from "./staffs";
import { userRouter } from "./user";
import { reportRouter } from "./reports";
import { notificationRouter } from "./notification";

export const appRouter = router({
  auth: authRouter,
  restaurant: restaurantRouter,
  admin: adminRouter,
  external: externalRouter,
  post: postRouter,
  staffs: staffsRouter,
  user: userRouter,
  reports: reportRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
