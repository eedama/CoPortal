// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";
import VueTyperPlugin from 'vue-typer'
import VueMaterial from "vue-material";
import * as VueLoaders from 'vue-loaders';

import * as moment from "moment";

import "materialize-css/dist/css/materialize.min.css";
var materialize = require("materialize-css/dist/js/materialize.min.js");
import "vue-animate/dist/vue-animate.min.css";
import 'vue-loaders/dist/vue-loaders.css';

import {
  Picker,
  Emoji
} from "emoji-mart-vue";
import 'emoji-mart-vue/css/emoji-mart.css'

Vue.component("picker", Picker);
Vue.component("emoji", Emoji);

Vue.config.productionTip = false
Vue.use(VueTyperPlugin)
Vue.use(VueMaterial)
Vue.use(VueLoaders);
// Vue.use(MdOption)
// Vue.use(Mdfield)

Vue.prototype.$materialize = materialize;
Vue.prototype.$emoji = Emoji;
Vue.mixin({
  methods: {
    getMoment(value) {
      return moment(value);
    },
    goToModule(moduleID) {
      this.$router.push({
        name: "ModuleView",
        params: {
          moduleID: moduleID
        }
      })
    },
    goToLecturer(lecturerIDs) {
      this.$router.push({
        name: "LecturerList",
        params: {
          lecturerIDs: lecturerIDs
        }
      })
    },
    goToStudent(studentIDs) {
      this.$router.push({
        name: "StudentList",
        params: {
          studentIDs: studentIDs
        }
      })
    },
    goToSolution(solutionID) {
      this.$router.push({
        name: "TestMarks",
        params: {
          solutionId: solutionID
        }
      });
    },
    goToTakeTest(questionaire) {
      this.$router.push({
        name: "TakeTest",
        params: {
          dbQuestionaire: questionaire
        }
      });
    },
    setATestForModule(moduleID) {
      this.$router.push({
        name: "SetTest",
        params: {
          moduleID: moduleID
        }
      })
    },
    Logout() {
      this.$store.commit("logout");
      this.$router.push("/login");
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  mounted() {
    materialize.AutoInit();
  },
  template: '<App/>'
})
