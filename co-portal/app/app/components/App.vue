<template>
  <Page actionBarHidden="true">
    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <GridLayout rows="auto,*">
          <CardView row="0" class="bg-dark-black" elevation="15">
            <GridLayout class="p-t-25 p-b-5 p-x-15" rows="auto,auto" columns="*,auto">
              <Label row="0" col="0" class="h3" text="Sirwali Joseph" />
              <Label row="1" col="0" class="h4" text="201512860" />
              <Label row="0" col="1" rowSpan="2" verticalAlignment="center" text="Drawer" />
            </GridLayout>
          </CardView>
          <ScrollView row="1">
            <StackLayout>
              <Ripple @tap="goTo(layout)" v-for="(layout,i) in drawerLayouts" :key="i">
                <GridLayout class="drawer-item p-y-10" rows="auto,auto,auto" columns="auto,*">
                  <label row="0" col="0" rowSpan="2" textAlignment="center" verticalAlignment="center" class="mdi m-10 text-dark-black" fontSize="25%" :text="'mdi-' + layout.icon | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-dark-black" fontSize="17%" :text="layout.text"></label>
                  <label row="1" col="1" class="h4 text-dark-black" fontSize="13%" :text="layout.description"></label>
                </GridLayout>
              </Ripple>
            </StackLayout>
          </ScrollView>
        </GridLayout>
      </StackLayout>
  
      <AbsoluteLayout class="bg-dark-black p-x-15 ribbon ribbon-top-right" textAlignment="right" v-if="TNS_ENV !== 'production'">
        <label class="text-white p-x-15 m-x-10 span" textAlignment="center" fontSize="15" text="Demo"></label>
      </AbsoluteLayout>
  
      <GridLayout ~mainContent columns="*" rows="*">
        <GridLayout rows="auto,auto,*" columns="*,auto">
          <StackLayout orientation="horizontal" row="0" class="text-dark-black">
            <Ripple verticalAlignment="center" class="m-5" @tap="$refs.drawer.nativeView.showDrawer()">
              <label class="mdi p-5" fontSize="35%" :text="'mdi-menu' | fonticon"></label>
            </Ripple>
            <Ripple verticalAlignment="center" class="m-5" @tap="goTo(notificationsRoute)">
              <label class="mdi p-5" fontSize="25%" :text="'mdi-bell' | fonticon"></label>
            </Ripple>
          </StackLayout>
          <Navigator colSpan="2" row="1" rowSpan="2" :defaultRoute="loggedIn ? '/home' : '/login'" />
        </GridLayout>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script lang="ts">
import * as connectivity from "tns-core-modules/connectivity";
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
        auth: ["STUDENT", "LECTURER", "ADMIN"]
      },
      drawerLayouts: [
        {
          text: "My profile",
          icon: "account",
          link: "/",
          description: "View and edit personal information",
          auth: ["STUDENT", "LECTURER", "ADMIN"]
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
          text: "Marks",
          icon: "checkbox-multiple-marked-circle-outline",
          link: "/marks/all",
          description: "Test results and marksheets",
          auth: ["STUDENT"]
        },
        {
          text: "Assessment results",
          icon: "checkbox-multiple-marked-circle-outline",
          link: "/marks/sheet",
          description: "Test results and marksheets",
          auth: ["LECTURER", "ADMIN"]
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
          link: "/Student/Report",
          description: "Customize your portal",
          auth: ["STUDENT", "LECTURER", "ADMIN"]
        },
        {
          text: "Log out",
          icon: "exit-run",
          link: "/Student/Report",
          description: "Leave the system",
          auth: ["LECTURER", "ADMIN"]
        }
      ]
    };
  },
  mounted() {
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
      this.connectionType = conn;
    });
  },
  methods: {
    goTo(item) {
      this.$refs.drawer.nativeView.closeDrawer();
      this.navigate(item.link);
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
