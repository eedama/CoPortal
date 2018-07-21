import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import TestList from '@/components/TestList'
import SetTest from '@/components/SetTest'
import TakeTest from '@/components/TakeTest'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/test/set',
    name: 'SetTest',
    component: SetTest
  }]
})
