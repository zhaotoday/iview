import { createRouter, createWebHashHistory } from "vue-router";
import { loggedIn, logout } from "element-plus-admin/utils/auth";
import publicRoutes from "./routes/public";
import privateRoutes from "./routes/private";

const routes = [
  {
    path: "/",
    component: () => import("@/components/layout/index.vue"),
    children: privateRoutes,
    meta: {
      requiresAuth: true,
    },
  },
  ...publicRoutes,
  {
    path: "/:matchOthers(.*)*",
    component: () => import("@/views/404/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!loggedIn()) {
      logout();
      next({
        path: "login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export { router };
