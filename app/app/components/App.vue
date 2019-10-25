<template>
  <Page actionBarHidden="true">
    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <GridLayout v-if="$store.state.cache.cachedUser" rows="auto,*,auto">
          <CardView
            v-if="$store.state.cache.cachedUser.user"
            row="0"
            class="bg-blue-black p-x-10"
            :elevation="15"
          >
            <GridLayout
              verticalAlignment="center"
              class="p-y-15 m-x-15"
              rows="auto,auto"
              columns="*,auto"
            >
              <Image
                row="0"
                col="0"
                textAlignment="left"
                verticalAlignment="top"
                horizontalAlignment="left"
                stretch="aspectFit"
                width="65"
                height="65"
                borderRadius="100%"
                :src="
                  $store.state.cache.cachedUser.user.profilePic
                    ? $store.state.cache.cachedUser.user.profilePic
                    : $store.state.settings.defaultProfilePic
                "
              ></Image>
              <Label
                row="1"
                col="0"
                fontSize="15%"
                verticalAlignment="center"
                class="font-weight-bold text-white m-t-20"
                :textWrap="true"
                :text="
                  `${$store.state.cache.cachedUser.user.firstname} ${$store.state.cache.cachedUser.user.lastname}`
                "
              />
            </GridLayout>
          </CardView>
          <Image
            row="1"
            src="~/assets/images/coPortalLogo.png"
            stretch="aspectFit"
            verticalAlignment="bottom"
            opacity="0.1"
            textAlignment="right"
            class="m-x-15 bottomLogo"
          ></Image>
          <ScrollView row="1">
            <StackLayout>
              <Ripple
                @tap="goTo(layout)"
                v-for="(layout, i) in drawerLayouts.filter(
                  d =>
                    d.auth == null ||
                    ($store.state.cache.cachedUser &&
                      d.auth.some(
                        auth => auth == $store.state.cache.cachedUser.userType
                      ))
                )"
                :key="i"
              >
                <GridLayout
                  class="drawer-item p-y-10"
                  rows="auto,auto"
                  columns="auto,*"
                >
                  <label
                    row="0"
                    col="0"
                    textAlignment="center"
                    verticalAlignment="center"
                    class="mdi p-5 m-x-10 text-blue-black"
                    fontSize="20%"
                    :text="('mdi-' + layout.icon) | fonticon"
                  ></label>
                  <label
                    row="0"
                    col="1"
                    verticalAlignment="center"
                    class="text-dark-black p-5 m-l-10"
                    fontSize="16%"
                    :text="layout.text"
                  ></label>
                </GridLayout>
              </Ripple>
            </StackLayout>
          </ScrollView>
          <StackLayout textAlignment="center" row="2"> </StackLayout>
        </GridLayout>
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
                class="mdi p-5"
                fontSize="35%"
                :text="'mdi-menu' | fonticon"
              ></label>
            </Ripple>
            <Ripple
              v-if="$store.state.cache.cachedUser"
              verticalAlignment="center"
              class="m-5"
              @tap="goTo(notificationsRoute)"
            >
              <label
                class="mdi p-5"
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
var dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

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
        auth: ["STUDENT", "PARENT"]
      },
      drawerLayouts: [
        {
          text: "My profile",
          icon: "account",
          link: "/student/profile/view",
          description: "View and edit personal information",
          auth: ["STUDENT", "ADMIN", "PARENT"]
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
          auth: ["ADMIN", "LECTURER", "STUDENT", "PARENT"]
        },
        {
          text: "Attendance",
          icon: "calendar-check",
          link: "/student/attendance",
          description: "Students class Attendance",
          auth: ["STUDENT"]
        },
        {
          text: "Attendance",
          icon: "calendar-check",
          link: "/module/list/attend",
          description: "Students class Attendance",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Survey",
          icon: "comment-question-outline",
          link: "/module/list/survey",
          description: "View Surveys",
          auth: ["LECTURER", "ADMIN", "STUDENT"]
        },
        {
          text: "Timetable",
          icon: "table",
          link: "/timetable/view",
          description: "View Your Table",
          auth: ["STUDENT", "PARENT"]
        },
        {
          text: "Settings",
          icon: "settings",
          link: "/settings",
          description: "Customize your portal",
          auth: ["STUDENT", "LECTURER", "ADMIN", "PARENT"]
        },
        /* 
        {
          text: "Switch student",
          icon: "account-convert",
          link: "/login",
          description: "Switch user",
          auth: ["PARENT"]
        }, */
        {
          text: "Log out",
          icon: "exit-run",
          link: "/logout",
          description: "Leave the system",
          auth: ["STUDENT", "LECTURER", "ADMIN", "PARENT"]
        }
      ]
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
    try {
      this.$firebase.admob
        .hideBanner()
        .then(() => {
          console.log("Banner_hidden", true);
        })
        .catch(err => {
          console.log("Banner_hidden_dont_stress_1", err);
        });
    } catch (ex) {
      console.log("Banner_hidden_dont_stress", ex);
    }

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
      } else if (item.link == "/module/list/attend") {
        this.navigate(item.link, { attendance: true });
      } else if (item.link == "/module/list/survey") {
        this.navigate(item.link, { survey: true });
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
