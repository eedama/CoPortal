import Home from "../components/main/Home.vue";
import Login from "../components/main/Login.vue";

var appSettings = require("application-settings");
import {
  Feedback,
  FeedbackType,
  FeedbackPosition
} from "nativescript-feedback";
var feedback = new Feedback();

var router = {
  routes: {
    /**
     * Main Routes
     */
    "/home": {
      name: "home",
      path: "/home",
      component: Home,
      meta: {
        title: "Home",
        authLevel: 0
      }
    },
    "/login": {
      name: "login",
      path: "/login",
      component: Login,
      meta: {
        title: "Login",
        authLevel: 0
      }
    }
  }
};

export default router;
