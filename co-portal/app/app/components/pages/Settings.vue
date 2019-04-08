<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="mdi text-dark-black" fontSize="50%" :text="'mdi-settings' | fonticon"></label>
          <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Settings"></label>
        </GridLayout>
      </StackLayout>
      <ActivityIndicator verticalAlignment="center" textAlignment="center" row="1" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
      <ScrollView v-if="!isLoading" row="1">
        <label verticalAlignment="center" textAlignment="center" fontSize="24%" text="Coming soon..."></Label>
      </ScrollView>
    </GridLayout>
  </page>
</template>

<script>
  const dialogs = require("ui/dialogs");
  var appSettings = require("application-settings");
  
  import * as connectivity from "tns-core-modules/connectivity";
  export default {
    data() {
      return {
      };
    },
    mounted() {
      console.log("443Called")
      this.pageLoaded();
    },
    methods: {
      pageLoaded() {
        this.$store.commit("refreshCache", {
          db: this.$db,
          api: this.$api,
          appSettings: this.appSettings,
          doc: "admin"
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .topMainText {
    color: white;
    background-color: linear-gradient( top bottom, rgba(255, 0, 0, 0.5), rgba(255, 20, 0, 0.7), rgba(255, 0, 30, 0.5), rgba(255, 20, 30, 0.7));
  }
  
  .backgroundImage {
    background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center center;
    background-size: cover;
    padding-top: 3%;
    padding-bottom: 3%;
  }
  
  .backgroundImageOverlay {
    background-color: rgba(0, 0, 0, 0.3);
    z-index: -1;
  }
  
  .bg-dark-blue-overlay {
    background-color: rgba(0, 0, 0, 0.4);
  }
</style>
