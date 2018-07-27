import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import TestList from '@/components/TestList'
import SetTest from '@/components/SetTest'
import TakeTest from '@/components/TakeTest'
import TestMarks from '@/components/TestMarks'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/test/list',
    name: 'TestList',
    component: TestList
  }, {
    path: '/test/take',
    name: 'TakeTest',
    props: true,
    component: TakeTest
  }, {
    path: '/test/marks',
    name: 'TestMarks',
    props: true,
    component: TestMarks
  }, {
    path: '/test/set',
    name: 'SetTest',
    component: SetTest
  }]
})
