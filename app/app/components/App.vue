<template>
  <Page actionBarHidden="true">
    <RadSideDrawer ref="drawer">
      <StackLayout v-show="$store.state.cache.cachedUser" ~drawerContent backgroundColor="#ffffff">
        <side-nav
          @closeSideNav="$refs.drawer.nativeView.closeDrawer()"
          v-if="$store.state.cache.cachedUser"
        ></side-nav>
      </StackLayout>

      <GridLayout ~mainContent columns="*" rows="*">
        <GridLayout rows="auto,auto,*" columns="*,auto">
          <StackLayout orientation="horizontal" row="0" class="text-dark-black">
            <Ripple
              v-if="$store.state.cache.cachedUser"
              verticalAlignment="center"
              class="m-5"
              @tap="$refs.drawer.nativeView.showDrawer()"
            >
              <label
                class="mdi p-5 text-peach"
                fontSize="35%"
                :text="'mdi-menu' | fonticon"
              ></label>
            </Ripple>
            <Ripple
              v-if="$store.state.cache.cachedUser"
              verticalAlignment="center"
              class="m-5"
              @tap="navigate('/notifications/list')"
            >
              <label
                class="mdi p-5 text-blue"
                fontSize="25%"
                :text="'mdi-bell' | fonticon"
              ></label>
            </Ripple>
          </StackLayout>
          <StackLayout
            row="0"
            col="1"
            class="bg-dark-black p-x-15 ribbon ribbon-top-right"
            textAlignment="right"
            v-if="TNS_ENV !== 'production'"
          >
            <label
              class="text-white p-x-15 m-x-10 span"
              textAlignment="center"
              fontSize="15"
              text="Demo"
            ></label>
          </StackLayout>
          <Navigator
            colSpan="2"
            row="1"
            rowSpan="2"
            :defaultRoute="userLoggedIn()"
          />
        </GridLayout>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script lang="ts">
import * as connectivity from "tns-core-modules/connectivity";
var appSettings = require("application-settings");
import SideNav from "./main/SideNav.vue";

export default {
  name: "App",
  components: {
    SideNav
  },
  data() {
    return {
      msg: "What???",
      loggedIn: false,
      connectionType: null,
      notificationsRoute: {
        text: "My profile",
        icon: "bell",
        link: "/notifications/list",
        description: "All your notifications in one place",
        auth: ["STUDENT", "PARENT"]
      }
    };
  },
  computed: {
    currentUserSchool() {
      return appSettings.getString("CurrentSchoolName");
    }
  },
  mounted() {
    this.$store.commit("refreshCache", {
      db: this.$db,
      appSettings: this.appSettings,
      api: this.$api
    });

    connectivity.startMonitoring(conn => {
      if (this.connectionType == 0 && conn > 0) {
        this.$feedback.success({
          title: "Back online",
          message: "You are now online"
        });
      } else if (this.connectionType > 0 && conn == 0) {
        this.$feedback.warning({
          title: "You are offline",
          message: "Some features are not accessible offline"
        });
      }
    });
  },
  methods: {
    userLoggedIn() {
      let loggedInUserId = this.appSettings.getBoolean("isLoggedInUserId");
      let loggedInType = this.appSettings.getString("userType");

      let documentID = this.appSettings.getString(
        this.$store.state.cache.cachedUserString
      );

      if (loggedInUserId && documentID != null) {
        if (loggedInType === "LECTURER") {
          return "/module/list";
        } else if (loggedInType === "STUDENT") {
          return "/notifications/list";
        }
      } else {
        return "/login";
      }
    }
  }
};
</script>

<style scoped>
.ribbon {
  transform: rotate(45deg);
  margin-top: 30;
  margin-right: -20;
  z-index: 10;
  overflow: hidden;
}
</style>
