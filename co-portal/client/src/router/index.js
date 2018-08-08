import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import TestList from '@/components/TestList'
import SetTest from '@/components/SetTest'
import TakeTest from '@/components/TakeTest'
import TestMarks from '@/components/TestMarks'
import StudentList from '@/components/Student/StudentList'
import ModuleList from '@/components/Module/ModuleList'
import LecturerList from '@/components/Lecturer/LecturerList'

Vue.use(Router)

import store from '../store';
import swal from "sweetalert";


const router = new Router({
  routes: [{
      path: '/',
      name: 'Home',
      meta: {
        authLevel: null,
      },
      component: Home
    }, {
      path: '/login',
      name: 'Login',
      meta: {
        authLevel: null,
      },
      component: Login
    }, {
      path: '/test/list',
      name: 'TestList',
      meta: {
        authLevel: ['STUDENT', 'ADMIN', 'LECTURER'],
      },
      component: TestList
    }, {
      path: '/test/take',
      name: 'TakeTest',
      meta: {
        authLevel: ['STUDENT', 'ADMIN', 'LECTURER'],
      },
      props: true,
      component: TakeTest
    }, {
      path: '/test/marks',
      name: 'TestMarks',
      meta: {
        authLevel: ['STUDENT', 'ADMIN', 'LECTURER'],
      },
      props: true,
      component: TestMarks
    }, {
      path: '/test/set',
      name: 'SetTest',
      meta: {
        authLevel: ['LECTURER'],
      },
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
      },
      component: StudentList
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
      },
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
      },
      component: ModuleList
    }
    /**
     * Lecturer routes END
     */
  ]
});

router.beforeEach((to, from, next) => {
  var userType = store.state.user.type;
  if (to.meta.authLevel != null) {
    if (userType == null) {
      swal("You are not Authorized to access this page!", "You must be logged in to access this page.", "error").then((value) => {
        next('/');
      });;
      return;
    } else {
      if (to.meta.authLevel.indexOf(userType) < 0) {
        swal("You are not Authorized to access this page!", "If you feel this is unfair, please contact admin.", "error").then((value) => {
          next('/');
        });
        return;
      }
    }
  }
  next();
});

export default router;
