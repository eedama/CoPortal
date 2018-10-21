<template>
  <div id="app">
    <nav class="navFixed z-depth-2" v-if="$route.meta.showNav">
      <div class="nav-wrapper">
        <a v-on:click="$router.push('/')" class="brand-logo pointer waves-effect">
          <md-avatar>
            <img class="img-responsive" src="static/img/co-portalIcon.png">
          </md-avatar>
        </a>
        <ul class="right hide-on-med-and-down">
          <li v-if="$store.state.user.isLoggedIn"><a v-on:click="$router.push('/module/list')" class="black-text"><i class="material-icons">books</i></a></li>
          <li v-if="$store.state.user.isLoggedIn && ($store.state.user.type == 'LECTURER' || $store.state.user.type == 'ADMIN')"><a v-on:click="$router.push('/student/list')" class="black-text"><i class="material-icons">people</i></a></li>
          <li v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'ADMIN'"><a v-on:click="$router.push('/lecturer/list')" class="black-text"><i class="material-icons">supervised_user_circle</i></a></li>
          <li v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'STUDENT'"><a v-on:click="$router.push('/marks/all')" class="black-text"><i class="material-icons">done_all</i></a></li>
          <li v-if="$store.state.user.isLoggedIn && ($store.state.user.type == 'LECTURER' || $store.state.user.type == 'ADMIN')"><a v-on:click="$router.push('/marks/sheet')" class="black-text"><i class="material-icons">done_all</i></a></li>
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
export default {
  name: "App"
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
