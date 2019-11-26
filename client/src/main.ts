import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import vuetify from './plugins/vuetify';
import VueTyperPlugin from "vue-typer";
import * as VueLoaders from "vue-loaders";
import axios from "axios";

import * as moment from "moment";
import VueSession from "vue-session";

import "vue-animate/dist/vue-animate.min.css";
import "vue-loaders/dist/vue-loaders.css";

import { Picker, Emoji } from "emoji-mart-vue";
import "emoji-mart-vue/css/emoji-mart.css";

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
            results.data.forEach(schoolUrl => {
              if (schoolUrl.url === school) {
                this.$store.commit("changeSchool", school);
                found = true;
              }
            });
            if (!found) {
              ///code to be added if school is not found from url
              swal(
                `The school ${school} is not on our server`,
                "Please contact the admin if this is an unexpected error",
                "error"
              );
            }
            console.log("I was called", this.$store.state.settings.baseLink);
          })
          .catch(err => {
            if (err.response != null && err.response.status == 512) {
              this.txtError = err.response.data;
            }
          });
      }
    },
    getMoment(value) {
      return moment(value);
    },
    goToModule(moduleID) {
      this.$router.push({
        name: "ModuleView",
        params: {
          moduleID: moduleID
        }
      });
    },
    goToLecturer(lecturerIDs) {
      this.$router.push({
        name: "LecturerList",
        params: {
          lecturerIDs: lecturerIDs
        }
      });
    },
    goToStudent(studentIDs) {
      this.$router.push({
        name: "StudentList",
        params: {
          studentIDs: studentIDs
        }
      });
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
      });
    },
    Login(results) {
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
      let newUser = {};
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
      users = users.filter(user => user.id != newUser.id);
      users.push(newUser);
      this.$session.set("users", users);
    },
    Logout() {
      this.$session.remove("user");
      this.$store.commit("logout");
      this.$router.push("/login");
    }
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
