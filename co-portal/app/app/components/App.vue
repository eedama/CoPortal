<template>
  <Page actionBarHidden="true">
    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <GridLayout v-if="$store.state.cache.cachedUser" rows="auto,*">
          <CardView v-if="$store.state.cache.cachedUser.user" row="0" class="bg-dark-black" elevation="15">
            <GridLayout class="p-25" rows="auto,auto" columns="*,auto">
              <Label row="0" col="0" fontSize="20%" class="font-weight-bold text-white p-t-5" :textWrap="true" :text="`${$store.state.cache.cachedUser.user.firstname} ${$store.state.cache.cachedUser.user.lastname}`" />
              <Label row="1" col="0" fontSize="18%" class="h4 text-white p-t-5" :text="$store.state.cache.cachedUser.user.username" />
              <Image row="0" rowSpan="2" col="1" textAlignment="right" verticalAlignment="center" stretch="aspectFit" width="80" height="80" borderRadius="100%" :src="$store.state.cache.cachedUser.user.profilePic ? $store.state.cache.cachedUser.user.profilePic : $store.state.settings.defaultProfilePic"></Image>
            </GridLayout>
          </CardView>
          <ScrollView row="1">
            <StackLayout>
              <Ripple @tap="goTo(layout)" v-for="(layout,i) in drawerLayouts.filter(d => d.auth == null || ($store.state.cache.cachedUser && d.auth.some(auth => auth == $store.state.cache.cachedUser.userType)))" :key="i">
                <GridLayout class="drawer-item p-y-10" rows="auto,auto" columns="auto,*">
                  <label row="0" col="0" textAlignment="center" verticalAlignment="center" class="mdi m-10 text-dark-black" fontSize="35%" :text="'mdi-' + layout.icon | fonticon"></label>
                  <label row="0" col="1" verticalAlignment="center" class="font-weight-bold text-dark-black" fontSize="18%" :text="layout.text"></label>
                </GridLayout>
              </Ripple>
            </StackLayout>
          </ScrollView>
        </GridLayout>
      </StackLayout>
  
      <GridLayout ~mainContent columns="*" rows="*">
        <GridLayout rows="auto,auto,*" columns="*,auto">
          <StackLayout orientation="horizontal" row="0" class="text-dark-black">
            <Ripple v-if="$store.state.cache.cachedUser" verticalAlignment="center" class="m-5" @tap="$refs.drawer.nativeView.showDrawer()">
              <label class="mdi p-5" fontSize="35%" :text="'mdi-menu' | fonticon"></label>
            </Ripple>
            <Ripple v-if="$store.state.cache.cachedUser" verticalAlignment="center" class="m-5" @tap="goTo(notificationsRoute)">
              <label class="mdi p-5" fontSize="25%" :text="'mdi-bell' | fonticon"></label>
            </Ripple>
          </StackLayout>
          <StackLayout row="0" col="1" class="bg-dark-black p-x-15 ribbon ribbon-top-right" textAlignment="right" v-if="TNS_ENV !== 'production'">
            <label class="text-white p-x-15 m-x-10 span" textAlignment="center" fontSize="15" text="Demo"></label>
          </StackLayout>
          <Navigator colSpan="2" row="1" rowSpan="2" :defaultRoute="userLoggedIn()" />
        </GridLayout>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script lang="ts">
import * as connectivity from "tns-core-modules/connectivity";
var dialogs = require("ui/dialogs");
export default {
  name: "App",
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
        auth: ["STUDENT"]
      },
      drawerLayouts: [
        {
          text: "My profile",
          icon: "account",
          link: "/student/profile/view",
          description: "View and edit personal information",
          auth: ["STUDENT", "ADMIN","LECTURER"]
        },
        {
          text: "Students",
          icon: "account-multiple",
          link: "/student/list",
          description: "Students registered to the system",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Lecturers",
          icon: "account-supervisor-circle",
          link: "/lecturer/list",
          description: "Lecturers registered to the system",
          auth: ["ADMIN"]
        },
        {
          text: "Modules",
          icon: "book-open-page-variant",
          link: "/module/list",
          description: "Modules you are registered for",
          auth: ["ADMIN", "LECTURER", "STUDENT"]
        },
        {
          text: "Assessment results",
          icon: "checkbox-multiple-marked-circle-outline",
          link: "/marks/sheet",
          description: "Test results and marksheets",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Timetable",
          icon: "table",
          link: "/timetable/view",
          description: "View Your Table",
          auth: ["STUDENT"]
        },
        {
          text: "Report a student",
          icon: "account-alert-outline",
          link: "/Student/Report",
          description: "Report a student",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Settings",
          icon: "settings",
          link: "/settings",
          description: "Customize your portal",
          auth: ["STUDENT", "LECTURER", "ADMIN"]
        },
        {
          text: "Log out",
          icon: "exit-run",
          link: "/logout",
          description: "Leave the system",
          auth: ["STUDENT", "LECTURER", "ADMIN"]
        }
      ]
    };
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
          console.log("model29", loggedInType);
          return "/notifications/list";
        }
      } else {
        return "/login";
      }
    },
    goTo(item) {
      this.$refs.drawer.nativeView.closeDrawer();
      if (item.link == "/logout") {
        dialogs
          .confirm({
            title: "Log out",
            message: "Are you sure you want to log out?",
            okButtonText: "Yes",
            cancelButtonText: "No"
          })
          .then(result => {
            if (result) {
              this.appSettings.remove("isLoggedInUserId");
              this.appSettings.remove("userType");
              this.appSettings.remove("device_token");

              this.$store.commit("clearCache", {
                db: this.$db,
                appSettings: this.appSettings,
                api: this.$api
              });

              this.navigate("/login", null, {
                clearHistory: true
              });
            }
          });
      } else {
        this.navigate(item.link);
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
