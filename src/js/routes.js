import HomePage from "../pages/home.svelte";
import ProfilePage from "../pages/profile.svelte";

var routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/profile/",
    component: ProfilePage,
  },
];

export default routes;
