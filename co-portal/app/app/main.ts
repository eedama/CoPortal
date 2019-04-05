import Vue, { registerElement } from "nativescript-vue";
import App from "./components/App.vue";
// Prints Vue logs when --env.production is *NOT* set while building
import store from "./store";

import moment from "moment";

import "./styles.scss";
import { TNSFontIcon, fonticon } from "nativescript-fonticon"; // require the couchbase module
import TextFieldPlugin from 'nativescript-material-textfield/vue'; 
Vue.use(TextFieldPlugin);

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

registerElement(
  "PDFView", 
  () => require("nativescript-pdf-view").PDFView
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

var application = require("application");
Vue.mixin({
  data() {
    return {
      isLoading: false,
      toggleSearch: false,
      master: master,
      currentPage: 0,
      previousPage: null
    };
  },
  computed:{
    isKeyboardShowing(){
      return require('nativescript-keyboardshowing').isShowing()
    }
  },
  beforeCreate() {
    if (!this.$firebase || !this.$firebase.initialized) {
      master
        .initFCM(this)
        .then(instance => {
          console.log("firebase instance", this.$firebase);
          this.$firebase = instance;
          console.log("firebase instance", this.$firebase);
        })
        .catch(err => {
          console.log("tag", err);
        });
    }
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
        if (this.$navigator.route.path == to) {
          console.log("Going to same page", to);
          return;
        }

        this.$navigator.navigate(to, options);
      }
    },
    ApplyNavigation(self) {
      var AndroidApplication = application.android;
      var activity = AndroidApplication.foregroundActivity;
      activity = AndroidApplication.foregroundActivity;
      activity.onBackPressed = function(e) {
        if (self.currentPage && self.currentPage > 0) {
          self.currentPage--;
        } else {
          activity.onBackPressed = function() {
            self.navigate(null);
          };
          self.navigate(null);
        }
      };
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
