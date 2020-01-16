import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import vuetify from './plugins/vuetify';
import axios from "axios";

import moment from "moment";
import "vue-animate/dist/vue-animate.min.css";
import "vue-loaders/dist/vue-loaders.css";
import "emoji-mart-vue/css/emoji-mart.css";
import swal from "sweetalert2";
import { Dictionary } from 'vue-router/types/router';

const VueSession = require("vue-session");
const { Picker, Emoji } = require("emoji-mart-vue");
const VueTyperPlugin = require("vue-typer");
const VueLoaders = require("vue-loaders");

Vue.component("picker", Picker);
Vue.component("emoji", Emoji);

Vue.config.productionTip = false;
Vue.use(VueTyperPlugin);
Vue.use(VueLoaders);
Vue.use(VueSession, {
  persist: true
});

Vue.prototype.$emoji = Emoji;
Vue.mixin({
  methods: {
    changeSchool() {
      let webLink = document.location.host.split(".");
      let school = webLink[0];
      if (school && school.indexOf('localhost') >= 0) {
        this.$store.commit("changeSchool", 'test');
      } else {
        axios
          .get(this.$store.state.settings.baseLink + "/get/all/Schools")
          .then(results => {
            var found = false;
            results.data.forEach((schoolUrl: { url: string }) => {
              if (schoolUrl.url === school) {
                this.$store.commit("changeSchool", school);
                found = true;
              }
            });
            if (!found) {
              ///code to be added if school is not found from url
              swal.fire(
                `The school ${school} is not on our server`,
                "Please contact the admin if this is an unexpected error",
                "error"
              );
            }
          })
          .catch(err => {
            if (err.response != null && err.response.status == 512) {
              swal.fire(
                err.response.data,
                "Please contact the admin if this is an unexpected error",
                "error"
              );
            }
          });
      }
    },
    getMoment(value: Date | undefined) {
      return moment(value);
    },
    goToModule(moduleID: string) {
      this.$router.push({
        name: "ModuleView",
        params: {
          moduleID: moduleID
        }
      });
    },
    goToLecturer(lecturerID: string) {
      this.$router.push({
        name: "LecturerList",
        params: {
          lecturerIDs: lecturerID
        }
      });
    },
    goToStudent(studentID: string) {
      this.$router.push({
        name: "StudentList",
        params: {
          studentIDs: studentID
        }
      });
    },
    goToSolution(solutionID: string) {
      this.$router.push({
        name: "TestMarks",
        params: {
          solutionId: solutionID
        }
      });
    },
    goToTakeTest(questionaire: any) {
      this.$router.push({
        name: "TakeTest",
        params: {
          dbQuestionaire: questionaire
        }
      });
    },
    setATestForModule(moduleID: string) {
      this.$router.push({
        name: "SetTest",
        params: {
          moduleID: moduleID
        }
      });
    },
    Login(results: any) {
      switch (results.data.userType) {
        case "ADMIN":
          this.$store.commit("login", {
            id: results.data.user._id,
            username: results.data.user.username,
            password: results.data.user.password,
            type: "ADMIN",
            isLoggedIn: true
          });
          this.$router.push("/");
          break;
        case "LECTURER":
          this.$store.commit("login", {
            id: results.data.user._id,
            username: results.data.user.username,
            password: results.data.user.password,
            type: "LECTURER",
            isLoggedIn: true
          });
          this.$router.push("/");
          break;
        case "STUDENT":
          this.$store.commit("login", {
            id: results.data.user._id,
            username: results.data.user.username,
            password: results.data.user.password,
            type: "STUDENT",
            isLoggedIn: true
          });
          this.$router.push("/");
          break;
        case "PARENT": {
          this.$store.commit("setParent", true);
          this.$store.commit("setStudentParent", results.data.user);
          this.$store.commit("setParentStudents", results.data.students);
          const user = results.data.students[0];
          this.$store.commit("login", {
            id: user._id,
            username: user.username,
            password: user.password,
            type: "STUDENT",
            isLoggedIn: true
          });
          this.$router.push("/");
        }
      }
      this.$session.start();
      let newUser: any = null;
      if (results.data.userType === 'PARENT') {
        newUser = {
          type: results.data.userType,
          results: results,
        }
      } else {
        newUser = {
          id: results.data.user._id,
          username: results.data.user.username,
          type: results.data.userType,
          isLoggedIn: true
        };
      }
      this.$session.set("user", newUser);
      var users = this.$session.get("users");
      if (users == null) {
        users = new Array();
      }
      // unique
      users = users.filter((user: { id: string }) => user.id != newUser.id);
      users.push(newUser);
      this.$session.set("users", users);
    },
    logout() {
      this.$session.remove("user");
      this.$store.commit("logout");
      this.$router.push("/login");
    }
  }
});

new Vue({
  router,
  store,
  beforeCreate() {
    this.$store.commit('initialiseStore');
  },
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
