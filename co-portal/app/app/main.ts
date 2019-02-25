import Vue, { registerElement } from "nativescript-vue";
import App from "./components/App.vue";
// Prints Vue logs when --env.production is *NOT* set while building
import store from "./store";

import moment from "moment";

import "./styles.scss";
import { TNSFontIcon, fonticon } from "nativescript-fonticon"; // require the couchbase module

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  mdi: "./assets/materialdesignicons.css"
};
TNSFontIcon.loadCss();

Vue.config.silent = TNS_ENV === "production";

registerElement(
  "RadSideDrawer",
  () => require("nativescript-ui-sidedrawer").RadSideDrawer
);

registerElement("CardView", () => require("nativescript-cardview").CardView);

registerElement("Ripple", () => require("nativescript-ripple").Ripple);

registerElement(
  "PullToRefresh",
  () => require("nativescript-pulltorefresh").PullToRefresh
);

registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);

registerElement(
  "DropDown",
  () => require("nativescript-drop-down/drop-down").DropDown
);

registerElement("CheckBox", () => require("nativescript-checkbox").CheckBox, {
  model: {
    prop: "checked",
    event: "checkedChange"
  }
});

registerElement(
  "ImageZoom",
  () => require("nativescript-image-zoom").ImageZoom
);

registerElement(
  "BottomNavigation",
  () => require("nativescript-bottom-navigation").BottomNavigation
);

registerElement(
  "BottomNavigationTab",
  () => require("nativescript-bottom-navigation").BottomNavigationTab
);

Vue.filter("fonticon", fonticon);

import master from "./services/master";
Vue.prototype.$db = master.couchDB;
Vue.prototype.$feedback = master.feedback;
Vue.prototype.$approx = master.approximateNumber;
Vue.prototype.appSettings = master.appSettings;
Vue.prototype.$firebase = master.firebase;
Vue.prototype.$api = master.http;
Vue.prototype.TNS_ENV = TNS_ENV;

import router from "./services/router";
import Navigator from "nativescript-vue-navigator";
Vue.use(Navigator, {
  routes: router.routes
});
Vue.prototype.$router = router;
Vue.prototype.$route = null;

Vue.mixin({
  data() {
    return {
      isLoading: false,
      toggleSearch: false,
      master: master,
      currentPage: 0
    };
  },
  methods: {
    navigate(to, props = null, options = null) {
      if (to == null) {
        if (this.currentPage && this.currentPage > 0 && !props) {
          this.currentPage--;
        } else {
          this.$navigator.back();
        }
      } else {
        options = options || {};
        options.props = props;
        console.log("Option", options);
        this.$navigator.navigate(to, options);
      }
    },
    getMoment(val = new Date()) {
      return moment(val);
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$start();
