import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/components/Home.vue"
import Login from '@/components/Login.vue'
import TestList from '@/components/TestList.vue'
import SetTest from '@/components/SetTest.vue'
import TakeTest from '@/components/TakeTest.vue'
import TestMarks from '@/components/TestMarks.vue'
import StudentList from '@/components/Student/StudentList.vue'
import ModuleList from '@/components/Module/ModuleList.vue'
import LecturerList from '@/components/Lecturer/LecturerList.vue'
import ModuleView from '@/components/Module/ModuleView.vue'
import AllMarks from '@/components/Marks/AllMarks.vue'
import MarkSheet from '@/components/Marks/MarkSheet.vue'
import TakeSurvey from '@/components/Survey/TakeSurvey.vue'
import GeneralSurvey from '@/components/Survey/GeneralSurvey.vue'
import Report from '@/components/Report/Report.vue'
import AddStudentTemp from '@/components/admin/AddStudentTemp.vue'
import EditStudent from '@/components/Student/EditStudent.vue'
import SurveyList from '@/components/Survey/SurveyList.vue'

Vue.use(Router)

import store from '../store';
import swal from "sweetalert2";

const router = new Router({
  routes: [{
    path: '/',
    name: 'Home',
    meta: {
      authLevel: null,
      showNav: true
    },
    component: Home
  }, {
    path: '/login',
    name: 'Login',
    meta: {
      authLevel: null,
      showNav: true
    },
    component: Login
  }, {
    path: '/test/list',
    name: 'TestList',
    meta: {
      authLevel: ['STUDENT', 'ADMIN', 'LECTURER'],
      showNav: true
    },
    component: TestList
  }, {
    path: '/test/take',
    name: 'TakeTest',
    meta: {
      authLevel: ['STUDENT', 'ADMIN', 'LECTURER'],
      showNav: true
    },
    props: true,
    component: TakeTest
  }, {
    path: '/test/marks',
    name: 'TestMarks',
    meta: {
      authLevel: ['STUDENT', 'ADMIN', 'LECTURER'],
      showNav: true
    },
    props: true,
    component: TestMarks
  }, {
    path: '/test/set',
    name: 'SetTest',
    meta: {
      authLevel: ['LECTURER'],
      showNav: true
    },
    props: true,
    component: SetTest
  },
  /**
   * Student routes START
   */
  {
    path: '/student/list',
    name: 'StudentList',
    meta: {
      authLevel: ['LECTURER', 'ADMIN'],
      showNav: true
    },
    props: true,
    component: StudentList
  },
  {
    path: '/student/update',
    name: 'UpdateStudent',
    meta: {
      authLevel: ['ADMIN', 'LECTURER', 'STUDENT'],
      showNav: true
    },
    props: true,
    component: EditStudent
  },
  /**
   * Student routes END
   */
  /**
   * Lecturer routes START
   */
  {
    path: '/lecturer/list',
    name: 'LecturerList',
    meta: {
      authLevel: ['ADMIN'],
      showNav: true
    },
    props: true,
    component: LecturerList
  },
  /**
   * Lecturer routes END
   */

  /**
   * Module routes START
   */
  {
    path: '/module/list',
    name: 'ModuleList',
    meta: {
      authLevel: ['ADMIN', 'LECTURER', 'STUDENT'],
      showNav: true
    },
    component: ModuleList
  },
  {
    path: '/module/view',
    name: 'ModuleView',
    meta: {
      authLevel: ['ADMIN', 'LECTURER', 'STUDENT'],
      showNav: true
    },
    props: true,
    component: ModuleView
  },
  /**
   * Lecturer routes END
   */
  /**
   * Admin routes START
   */
  {
    path: '/temp/add/student',
    name: 'TempAddStudent',
    meta: {
      authLevel: ['ADMIN'],
      showNav: true
    },
    props: true,
    component: AddStudentTemp
  },
  /**
   * Admin routes END
   */
  /**
   * Marks routes START
   */
  {
    path: '/marks/all',
    name: 'AllMarks',
    meta: {
      authLevel: ['STUDENT'],
      showNav: true
    },
    props: true,
    component: AllMarks
  }, {
    path: '/marks/sheet',
    name: 'MarkSheet',
    meta: {
      authLevel: ['LECTURER', 'ADMIN'],
      showNav: true
    },
    props: true,
    component: MarkSheet
  }, {
    path: '/survey',
    name: 'Survey',
    meta: {
      authLevel: null,
      showNav: false
    },
    props: true,
    component: GeneralSurvey
  }, {
    path: '/module/survey/take/for/:moduleId',
    name: 'TakeSurvey',
    meta: {
      authLevel: ['STUDENT', 'ADMIN', 'LECTURER'],
      showNav: true
    },
    props: true,
    component: TakeSurvey
  }, {
    path: '/Student/Report',
    name: 'Report',
    meta: {
      authLevel: ['LECTURER', 'ADMIN'],
      showNav: false
    },
    props: true,
    component: Report
  }, {
    path: '/survey/list',
    name: 'SurveyList',
    meta: {
      authLevel: ['STUDENT', 'LECTURER', 'ADMIN'],
      showNav: true
    },
    props: true,
    component: SurveyList
  }
    /**
     * Marks routes END
     */
  ]
});

router.beforeEach((to, from, next) => {
  var userType = store.state.user.type;
  if (userType == null && router.app.$session.has('user')) {
    var user = router.app.$session.get('user');
    if (user.type === 'PARENT') {
      const results = user.results;
      store.commit("setParent", true);
      store.commit("setStudentParent", results.data.user);
      store.commit("setParentStudents", results.data.students);
      const currentUser = results.data.students[0];
      store.commit("login", {
        id: currentUser._id,
        username: currentUser.username,
        password: currentUser.password,
        type: "STUDENT",
        isLoggedIn: true
      });
    } else {
      store.commit("login", user);
    }
    userType = store.state.user.type;
  }

  if (userType == "ADMIN" && to.name != "TempAddStudent" && store.state.user.username == 'tempadmin') {
    next('/temp/add/student')
    return;
  }
  if (to.meta.authLevel != null) {
    if (userType == null) {
      swal.fire("You are not Authorized to access this page!", "You must be logged in to access this page.", "error").then((value) => {
        next('/');
      });;
      return;
    } else {
      if (to.meta.authLevel.indexOf(userType) < 0) {
        swal.fire("You are not Authorized to access this page!", "If you feel this is unfair, please contact admin.", "error").then((value) => {
          next('/');
        });
        return;
      }
    }
  }
  next();
});

export default router;
