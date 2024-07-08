import HomePage from "../pages/home.svelte";
import ProfilePage from "../pages/profile.svelte";
import PlanSession from "../pages/planSession.svelte";
import MessagesPage from "../pages/message.svelte";
import Planner from "../pages/planner.svelte";
import { writable } from "svelte/store";

export const hideToolbar = writable(false);

var routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/profile/",
    component: ProfilePage,
  },
  {
    path: "/plan/:sub",
    component: PlanSession,
  },
  {
    path: "/messages/:sub/:topic/",
    component: MessagesPage,
  },
  {
    path: "/planner/",
    component: Planner,
  },
];

export default routes;
