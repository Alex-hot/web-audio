import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    redirect: "/player",
    children: [
      {
        path: "/player",
        component: () => import("../views/Player"),
        name: "Player",
      },
      {
        path: "/st",
        component: () => import("../views/ST"),
        name: "ST",
      },
      {
        path: "/magic",
        component: () => import("../views/Magic"),
        name: "Magic",
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
