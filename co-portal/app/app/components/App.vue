<template>
  <Page>
    <ActionBar>
      <GridLayout width="100%" columns="auto, *">
        <label col="0" @tap="$refs.drawer.nativeView.showDrawer()" class="mdi m-10" fontSize="25%" :text="'mdi-email' | fonticon"></label>
        <Label class="title" text="Welcome to NativeScript-Vue!" col="1" />
      </GridLayout>
    </ActionBar>
  
    <RadSideDrawer ref="drawer">
      <StackLayout ~drawerContent backgroundColor="#ffffff">
        <Label class="drawer-header" text="Drawer" />
  
        <Label class="drawer-item" text="Item 1" />
        <Label class="drawer-item" text="Item 2" />
        <Label class="drawer-item" text="Item 3" />
      </StackLayout>
  
      <GridLayout ~mainContent columns="*" rows="*">
        <GridLayout rows="auto,auto,*" columns="*,auto">
          <StackLayout colSpan="2" row="0" class="bg-light-red" v-show="connectionType == 0">
            <label class="text-white p-5" fontSize="15" textAlignment="center" text="offline"></label>
          </StackLayout>
          <StackLayout col="1" row="1" class="bg-dark-black p-x-15 ribbon ribbon-top-right" textAlignment="right" v-if="TNS_ENV !== 'production'">
            <label class="text-white p-x-15 m-x-10 span" textAlignment="center" fontSize="15" text="Demo"></label>
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
      connectionType: null
    };
  },
  beforeCreate() {
    this.$store.commit("refreshCache", {
      db: this.$db,
      api: this.$api,
      appSettings: this.appSettings,
      doc: "admin"
    });
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
  methods: {}
};
</script>

<style scoped>
ActionBar {
  color: #ffffff;
}

.title {
  text-align: left;
  padding-left: 16;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}

.drawer-header {
  padding: 50 16 16 16;
  margin-bottom: 16;
  color: #ffffff;
  font-size: 24;
}

.drawer-item {
  padding: 8 16;
  color: #333333;
  font-size: 16;
}

.ribbon {
  transform: rotate(45deg);
  margin-top: 20;
  margin-right: -35;
  z-index: 10;
  overflow: hidden;
}
</style>
