<template>
  <div id="app">
    <nav class="navFixed z-depth-2" v-if="$route.meta.showNav">
      <div class="nav-wrapper">
        <div class="row brand-logo">
          <div class="col s12 m2">
            <a v-on:click="$router.push('/')" class="pointer waves-effect">
              <md-avatar>
                <img
                  class="img-responsive"
                  src="static/img/co-portalIcon.png"
                />
              </md-avatar>
            </a>
          </div>
          <div class="col s12 m8 hide-on-small-only">
            <ul class="left">
              <li>
                <a
                  @click="changeSchool()"
                  class="center-align pointer waves-effect black-text"
                >
                  <span>{{ $store.state.settings.school }}</span>
                </a>
              </li>
            </ul>
          </div>
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
            v-if="
              $store.state.user.isLoggedIn &&
                ($store.state.user.type == 'LECTURER' ||
                  $store.state.user.type == 'ADMIN')
            "
          >
            <a v-on:click="$router.push('/student/list')" class="black-text">
              <i class="material-icons">people</i>
            </a>
          </li>
          <li
            class="hide-on-med-and-down"
            v-if="
              $store.state.user.isLoggedIn && $store.state.user.type == 'ADMIN'
            "
          >
            <a v-on:click="$router.push('/lecturer/list')" class="black-text">
              <i class="material-icons">supervised_user_circle</i>
            </a>
          </li>
          <li
            class="hide-on-med-and-down"
            v-if="
              $store.state.user.isLoggedIn &&
                $store.state.user.type == 'STUDENT'
            "
          >
            <a v-on:click="$router.push('/marks/all')" class="black-text">
              <i class="material-icons">done_all</i>
            </a>
          </li>
          <li
            class="hide-on-med-and-down"
            v-if="
              $store.state.user.isLoggedIn &&
                ($store.state.user.type == 'LECTURER' ||
                  $store.state.user.type == 'ADMIN')
            "
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
    <router-view style="padding-top:15px" />
  </div>
</template>

