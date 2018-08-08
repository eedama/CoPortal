// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";
import VueTyperPlugin from 'vue-typer'
import VueMaterial from "vue-material";

import * as moment from "moment";

import "materialize-css/dist/css/materialize.min.css";
var materialize = require("materialize-css/dist/js/materialize.min.js");
import "vue-animate/dist/vue-animate.min.css";

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
// Vue.use(MdOption)
// Vue.use(Mdfield)

Vue.prototype.$materialize = materialize;
Vue.prototype.$emoji = Emoji;
Vue.mixin({
  methods: {
    getMoment(value) {
      return moment(value);
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
