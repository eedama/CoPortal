import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SetTest from '@/components/SetTest'
import TakeTest from '@/components/TakeTest'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/test/take',
    name: 'TakeTest',
    component: TakeTest
  }, {
    path: '/test/set',
    name: 'SetTest',
    component: SetTest
  }]
})
