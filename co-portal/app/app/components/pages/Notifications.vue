<template>
  <page actionBarHidden="true">
    <ScrollView>
      <GridLayout rows="*,auto,auto" columns="*">
        <StackLayout row="1">
          <GridLayout rows="auto,auto" columns="*">
            <label row="0" verticalAlignment="center" textAlignment="center" class="mdi p-15 text-dark-black" fontSize="50%" :text="'mdi-bell' | fonticon"></label>
            <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Notifications"></label>
          </GridLayout>
        </StackLayout>
        <StackLayout row="2">
          <CardView v-for="a in 10" :key="a" :row="a-1" elevation="15" margin="5">
            <Ripple>
              <GridLayout class="p-15" rows="auto,auto,auto" columns="auto,*,auto">
                <Image row="0" col="0" rowSpan="3" verticalAlignment="center" src="res://ic_logo" width="60" height="60" borderRadius="50%"></Image>
                <label row="0" col="1" class="font-weight-bold" fontSize="16%" :text="notification.sender"></label>
                <label row="0" col="2" class="h4 text-dark-black" :text="notification.time"></label>
                <label row="1" col="1" class="text-dark-black" :textWrap="true" fontSize="13%" colSpan="2" :text="notification.title"></label>
                <label row="2" col="1" class="text-dark-black" :textWrap="true" colSpan="2" :text="notification.message"></label>
              </GridLayout>
            </Ripple>
          </CardView>
        </StackLayout>
      </GridLayout>
    </ScrollView>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      notification: {
        sender: "Admin",
        time: "3 mins ago",
        title: "WHO IS THIS?",
        message: "I think i know you, dont I???"
      },
      introTxt: "Digitalize your business and keep track of all your earnings."
    };
  },
  mounted() {
    this.pageLoaded();
  },
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: appSettings,
        doc: "admin"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
