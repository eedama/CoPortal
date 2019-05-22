import {
  Feedback,
  FeedbackPosition,
  FeedbackType
} from "nativescript-feedback";

import Home from "../components/main/Home.vue";
import Login from "../components/main/Login.vue";
import ForgotPassword from "../components/pages/components/ForgotPassword.vue";
import Module from "../components/pages/components/Module.vue";
import TakeTest from "../components/pages/components/TakeTest.vue";
import TestMarks from "../components/pages/components/TestMarks.vue";
import Timetable from "../components/pages/components/Timetable.vue";
import Modules from "../components/pages/Modules.vue";
import Notifications from "../components/pages/Notifications.vue";
import Profile from "../components/pages/Profile.vue";
import Marks from "../components/pages/Marks.vue";
import Settings from "../components/pages/Settings.vue";
import PDFView from "../components/pages/PDFView.vue";

// Pages
// Components
// Tests
var appSettings = require("application-settings");
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
    "/pdf/view": {
      name: "pdfview",
      path: "/module/list",
      component: PDFView,
      meta: {
        title: "PDFView",
        authLevel: 0
      }
    },
    "/module/list": {
      name: "modules",
      path: "/module/list",
      component: Modules,
      meta: {
        title: "Modules",
        authLevel: 0
      }
    },
    "/reset/Password": {
      name: "Forgot Password",
      path: "/reset/Password",
      component: ForgotPassword,
      meta: {
        title: "Reset Password",
        authLevel: 0
      }
    },
    "/timetable/view": {
      name: "timetable",
      path: "/timetable/list",
      component: Timetable,
      meta: {
        title: "timetable",
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
    "/questionaire/marks": {
      title: "MarkList",
      name: "questionaire",
      path: "/questionaire/marks/:questionaire",
      component: Marks,
      meta: {
        title: "MarkList",
        authLevel: 0
      }
    },
    "/settings": {
      title: "Settings",
      name: "settings",
      path: "/settings",
      component: Settings,
      meta: {
        title: "Settings",
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
    },
    "/test/marks": {
      name: "testmarks",
      path: "/test/marks/:solutionId",
      component: TestMarks,
      meta: {
        title: "TestMarks",
        authLevel: 0
      }
    }
  }
};

export default router;
