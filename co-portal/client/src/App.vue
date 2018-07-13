<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import "materialize-css/dist/css/materialize.min.css";
var materialize = require("materialize-css/dist/js/materialize.min.js");
import "vue-animate/dist/vue-animate.min.css";

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
  margin-top: 60px;
}

.pointer {
  cursor: pointer;
}
</style>
