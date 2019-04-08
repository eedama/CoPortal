<template>
  <div id="app">
    <nav class="navFixed z-depth-2" v-if="$route.meta.showNav">
      <div class="nav-wrapper">
        <div class="row brand-logo">
          <div class="col s6">
            <a v-on:click="$router.push('/')" class="pointer waves-effect">
              <md-avatar>
                <img class="img-responsive" src="static/img/co-portalIcon.png">
              </md-avatar>
            </a>
          </div>
          <div class="col s6"></div>
        </div>
        <ul class="right">
          <li v-if="$store.state.user.isLoggedIn">
            <a class="center-align pointer waves-effect black-text">
              <span>{{ $store.state.user.username }}</span>
            </a>
          </li>
          <li class="hide-on-med-and-down" v-if="$store.state.user.isLoggedIn">
            <a v-on:click="$router.push('/module/list')" class="black-text">
              <i class="material-icons">books</i>
            </a>
          </li>
          <li
            class="hide-on-med-and-down"
            v-if="$store.state.user.isLoggedIn && ($store.state.user.type == 'LECTURER' || $store.state.user.type == 'ADMIN')"
          >
            <a v-on:click="$router.push('/student/list')" class="black-text">
              <i class="material-icons">people</i>
            </a>
          </li>
          <li
            class="hide-on-med-and-down"
            v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'ADMIN'"
          >
            <a v-on:click="$router.push('/lecturer/list')" class="black-text">
              <i class="material-icons">supervised_user_circle</i>
            </a>
          </li>
          <li
            class="hide-on-med-and-down"
            v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'STUDENT'"
          >
            <a v-on:click="$router.push('/marks/all')" class="black-text">
              <i class="material-icons">done_all</i>
            </a>
          </li>
          <li
            class="hide-on-med-and-down"
            v-if="$store.state.user.isLoggedIn && ($store.state.user.type == 'LECTURER' || $store.state.user.type == 'ADMIN')"
          >
            <a v-on:click="$router.push('/marks/sheet')" class="black-text">
              <i class="material-icons">done_all</i>
            </a>
          </li>
          <li>
            <a class="black-text" v-on:click="$router.back()">
              <md-icon>keyboard_backspace</md-icon>
              <span>Back</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <router-view style="padding-top:15px"/>
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: "App",
  mounted() {
    if (!this.$store.state.settings.schoolAdded) {
      var webLink = document.location.host;
      webLink = webLink.split(".");
      var school = webLink[0];
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
          }
          console.log("I was called", this.$store.state.settings.baseLink);
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          }
        });
    }
  }
};
</script>

<style>
#app {
  font-family: "lato", "Roboto";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.nav-wrapper {
  background-color: white;
}

.navFixed {
  position: fixed;
  z-index: 9999;
}

.pointer {
  cursor: pointer;
}

.md-active {
  background-color: transparent !important;
  border-bottom: 2px solid black !important;
}
</style>