<script>
const axios = require("axios");
export default {
  name: "App",
  mounted() {
    if (!this.$store.state.settings.schoolAdded) {
      this.changeSchool();
    }
  },
  methods: {}
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

/** Padding */
.p-0 {
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
}
.p-x-0 {
  padding-left: 0px;
  padding-right: 0px;
}
.p-y-0 {
  padding-top: 0px;
  padding-bottom: 0px;
}
.p-l-0 {
  padding-left: 0px;
}
.p-r-0 {
  padding-right: 0px;
}
.p-t-0 {
  padding-top: 0px;
}
.p-b-0 {
  padding-bottom: 0px;
}
/** Margin */
.m-0 {
  margin-left: 0px;
  margin-right: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
.m-x-0 {
  margin-left: 0px;
  margin-right: 0px;
}
.m-y-0 {
  margin-top: 0px;
  margin-bottom: 0px;
}
.m-l-0 {
  margin-left: 0px;
}
.m-r-0 {
  margin-right: 0px;
}
.m-t-0 {
  margin-top: 0px;
}
.m-b-0 {
  margin-bottom: 0px;
}
/** Padding */
.p-5 {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.p-x-5 {
  padding-left: 5px;
  padding-right: 5px;
}
.p-y-5 {
  padding-top: 5px;
  padding-bottom: 5px;
}
.p-l-5 {
  padding-left: 5px;
}
.p-r-5 {
  padding-right: 5px;
}
.p-t-5 {
  padding-top: 5px;
}
.p-b-5 {
  padding-bottom: 5px;
}
/** Margin */
.m-5 {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.m-x-5 {
  margin-left: 5px;
  margin-right: 5px;
}
.m-y-5 {
  margin-top: 5px;
  margin-bottom: 5px;
}
.m-l-5 {
  margin-left: 5px;
}
.m-r-5 {
  margin-right: 5px;
}
.m-t-5 {
  margin-top: 5px;
}
.m-b-5 {
  margin-bottom: 5px;
}
/** Padding */
.p-10 {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.p-x-10 {
  padding-left: 10px;
  padding-right: 10px;
}
.p-y-10 {
  padding-top: 10px;
  padding-bottom: 10px;
}
.p-l-10 {
  padding-left: 10px;
}
.p-r-10 {
  padding-right: 10px;
}
.p-t-10 {
  padding-top: 10px;
}
.p-b-10 {
  padding-bottom: 10px;
}
/** Margin */
.m-10 {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.m-x-10 {
  margin-left: 10px;
  margin-right: 10px;
}
.m-y-10 {
  margin-top: 10px;
  margin-bottom: 10px;
}
.m-l-10 {
  margin-left: 10px;
}
.m-r-10 {
  margin-right: 10px;
}
.m-t-10 {
  margin-top: 10px;
}
.m-b-10 {
  margin-bottom: 10px;
}
/** Padding */
.p-15 {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 15px;
  padding-bottom: 15px;
}
.p-x-15 {
  padding-left: 15px;
  padding-right: 15px;
}
.p-y-15 {
  padding-top: 15px;
  padding-bottom: 15px;
}
.p-l-15 {
  padding-left: 15px;
}
.p-r-15 {
  padding-right: 15px;
}
.p-t-15 {
  padding-top: 15px;
}
.p-b-15 {
  padding-bottom: 15px;
}
/** Margin */
.m-15 {
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.m-x-15 {
  margin-left: 15px;
  margin-right: 15px;
}
.m-y-15 {
  margin-top: 15px;
  margin-bottom: 15px;
}
.m-l-15 {
  margin-left: 15px;
}
.m-r-15 {
  margin-right: 15px;
}
.m-t-15 {
  margin-top: 15px;
}
.m-b-15 {
  margin-bottom: 15px;
}
/** Padding */
.p-20 {
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
}
.p-x-20 {
  padding-left: 20px;
  padding-right: 20px;
}
.p-y-20 {
  padding-top: 20px;
  padding-bottom: 20px;
}
.p-l-20 {
  padding-left: 20px;
}
.p-r-20 {
  padding-right: 20px;
}
.p-t-20 {
  padding-top: 20px;
}
.p-b-20 {
  padding-bottom: 20px;
}
/** Margin */
.m-20 {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
}
.m-x-20 {
  margin-left: 20px;
  margin-right: 20px;
}
.m-y-20 {
  margin-top: 20px;
  margin-bottom: 20px;
}
.m-l-20 {
  margin-left: 20px;
}
.m-r-20 {
  margin-right: 20px;
}
.m-t-20 {
  margin-top: 20px;
}
.m-b-20 {
  margin-bottom: 20px;
}
/** Padding */
.p-25 {
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 25px;
  padding-bottom: 25px;
}
.p-x-25 {
  padding-left: 25px;
  padding-right: 25px;
}
.p-y-25 {
  padding-top: 25px;
  padding-bottom: 25px;
}
.p-l-25 {
  padding-left: 25px;
}
.p-r-25 {
  padding-right: 25px;
}
.p-t-25 {
  padding-top: 25px;
}
.p-b-25 {
  padding-bottom: 25px;
}
/** Margin */
.m-25 {
  margin-left: 25px;
  margin-right: 25px;
  margin-top: 25px;
  margin-bottom: 25px;
}
.m-x-25 {
  margin-left: 25px;
  margin-right: 25px;
}
.m-y-25 {
  margin-top: 25px;
  margin-bottom: 25px;
}
.m-l-25 {
  margin-left: 25px;
}
.m-r-25 {
  margin-right: 25px;
}
.m-t-25 {
  margin-top: 25px;
}
.m-b-25 {
  margin-bottom: 25px;
}
/** Padding */
.p-30 {
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 30px;
  padding-bottom: 30px;
}
.p-x-30 {
  padding-left: 30px;
  padding-right: 30px;
}
.p-y-30 {
  padding-top: 30px;
  padding-bottom: 30px;
}
.p-l-30 {
  padding-left: 30px;
}
.p-r-30 {
  padding-right: 30px;
}
.p-t-30 {
  padding-top: 30px;
}
.p-b-30 {
  padding-bottom: 30px;
}
/** Margin */
.m-30 {
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 30px;
  margin-bottom: 30px;
}
.m-x-30 {
  margin-left: 30px;
  margin-right: 30px;
}
.m-y-30 {
  margin-top: 30px;
  margin-bottom: 30px;
}
.m-l-30 {
  margin-left: 30px;
}
.m-r-30 {
  margin-right: 30px;
}
.m-t-30 {
  margin-top: 30px;
}
.m-b-30 {
  margin-bottom: 30px;
}
</style>
