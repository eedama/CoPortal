import Home from "../components/main/Home.vue";
import Login from "../components/main/Login.vue";

// Pages
import Modules from "../components/pages/Modules.vue";
import Notifications from "../components/pages/Notifications.vue";
import Profile from "../components/pages/Profile.vue";
// Components
import Module from "../components/pages/components/Module.vue";
// Tests
import TakeTest from "../components/pages/components/TakeTest.vue";

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
    },
    /**
     * Pages
     */
    "/module/list": {
      name: "modules",
      path: "/module/list",
      component: Modules,
      meta: {
        title: "Modules",
        authLevel: 0
      }
    },
    "/notifications/list": {
      name: "notifications",
      path: "/notifications/list",
      component: Notifications,
      meta: {
        title: "Notifications",
        authLevel: 0
      }
    },
    "/student/profile/view": {
      name: "profile",
      path: "/student/profile/view/:userId",
      component: Profile,
      meta: {
        title: "StudentProfile",
        authLevel: 0
      }
    },
    /**
     * Components
     */
    "/module/view": {
      name: "module",
      path: "/module/view/:moduleId",
      component: Module,
      meta: {
        title: "Module",
        authLevel: 0
      }
    },
    /**
     * Tests
     */
    "/take/test": {
      name: "taketest",
      path: "/take/test/:questionaireId",
      component: TakeTest,
      meta: {
        title: "TakeTest",
        authLevel: 0
      }
    }
  }
};

export default router;
